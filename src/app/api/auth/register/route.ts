import { prisma } from "@/app/database/client";
import { validateStandardTurnstileToken } from "@/operations/authenticationOperations";
import { sendEmailVerification } from "@/operations/emailVerificationOperations";
import { generateEmailVerificationToken } from "@/operations/tokenOperations";
import { handleError } from "@/validators/apiErrorResponse";
import { ConflictError, UnauthorizedError } from "@/validators/apiErrorTypes";
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
    // Log registration attempt for debugging
    console.log("Registration attempt - Environment check:", {
      nodeEnv: process.env.NODE_ENV,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasTurnstileSecret: !!process.env.TURNSTILE_SECRET_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    });

    const validation = await validateRequestBody(
      userRegistrationSchema,
      request,
    );

    if (!validation.success) {
      console.log("Registration validation failed:", validation.errors);
      return errorResponses.validationError(validation.errors!);
    }

    const { email, password, name, turnstileToken } = validation.data!;

    // Log Turnstile validation attempt
    console.log("Registration Turnstile validation attempt:", {
      hasToken: !!turnstileToken,
      tokenLength: turnstileToken?.length,
      clientIp:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
    });

    // Validate Turnstile token using shared operation
    const turnstileValidation = await validateStandardTurnstileToken(request);

    if (!turnstileValidation.success) {
      console.error("Registration Turnstile validation failed:", {
        errorMessage: turnstileValidation.errorMessage,
        environment: process.env.NODE_ENV,
      });
      throw new UnauthorizedError(turnstileValidation.errorMessage!);
    }

    console.log(
      "Registration Turnstile validation successful, proceeding with user creation",
    );

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists during registration:", { email });
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

    console.log("User created successfully:", { email, userId: user.id });

    // Send verification email
    const token = await generateEmailVerificationToken(user.id);
    await sendEmailVerification(user.email, user.name || "User", token);

    return createSuccessResponse(
      {
        user: { id: user.id, email: user.email, name: user.name },
      },
      "User created successfully. Please check your email to verify your account.",
      201,
    );
  } catch (error) {
    console.error("Registration error details:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      environment: process.env.NODE_ENV,
    });
    return handleError(error);
  }
}
