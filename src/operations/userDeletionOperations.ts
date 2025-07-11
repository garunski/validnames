/**
 * Data export options
 */
import { convertTldIdsToExtensions } from "./tldConversionOperations";

export interface DataExportOptions {
  includeApplications: boolean;
  includeCategories: boolean;
  includeDomains: boolean;
  includeProfile: boolean;
}

/**
 * Exports user data for GDPR compliance
 * @param userId - The user ID
 * @param options - Export options
 * @returns Exported data
 */
export async function exportUserData(
  userId: string,
  options: DataExportOptions,
): Promise<Record<string, unknown>> {
  const { prisma } = await import("@/app/database/client");

  const exportData: Record<string, unknown> = {
    exportedAt: new Date().toISOString(),
    userId,
  };

  // Get user profile (excluding ID)
  if (options.includeProfile) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        emailVerified: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    exportData.profile = user;
  }

  // Get applications (excluding IDs, converting TLD IDs to extensions)
  if (options.includeApplications) {
    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        categories: {
          include: { domains: true }, // Always include domains
        },
      },
    });

    // Process applications to exclude IDs and convert TLD IDs to extensions
    const processedApplications = await Promise.all(
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

    exportData.applications = processedApplications;
  }

  // Get categories separately if needed (excluding IDs)
  if (options.includeCategories && !options.includeApplications) {
    const applications = await prisma.application.findMany({
      where: { userId },
      select: { id: true },
    });
    const applicationIds = applications.map((a) => a.id);

    if (applicationIds.length > 0) {
      const categories = await prisma.category.findMany({
        where: { applicationId: { in: applicationIds } },
        include: { domains: true }, // Always include domains
      });

      const processedCategories = categories.map((category) => {
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

      exportData.categories = processedCategories;
    }
  }

  // Get domains separately if needed (excluding IDs)
  if (
    options.includeDomains &&
    !options.includeApplications &&
    !options.includeCategories
  ) {
    const applications = await prisma.application.findMany({
      where: { userId },
      select: { id: true },
    });
    const applicationIds = applications.map((a) => a.id);

    if (applicationIds.length > 0) {
      const categories = await prisma.category.findMany({
        where: { applicationId: { in: applicationIds } },
        select: { id: true },
      });
      const categoryIds = categories.map((c) => c.id);

      if (categoryIds.length > 0) {
        const domains = await prisma.domain.findMany({
          where: { categoryId: { in: categoryIds } },
        });

        const processedDomains = domains.map((domain) => ({
          name: domain.name,
          createdAt: domain.createdAt,
          updatedAt: domain.updatedAt,
        }));

        exportData.domains = processedDomains;
      }
    }
  }

  return exportData;
}

/**
 * Performs the actual user deletion
 * @param userId - The user ID to delete
 */
export async function performUserDeletion(userId: string): Promise<void> {
  const { prisma } = await import("@/app/database/client");

  // Delete all user data in the correct order to respect foreign key constraints
  await prisma.$transaction(async (tx) => {
    // Delete checks (domain availability results)
    await tx.check.deleteMany({
      where: {
        domain: {
          category: {
            application: {
              userId,
            },
          },
        },
      },
    });

    // Delete domains
    await tx.domain.deleteMany({
      where: {
        category: {
          application: {
            userId,
          },
        },
      },
    });

    // Delete categories
    await tx.category.deleteMany({
      where: {
        application: {
          userId,
        },
      },
    });

    // Delete applications
    await tx.application.deleteMany({
      where: { userId },
    });

    // Delete user settings
    await tx.userSettings.deleteMany({
      where: { userId },
    });

    // Delete email verification tokens
    await tx.emailVerificationToken.deleteMany({
      where: { userId },
    });

    // Delete password reset tokens
    await tx.passwordResetToken.deleteMany({
      where: { userId },
    });

    // Delete email rate limits
    await tx.emailRateLimit.deleteMany({
      where: { email: { startsWith: userId } }, // This might need adjustment based on your email format
    });

    // Finally, delete the user
    await tx.user.delete({
      where: { id: userId },
    });
  });
}
