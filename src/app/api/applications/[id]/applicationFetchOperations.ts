import { prisma } from "@/app/database/client";
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

  // Convert selectedTldIds to selectedTldExtensions
  let selectedTldExtensions: string[] = [];
  if (application.selectedTldIds) {
    try {
      const selectedTldIds = JSON.parse(application.selectedTldIds);
      if (selectedTldIds.length > 0) {
        const selectedTlds = await prisma.tLD.findMany({
          where: { id: { in: selectedTldIds } },
          select: { extension: true },
        });
        selectedTldExtensions = selectedTlds.map((tld) => tld.extension);
      }
    } catch (error) {
      console.error("Error parsing selectedTldIds:", error);
    }
  }

  // Add selectedTldExtensions to the response
  const applicationWithTlds = {
    ...application,
    selectedTldExtensions,
  };

  return createSuccessResponse(applicationWithTlds);
}
