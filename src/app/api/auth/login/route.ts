import { createSession } from "@/app/api/auth/authOperations";
import { prisma } from "@/app/database/client";
import { validateTurnstileTokenDirectly } from "@/operations/authenticationOperations";
import { handleError } from "@/validators/apiErrorResponse";
import { UnauthorizedError } from "@/validators/apiErrorTypes";
import {
  createSuccessResponse,
  errorResponses,
} from "@/validators/apiResponseFormatter";
import { validateRequestBody } from "@/validators/requestValidation";
import { userLoginSchema } from "@/validators/schemas";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const validation = await validateRequestBody(userLoginSchema, request);

    if (!validation.success) {
      return errorResponses.validationError(validation.errors!);
    }

    const { email, password, turnstileToken } = validation.data!;

    // Validate Turnstile token using the extracted token
    const turnstileValidation = await validateTurnstileTokenDirectly(
      turnstileToken,
      request,
    );

    if (!turnstileValidation.success) {
      throw new UnauthorizedError(turnstileValidation.errorMessage!);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (!user.emailVerified) {
      throw new UnauthorizedError("Please verify your email before logging in");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    await createSession(user.id);

    return createSuccessResponse(
      {
        user: { id: user.id, email: user.email, name: user.name },
      },
      "Login successful",
    );
  } catch (error) {
    return handleError(error);
  }
}
