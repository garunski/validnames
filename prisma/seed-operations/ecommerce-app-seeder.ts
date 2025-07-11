import { PrismaClient } from "@prisma/client";

export async function seedEcommerceApplication(
  prisma: PrismaClient,
  userId: string,
  enabledTldIds: string[],
) {
  // Application 2: E-commerce Platform
  const existingEcommerceApp = await prisma.application.findFirst({
    where: {
      name: "E-commerce Platform",
      userId: userId,
    },
  });

  const ecommerceApp =
    existingEcommerceApp ||
    (await prisma.application.create({
      data: {
        name: "E-commerce Platform",
        description: "Online marketplace and shopping platform",
        userId: userId,
      },
    }));

  // Set default selected TLDs for this application (e.g., .com and .store) but only if in enabledTldIds
  const tlds = await prisma.tLD.findMany({
    where: { extension: { in: [".com", ".store"] } },
  });
  const selectedTldIds = tlds
    .map((tld) => tld.id)
    .filter((id) => enabledTldIds.includes(id));
  if (selectedTldIds.length > 0) {
    await prisma.application.update({
      where: { id: ecommerceApp.id },
      data: { selectedTldIds: JSON.stringify(selectedTldIds) },
    });
  }

  // Categories for E-commerce App
  const ecommerceCategories = [
    {
      name: "Shopping & Marketplace",
      description: "General shopping and marketplace domains",
      domains: [
        "shopnow",
        "marketplace",
        "buynow",
        "shopmart",
        "ecommerce",
        "onlineshop",
      ],
    },
    {
      name: "Fashion & Style",
      description: "Fashion and style related domains",
      domains: [
        "fashionstore",
        "styleshop",
        "trendyshop",
        "fashionhub",
        "stylecenter",
        "fashionmart",
      ],
    },
    {
      name: "Electronics & Tech",
      description: "Technology and electronics domains",
      domains: [
        "techstore",
        "gadgetshop",
        "electronicsmart",
        "techmart",
        "gadgethub",
        "techdeals",
      ],
    },
  ];

  for (const categoryData of ecommerceCategories) {
    const category = await prisma.category.upsert({
      where: {
        applicationId_name: {
          applicationId: ecommerceApp.id,
          name: categoryData.name,
        },
      },
      update: {
        description: categoryData.description,
      },
      create: {
        name: categoryData.name,
        description: categoryData.description,
        applicationId: ecommerceApp.id,
      },
    });

    for (const domainName of categoryData.domains) {
      await prisma.domain.upsert({
        where: {
          name_categoryId: {
            name: domainName,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          name: domainName,
          categoryId: category.id,
        },
      });
    }
  }
}
