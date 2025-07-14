import { PrismaClient } from "@prisma/client";
import { seedEcommerceApplication } from "./seed-operations/ecommerce-app-seeder";
import { seedFitnessApplication } from "./seed-operations/fitness-app-seeder";
import { seedSaasApplication } from "./seed-operations/saas-app-seeder";
import { loadTLDsFromCSV } from "./seed-operations/tld-loader";
import { createTestUser } from "./seed-operations/user-creator";

const prisma = new PrismaClient();

async function main() {
  // Load and create comprehensive TLD data from CSV files
  const predefinedTLDs = await loadTLDsFromCSV();
  for (const tldData of predefinedTLDs) {
    await prisma.tLD.upsert({
      where: { extension: tldData.extension },
      update: {
        name: tldData.name,
        category: tldData.category,
        description: tldData.description,
        popularity: tldData.popularity,
        hidden: tldData.hidden,
        sortOrder: tldData.sortOrder,
      },
      create: {
        extension: tldData.extension,
        name: tldData.name,
        category: tldData.category,
        description: tldData.description,
        popularity: tldData.popularity,
        hidden: tldData.hidden,
        sortOrder: tldData.sortOrder,
      },
    });
  }

  // Create test user
  const user = await createTestUser(prisma);

  // Look up TLD IDs for .com and .biz
  const comTld = await prisma.tLD.findUnique({ where: { extension: ".com" } });
  const bizTld = await prisma.tLD.findUnique({ where: { extension: ".biz" } });
  const enabledTldIds = [comTld?.id, bizTld?.id].filter(
    (id): id is string => id !== undefined,
  );

  // Ensure user settings with selected TLD IDs
  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: {
      selectedTldIds: JSON.stringify(enabledTldIds),
    },
    create: {
      userId: user.id,
      selectedTldIds: JSON.stringify(enabledTldIds),
    },
  });

  // Pass enabledTldIds to each application seeder so they only select from enabled TLDs
  await seedFitnessApplication(prisma, user.id, enabledTldIds);
  await seedEcommerceApplication(prisma, user.id, enabledTldIds);
  await seedSaasApplication(prisma, user.id, enabledTldIds);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
