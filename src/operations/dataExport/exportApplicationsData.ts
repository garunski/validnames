import { convertTldIdsToExtensions } from "../tldConversionOperations";
import { DataExportOptions } from "../userDataExportOperations";

export async function exportApplicationsData(
  userId: string,
  options: DataExportOptions,
) {
  const { prisma } = await import("@/app/database/client");
  const applications = await prisma.application.findMany({
    where: { userId },
    include: {
      categories: {
        include: { domains: true },
      },
    },
  });

  return Promise.all(
    applications.map(async (app) => {
      const selectedTldExtensions = await convertTldIdsToExtensions(
        app.selectedTldIds,
      );
      return {
        name: app.name,
        description: app.description,
        selectedTldExtensions,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        categories: app.categories?.map((category) => {
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
        }),
      };
    }),
  );
}
