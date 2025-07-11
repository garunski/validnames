import { DataExportOptions } from "../userDataExportOperations";

export async function exportCategoriesData(
  userId: string,
  options: DataExportOptions,
) {
  const { prisma } = await import("@/app/database/client");
  const applications = await prisma.application.findMany({
    where: { userId },
    select: { id: true },
  });
  const applicationIds = applications.map((a) => a.id);

  if (applicationIds.length === 0) return [];

  const categories = await prisma.category.findMany({
    where: { applicationId: { in: applicationIds } },
    include: { domains: true },
  });

  return categories.map((category) => {
    const base = {
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
    if (options.includeDomains) {
      return {
        ...base,
        domains: category.domains.map((domain) => ({
          name: domain.name,
          createdAt: domain.createdAt,
          updatedAt: domain.updatedAt,
        })),
      };
    }
    return base;
  });
}
