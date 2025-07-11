import { prisma } from "@/app/database/client";
import { handleError } from "@/validators/apiErrorResponse";
import { ConflictError } from "@/validators/apiErrorTypes";
import {
  createSuccessResponse,
  errorResponses,
} from "@/validators/apiResponseFormatter";
import { validateRequestBody } from "@/validators/requestValidation";
import { userRegistrationSchema } from "@/validators/schemas";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const validation = await validateRequestBody(
      userRegistrationSchema,
      request,
    );

    if (!validation.success) {
      return errorResponses.validationError(validation.errors!);
    }

    const { email, password, name } = validation.data!;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    return createSuccessResponse(
      {
        user: { id: user.id, email: user.email, name: user.name },
      },
      "User created successfully",
      201,
    );
  } catch (error) {
    return handleError(error);
  }
}
