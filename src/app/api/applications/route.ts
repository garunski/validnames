import { getCurrentUser } from "@/app/api/auth/authOperations";
import { prisma } from "@/app/database/client";
import { handleError } from "@/validators/apiErrorResponse";
import { UnauthorizedError } from "@/validators/apiErrorTypes";
import {
  createSuccessResponse,
  errorResponses,
} from "@/validators/apiResponseFormatter";
import { validateRequestBody } from "@/validators/requestValidation";
import { applicationCreateSchema } from "@/validators/schemas";
import { FieldValidationError } from "@/validators/validationTypes";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new UnauthorizedError();
    }

    const applications = await prisma.application.findMany({
      where: {
        userId: user.id,
      },
      include: {
        categories: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return createSuccessResponse(applications);
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

    const validation = await validateRequestBody(
      applicationCreateSchema,
      request,
    );

    if (!validation.success) {
      return errorResponses.validationError(validation.errors!);
    }

    const { name, description } = validation.data ?? {};
    if (!name) {
      return errorResponses.validationError([
        {
          field: "name",
          message: "Name is required",
          code: "VALIDATION_ERROR",
        } as FieldValidationError,
      ]);
    }

    const application = await prisma.application.create({
      data: {
        name,
        description,
        userId: user.id,
      },
      include: {
        categories: true,
      },
    });

    return createSuccessResponse(
      application,
      "Application created successfully",
      201,
    );
  } catch (error) {
    return handleError(error);
  }
}
