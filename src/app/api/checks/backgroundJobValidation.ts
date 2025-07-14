import { BatchCheckRequest } from "@/app/api/checks/domainCheckingTypes";
import { prisma } from "@/app/database/client";

export async function validateAndPrepareBackgroundJobData(
  userId: string,
  request: BatchCheckRequest & { tldExtensions?: string[] },
) {
  const { domainIds, tldIds, tldExtensions } = request;

  if (!domainIds?.length) {
    throw new Error("Domain IDs are required");
  }

  // Support both tldIds (legacy) and tldExtensions (new format)
  let finalTldIds: string[] = [];

  if (tldExtensions?.length) {
    // Convert extensions to IDs
    const tlds = await prisma.tLD.findMany({
      where: { extension: { in: tldExtensions } },
      select: { id: true },
    });
    finalTldIds = tlds.map((tld) => tld.id);
  } else if (tldIds?.length) {
    finalTldIds = tldIds;
  }

  if (!finalTldIds.length) {
    throw new Error("TLD IDs are required");
  }

  // Verify domains belong to the user
  const domains = await prisma.domain.findMany({
    where: {
      id: { in: domainIds },
      category: {
        application: {
          userId,
        },
      },
    },
    include: {
      category: {
        include: {
          application: true,
        },
      },
    },
  });

  if (domains.length !== domainIds.length) {
    throw new Error("Some domains not found");
  }

  const tlds = await prisma.tLD.findMany({
    where: { id: { in: finalTldIds } },
  });

  return { domains, tlds };
}
