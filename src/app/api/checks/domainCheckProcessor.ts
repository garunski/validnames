import { prisma } from "@/app/database/client";
import { domainAvailabilityChecker } from "./domainCheckingOperations";

export async function processDomainCheck(
  domainName: string,
  tldExtension: string,
  categoryId: string,
  batchId: string,
): Promise<void> {
  // Find or create TLD
  let tld = await prisma.tLD.findFirst({
    where: { extension: tldExtension },
  });

  if (!tld) {
    tld = await prisma.tLD.create({
      data: {
        extension: tldExtension,
        name: tldExtension.replace(/^\./, "").toUpperCase(),
        category: "Unknown",
        description: "Auto-created TLD",
        popularity: null,
        hidden: false,
        sortOrder: 9999,
      },
    });
  }

  // Find or create domain and get its id
  if (!categoryId) {
    throw new Error("categoryId is required to create a domain");
  }
  const domainId =
    (
      await prisma.domain.findFirst({
        where: {
          name: domainName,
          categoryId: categoryId,
        },
      })
    )?.id ||
    (
      await prisma.domain.create({
        data: {
          name: domainName,
          categoryId: categoryId,
        },
      })
    ).id;

  // Perform WHOIS check
  const whoisResult = await performWhoisCheck(domainName, tldExtension);

  // Create or update check record
  await prisma.check.upsert({
    where: {
      domainId_tldId: {
        domainId,
        tldId: tld.id,
      },
    },
    update: {
      isAvailable: whoisResult.isAvailable,
      trustScore: whoisResult.trustScore,
      domainAge: whoisResult.age,
      checkedAt: new Date(),
      batchId: batchId,
    },
    create: {
      domainId,
      tldId: tld.id,
      isAvailable: whoisResult.isAvailable,
      trustScore: whoisResult.trustScore,
      domainAge: whoisResult.age,
      checkedAt: new Date(),
      batchId: batchId,
    },
  });
}

export async function processDomainCheckWithError(
  domainName: string,
  tldExtension: string,
  categoryId: string,
  batchId: string,
): Promise<void> {
  // Create error record using already-queried IDs
  await prisma.check.upsert({
    where: {
      domainId_tldId: {
        domainId:
          (
            await prisma.domain.findFirst({
              where: {
                name: domainName,
                categoryId: categoryId || undefined,
              },
            })
          )?.id || "",
        tldId:
          (
            await prisma.tLD.findFirst({
              where: { extension: tldExtension },
            })
          )?.id || "",
      },
    },
    update: {
      isAvailable: null,
      checkedAt: new Date(),
      batchId: batchId,
    },
    create: {
      domainId:
        (
          await prisma.domain.findFirst({
            where: {
              name: domainName,
              categoryId: categoryId || undefined,
            },
          })
        )?.id || "",
      tldId:
        (
          await prisma.tLD.findFirst({
            where: { extension: tldExtension },
          })
        )?.id || "",
      isAvailable: null,
      checkedAt: new Date(),
      batchId: batchId,
    },
  });
}

async function performWhoisCheck(
  domain: string,
  tld: string,
): Promise<{
  isAvailable: boolean | null;
  trustScore: number | null;
  age: number | null;
}> {
  try {
    // Use the real WHOIS implementation from DomainAvailabilityChecker
    const result = await domainAvailabilityChecker.checkDomain(domain, tld);

    return {
      isAvailable: result.isAvailable,
      trustScore: result.trustScore || null,
      age: result.domainAge || null,
    };
  } catch (error) {
    console.error(`WHOIS check failed for ${domain}.${tld}:`, error);
    return { isAvailable: null, trustScore: null, age: null };
  }
}
