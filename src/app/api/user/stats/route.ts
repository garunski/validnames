export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/app/api/auth/authOperations";
import { prisma } from "@/app/database/client";
import { handleError } from "@/validators/apiErrorResponse";
import { createSuccessResponse } from "@/validators/apiResponseFormatter";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return createSuccessResponse(null, "Unauthorized", 401);
    }

    // Get user statistics
    const [applicationsCount, categoriesCount, domainsCount] =
      await Promise.all([
        // Count applications
        prisma.application.count({
          where: { userId: user.id },
        }),

        // Count categories
        prisma.category.count({
          where: {
            application: { userId: user.id },
          },
        }),

        // Count domains
        prisma.domain.count({
          where: {
            category: {
              application: { userId: user.id },
            },
          },
        }),
      ]);

    const stats = {
      totalApplications: applicationsCount,
      totalCategories: categoriesCount,
      totalDomains: domainsCount,
    };

    return createSuccessResponse(stats);
  } catch (error) {
    return handleError(error);
  }
}
