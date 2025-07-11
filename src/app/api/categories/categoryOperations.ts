import { prisma } from "@/app/database/client";
import { NotFoundError } from "@/validators/apiErrorTypes";
import {
  createSuccessResponse,
  errorResponses,
} from "@/validators/apiResponseFormatter";
import {
  validateQueryParams,
  validateRequestBody,
} from "@/validators/requestValidation";
import { categoryCreateSchema } from "@/validators/schemas";
import { FieldValidationError } from "@/validators/validationTypes";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function fetchCategoriesForUser(
  userId: string,
  applicationId?: string,
) {
  const where: { application: { userId: string }; applicationId?: string } = {
    application: {
      userId,
    },
  };

  if (applicationId) {
    where.applicationId = applicationId;
  }

  const categories = await prisma.category.findMany({
    where,
    include: {
      domains: {
        include: {
          checks: true,
        },
      },
      application: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Sort categories to ensure Favorite comes after Overview (which is not a real category)
  // We'll sort them in the frontend, but for now just return as is
  // The frontend will handle the proper ordering
  return createSuccessResponse(categories);
}

export async function createCategoryForUser(
  request: NextRequest,
  userId: string,
) {
  const validation = await validateRequestBody(categoryCreateSchema, request);

  if (!validation.success) {
    return errorResponses.validationError(validation.errors!);
  }

  const { name, description, applicationId } = validation.data!;
  if (!name || !applicationId) {
    return errorResponses.validationError([
      {
        field: "name",
        message: "Name is required",
        code: "VALIDATION_ERROR",
      } as FieldValidationError,
      {
        field: "applicationId",
        message: "Application ID is required",
        code: "VALIDATION_ERROR",
      } as FieldValidationError,
    ]);
  }

  // Verify the application belongs to the user
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId,
    },
  });

  if (!application) {
    throw new NotFoundError("Application");
  }

  const category = await prisma.category.create({
    data: {
      name,
      description,
      applicationId,
    },
    include: {
      domains: true,
      application: true,
    },
  });

  return createSuccessResponse(category, "Category created successfully", 201);
}

export async function deleteCategoryForUser(
  request: NextRequest,
  userId: string,
) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  // Validate categoryId
  const validation = validateQueryParams(
    z.object({ categoryId: z.string().min(1, "Category ID is required") }),
    request,
  );
  if (!validation.success) {
    return errorResponses.validationError(validation.errors!);
  }

  // Verify the category belongs to the user
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId!,
      application: {
        userId,
      },
    },
    include: {
      domains: {
        include: {
          checks: true,
        },
      },
    },
  });

  if (!category) {
    throw new NotFoundError("Category");
  }

  // Delete background jobs associated with this category to prevent orphan data
  await prisma.backgroundJob.deleteMany({
    where: {
      categoryId: categoryId!,
      userId,
    },
  });

  // Delete the category (domains and checks will be deleted automatically via cascade)
  await prisma.category.delete({
    where: {
      id: categoryId!,
    },
  });

  return createSuccessResponse(null, "Category deleted successfully", 200);
}
