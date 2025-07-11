import { getCurrentUser } from "@/app/api/auth/authOperations";
import { prisma } from "@/app/database/client";
import { handleError } from "@/validators/apiErrorResponse";
import { NotFoundError, UnauthorizedError } from "@/validators/apiErrorTypes";
import {
  createSuccessResponse,
  errorResponses,
} from "@/validators/apiResponseFormatter";
import { validateRequestBody } from "@/validators/requestValidation";
import { domainUpdateSchema } from "@/validators/schemas";
import { NextRequest } from "next/server";
import {
  handleFavoriteDomainOperation,
  moveDomainToCategory,
} from "./domainOperations";

function extractIdFromRequest(request: NextRequest): string {
  const segments = request.nextUrl.pathname.split("/");
  return segments[segments.length - 1];
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new UnauthorizedError();
    }

    const domainId = extractIdFromRequest(request);
    const validation = await validateRequestBody(domainUpdateSchema, request);

    if (!validation.success) {
      return errorResponses.validationError(validation.errors!);
    }

    const { categoryId } = validation.data!;

    if (!categoryId) {
      return errorResponses.validationError([
        {
          field: "categoryId",
          message: "Category ID is required",
          code: "VALIDATION_ERROR",
        },
      ]);
    }

    // Verify the domain belongs to the user
    const domain = await prisma.domain.findFirst({
      where: {
        id: domainId,
        category: {
          application: {
            userId: user.id,
          },
        },
      },
      include: {
        category: {
          include: {
            application: true,
          },
        },
        checks: {
          include: {
            tld: true,
          },
        },
      },
    });

    if (!domain) {
      throw new NotFoundError("Domain");
    }

    // Handle favorite domain operation
    const favoriteResult = await handleFavoriteDomainOperation(
      domain,
      categoryId,
    );
    if (favoriteResult) {
      return favoriteResult;
    }

    // Handle regular category move
    return await moveDomainToCategory(domainId, categoryId, user.id);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new UnauthorizedError();
    }

    const domainId = extractIdFromRequest(request);

    // Validate domainId
    if (!domainId || domainId.trim() === "") {
      return errorResponses.validationError([
        {
          field: "domainId",
          message: "Domain ID is required",
          code: "VALIDATION_ERROR",
        },
      ]);
    }

    // Verify the domain belongs to the user
    const domain = await prisma.domain.findFirst({
      where: {
        id: domainId,
        category: {
          application: {
            userId: user.id,
          },
        },
      },
      include: {
        checks: true,
      },
    });

    if (!domain) {
      throw new NotFoundError("Domain");
    }

    // Delete the domain (checks will be deleted automatically via cascade)
    await prisma.domain.delete({
      where: {
        id: domainId,
      },
    });

    return createSuccessResponse(null, "Domain deleted successfully", 200);
  } catch (error) {
    return handleError(error);
  }
}
