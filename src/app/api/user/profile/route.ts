export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/app/api/auth/authOperations";
import { prisma } from "@/app/database/client";
import { handleError } from "@/validators/apiErrorResponse";
import {
  createSuccessResponse,
  errorResponses,
} from "@/validators/apiResponseFormatter";
import { validateRequestBody } from "@/validators/requestValidation";
import { userProfileUpdateSchema } from "@/validators/schemas";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return createSuccessResponse(null, "Unauthorized", 401);
    }

    const validation = await validateRequestBody(
      userProfileUpdateSchema,
      request,
    );

    if (!validation.success) {
      return errorResponses.validationError(validation.errors!);
    }

    const { name, email } = validation.data!;

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return errorResponses.validationError([
          {
            field: "email",
            message: "Email address is already in use",
            code: "EMAIL_ALREADY_EXISTS",
          },
        ]);
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || undefined,
        email: email || undefined,
      },
      select: { id: true, email: true, name: true },
    });

    return createSuccessResponse(
      { user: updatedUser },
      "Profile updated successfully",
    );
  } catch (error) {
    return handleError(error);
  }
}
