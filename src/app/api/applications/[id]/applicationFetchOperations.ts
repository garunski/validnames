import { prisma } from "@/app/database/client";
import { processTldDataForResponse } from "@/operations/tldConversionOperations";
import { NotFoundError } from "@/validators/apiErrorTypes";
import { createSuccessResponse } from "@/validators/apiResponseFormatter";

export async function fetchApplicationWithDetails(
  applicationId: string,
  userId: string,
) {
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId: userId,
    },
    include: {
      categories: {
        include: {
          domains: {
            include: {
              checks: {
                include: {
                  tld: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!application) {
    throw new NotFoundError("Application not found");
  }

  // Convert selectedTldIds to selectedTldExtensions using shared operation
  const { selectedTldExtensions } = await processTldDataForResponse(
    application.selectedTldIds,
  );

  // Add selectedTldExtensions to the response
  const applicationWithTlds = {
    ...application,
    selectedTldExtensions,
  };

  return createSuccessResponse(applicationWithTlds);
}
