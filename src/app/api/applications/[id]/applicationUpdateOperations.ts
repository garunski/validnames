import { prisma } from "@/app/database/client";
import { NotFoundError } from "@/validators/apiErrorTypes";
import {
  createSuccessResponse,
  errorResponses,
} from "@/validators/apiResponseFormatter";
import {
  applicationCreateSchema,
  applicationTldUpdateSchema,
} from "@/validators/applicationSchemas";
import { validateRequestBody } from "@/validators/requestValidation";
import { NextRequest } from "next/server";

export async function updateApplicationDetails(
  request: NextRequest,
  applicationId: string,
  userId: string,
) {
  // Clone the request to read the body multiple times
  const clonedRequest = request.clone();
  const body = await clonedRequest.json();

  // Check if this is a TLD update request
  if (body.selectedTldExtensions !== undefined) {
    const tldValidation = await validateRequestBody(
      applicationTldUpdateSchema,
      request,
    );

    if (!tldValidation.success) {
      return errorResponses.validationError(tldValidation.errors!);
    }

    const { selectedTldExtensions } = tldValidation.data!;

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId: userId,
      },
    });

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    // Convert TLD extensions to IDs
    let selectedTldIds: string[] = [];
    if (selectedTldExtensions.length > 0) {
      const tlds = await prisma.tLD.findMany({
        where: { extension: { in: selectedTldExtensions } },
        select: { id: true },
      });
      selectedTldIds = tlds.map((tld) => tld.id);
    }

    // Update the application with the new TLD selections
    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        selectedTldIds: JSON.stringify(selectedTldIds),
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

    // Convert back to extensions for response
    const applicationWithTlds = {
      ...updatedApplication,
      selectedTldExtensions,
    };

    return createSuccessResponse(
      applicationWithTlds,
      "Application TLD settings updated successfully",
    );
  }

  // Handle regular application updates (name, description)
  const validation = await validateRequestBody(
    applicationCreateSchema,
    request,
  );

  if (!validation.success) {
    return errorResponses.validationError(validation.errors!);
  }

  const { name, description } = validation.data!;

  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId: userId,
    },
  });

  if (!application) {
    throw new NotFoundError("Application not found");
  }

  const updatedApplication = await prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      name,
      description,
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

  return createSuccessResponse(
    updatedApplication,
    "Application updated successfully",
  );
}
