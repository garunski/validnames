import { getCurrentUser } from "@/app/api/auth/authOperations";
import { prisma } from "@/app/database/client";
import { handleError } from "@/validators/apiErrorResponse";
import { NotFoundError, UnauthorizedError } from "@/validators/apiErrorTypes";
import {
  createSuccessResponse,
  errorResponses,
} from "@/validators/apiResponseFormatter";
import {
  validateQueryParams,
  validateRequestBody,
} from "@/validators/requestValidation";
import { domainCreateSchema } from "@/validators/schemas";
import { FieldValidationError } from "@/validators/validationTypes";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new UnauthorizedError();
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    // Validate categoryId if provided
    if (categoryId) {
      const validation = validateQueryParams(
        z.object({ categoryId: z.string().min(1, "Category ID is required") }),
        request,
      );
      if (!validation.success) {
        return errorResponses.validationError(validation.errors!);
      }
    }

    const where: {
      category: { application: { userId: string } };
      categoryId?: string;
    } = {
      category: {
        application: {
          userId: user.id,
        },
      },
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const domains = await prisma.domain.findMany({
      where,
      include: {
        checks: {
          include: {
            tld: true,
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return createSuccessResponse(domains);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new UnauthorizedError();
    }

    const validation = await validateRequestBody(domainCreateSchema, request);

    if (!validation.success) {
      return errorResponses.validationError(validation.errors!);
    }

    const { name, categoryId } = validation.data ?? {};
    if (!name || !categoryId) {
      return errorResponses.validationError([
        {
          field: "name",
          message: "Name is required",
          code: "VALIDATION_ERROR",
        } as FieldValidationError,
        {
          field: "categoryId",
          message: "Category ID is required",
          code: "VALIDATION_ERROR",
        } as FieldValidationError,
      ]);
    }

    // Verify the category belongs to the user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        application: {
          userId: user.id,
        },
      },
    });

    if (!category) {
      throw new NotFoundError("Category");
    }

    const domain = await prisma.domain.create({
      data: {
        name,
        categoryId,
      },
      include: {
        checks: {
          include: {
            tld: true,
          },
        },
        category: true,
      },
    });

    return createSuccessResponse(domain, "Domain created successfully", 201);
  } catch (error) {
    return handleError(error);
  }
}
