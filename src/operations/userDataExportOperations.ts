import { exportApplicationsData } from "./dataExport/exportApplicationsData";
import { exportCategoriesData } from "./dataExport/exportCategoriesData";
import { exportDomainsData } from "./dataExport/exportDomainsData";

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

  if (options.includeApplications) {
    exportData.applications = await exportApplicationsData(userId, options);
  }

  if (options.includeCategories && !options.includeApplications) {
    exportData.categories = await exportCategoriesData(userId, options);
  }

  if (
    options.includeDomains &&
    !options.includeApplications &&
    !options.includeCategories
  ) {
    exportData.domains = await exportDomainsData(userId);
  }

  return exportData;
}

export { exportApplicationsData } from "./dataExport/exportApplicationsData";
export { exportCategoriesData } from "./dataExport/exportCategoriesData";
export { exportDomainsData } from "./dataExport/exportDomainsData";
