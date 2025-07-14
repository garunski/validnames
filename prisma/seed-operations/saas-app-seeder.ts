import { PrismaClient } from "@prisma/client";

export async function seedSaasApplication(
  prisma: PrismaClient,
  userId: string,
  enabledTldIds: string[],
) {
  // Application 3: SaaS Tool
  const existingSaasApp = await prisma.application.findFirst({
    where: {
      name: "SaaS Productivity Tool",
      userId: userId,
    },
  });

  const saasApp =
    existingSaasApp ||
    (await prisma.application.create({
      data: {
        name: "SaaS Productivity Tool",
        description: "Cloud-based productivity and collaboration tool",
        userId: userId,
      },
    }));

  // Set default selected TLDs for this application (e.g., .com and .biz) but only if in enabledTldIds
  const tlds = await prisma.tLD.findMany({
    where: { extension: { in: [".com", ".biz"] } },
  });
  const selectedTldIds = tlds
    .map((tld) => tld.id)
    .filter((id) => enabledTldIds.includes(id));
  if (selectedTldIds.length > 0) {
    await prisma.application.update({
      where: { id: saasApp.id },
      data: { selectedTldIds: JSON.stringify(selectedTldIds) },
    });
  }

  // Categories for SaaS App
  const saasCategories = [
    {
      name: "Productivity Tools",
      description: "Productivity and efficiency focused domains",
      domains: [
        "productivitypro",
        "workflowapp",
        "taskmanager",
        "productivehub",
        "worksmarter",
        "effortless",
      ],
    },
    {
      name: "Team Collaboration",
      description: "Team collaboration and communication domains",
      domains: [
        "teamwork",
        "collaborate",
        "teamhub",
        "workteam",
        "teamspace",
        "collaborateapp",
      ],
    },
    {
      name: "Project Management",
      description: "Project management and organization domains",
      domains: [
        "projectpro",
        "manageprojects",
        "projecthub",
        "tasktracker",
        "projectmanager",
        "organizeapp",
      ],
    },
  ];

  for (const categoryData of saasCategories) {
    const category = await prisma.category.upsert({
      where: {
        applicationId_name: {
          applicationId: saasApp.id,
          name: categoryData.name,
        },
      },
      update: {
        description: categoryData.description,
      },
      create: {
        name: categoryData.name,
        description: categoryData.description,
        applicationId: saasApp.id,
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
