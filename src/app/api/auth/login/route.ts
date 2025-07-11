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
    // Log environment check for debugging
    console.log("Login attempt - Environment check:", {
      nodeEnv: process.env.NODE_ENV,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasTurnstileSecret: !!process.env.TURNSTILE_SECRET_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    });

    const validation = await validateRequestBody(userLoginSchema, request);

    if (!validation.success) {
      return errorResponses.validationError(validation.errors!);
    }

    const { email, password, turnstileToken } = validation.data!;

    // Log Turnstile validation attempt
    console.log("Turnstile validation attempt:", {
      hasToken: !!turnstileToken,
      tokenLength: turnstileToken?.length,
      clientIp:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
    });

    // Validate Turnstile token using the extracted token
    const turnstileValidation = await validateTurnstileTokenDirectly(
      turnstileToken,
      request,
    );

    if (!turnstileValidation.success) {
      console.error("Turnstile validation failed:", {
        errorMessage: turnstileValidation.errorMessage,
        environment: process.env.NODE_ENV,
      });
      throw new UnauthorizedError(turnstileValidation.errorMessage!);
    }

    console.log("Turnstile validation successful, proceeding with user lookup");

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      console.log("User not found or no password hash:", {
        email,
        userExists: !!user,
      });
      throw new UnauthorizedError("Invalid credentials");
    }

    if (!user.emailVerified) {
      console.log("User email not verified:", { email });
      throw new UnauthorizedError("Please verify your email before logging in");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      console.log("Password validation failed for user:", { email });
      throw new UnauthorizedError("Invalid credentials");
    }

    console.log("Password validation successful, creating session for user:", {
      email,
      userId: user.id,
    });

    await createSession(user.id);

    return createSuccessResponse(
      {
        user: { id: user.id, email: user.email, name: user.name },
      },
      "Login successful",
    );
  } catch (error) {
    console.error("Login error details:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      environment: process.env.NODE_ENV,
    });
    return handleError(error);
  }
}
