import { getCurrentUser } from "@/app/api/auth/authOperations";
import { handleError } from "@/validators/apiErrorResponse";
import { UnauthorizedError } from "@/validators/apiErrorTypes";
import { errorResponses } from "@/validators/apiResponseFormatter";
import { validateQueryParams } from "@/validators/requestValidation";
import { NextRequest } from "next/server";
import { z } from "zod";
import {
  createCategoryForUser,
  deleteCategoryForUser,
  fetchCategoriesForUser,
} from "./categoryOperations";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new UnauthorizedError();
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");

    // Validate applicationId if provided
    if (applicationId) {
      const validation = validateQueryParams(
        z.object({
          applicationId: z.string().min(1, "Application ID is required"),
        }),
        request,
      );
      if (!validation.success) {
        return errorResponses.validationError(validation.errors!);
      }
    }

    return await fetchCategoriesForUser(user.id, applicationId || undefined);
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

    return await createCategoryForUser(request, user.id);
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

    return await deleteCategoryForUser(request, user.id);
  } catch (error) {
    return handleError(error);
  }
}
