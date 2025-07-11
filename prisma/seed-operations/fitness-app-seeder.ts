import { PrismaClient } from "@prisma/client";

export async function seedFitnessApplication(
  prisma: PrismaClient,
  userId: string,
  enabledTldIds: string[],
) {
  // Application 1: Fitness Coaching
  const existingFitnessApp = await prisma.application.findFirst({
    where: {
      name: "Fitness Coaching Platform",
      userId: userId,
    },
  });

  const fitnessApp =
    existingFitnessApp ||
    (await prisma.application.create({
      data: {
        name: "Fitness Coaching Platform",
        description: "Online fitness coaching and workout platform",
        userId: userId,
      },
    }));

  // Set default selected TLDs for this application (e.g., .com and .fit) but only if in enabledTldIds
  const tlds = await prisma.tLD.findMany({
    where: { extension: { in: [".com", ".fit"] } },
  });
  const selectedTldIds = tlds
    .map((tld) => tld.id)
    .filter((id) => enabledTldIds.includes(id));
  if (selectedTldIds.length > 0) {
    await prisma.application.update({
      where: { id: fitnessApp.id },
      data: { selectedTldIds: JSON.stringify(selectedTldIds) },
    });
  }

  // Categories for Fitness App
  const fitnessCategories = [
    {
      name: "Core Fitness",
      description: "Main fitness and workout related domains",
      domains: [
        "fitcoach",
        "workoutpro",
        "fitnessguide",
        "trainhard",
        "getfit",
        "fitnesshub",
      ],
    },
    {
      name: "Personal Training",
      description: "Personal training and coaching domains",
      domains: [
        "personaltrainer",
        "fitnesstrainer",
        "coachfit",
        "trainwithme",
        "fitnesscoach",
        "personalfit",
      ],
    },
    {
      name: "Wellness & Health",
      description: "Health and wellness focused domains",
      domains: [
        "wellnesscoach",
        "healthylife",
        "fitwellness",
        "healthfit",
        "wellnessguide",
        "healthycoach",
      ],
    },
  ];

  for (const categoryData of fitnessCategories) {
    const category = await prisma.category.upsert({
      where: {
        applicationId_name: {
          applicationId: fitnessApp.id,
          name: categoryData.name,
        },
      },
      update: {
        description: categoryData.description,
      },
      create: {
        name: categoryData.name,
        description: categoryData.description,
        applicationId: fitnessApp.id,
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
