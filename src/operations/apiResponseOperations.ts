import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Standard error response for Turnstile validation failures
 */
export function createTurnstileErrorResponse(errorMessage: string) {
  return NextResponse.json({ error: errorMessage }, { status: 401 });
}

/**
 * Standard error response for validation failures
 */
export function createValidationErrorResponse(error: z.ZodError) {
  return NextResponse.json(
    {
      error: "Validation failed",
      details: error.errors.map((e) => e.message),
    },
    { status: 400 },
  );
}

/**
 * Standard error response for general server errors
 */
export function createServerErrorResponse(
  message: string,
  status: number = 500,
) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Standard success response for email operations
 */
export function createEmailSuccessResponse(message: string) {
  return NextResponse.json({ message });
}

/**
 * Standard response for user not found scenarios
 */
export function createUserNotFoundResponse() {
  return NextResponse.json({ error: "User not found" }, { status: 404 });
}

/**
 * Standard response for already verified email
 */
export function createAlreadyVerifiedResponse() {
  return NextResponse.json(
    { error: "Email already verified" },
    { status: 400 },
  );
}

/**
 * Standard response for password reset (doesn't reveal user existence)
 */
export function createPasswordResetResponse() {
  return NextResponse.json({
    message: "If an account exists, password reset email sent",
  });
}

/**
 * Wrapper for handling API route errors with consistent formatting
 */
export async function handleApiRouteError(
  error: unknown,
  defaultMessage: string = "An error occurred",
) {
  if (error instanceof z.ZodError) {
    return createValidationErrorResponse(error);
  }

  console.error(`${defaultMessage}:`, error);
  return createServerErrorResponse(defaultMessage);
}

/**
 * Standard pattern for API routes that need Turnstile validation
 */
export async function withTurnstileValidation(
  request: NextRequest,
  handler: (data: unknown) => Promise<NextResponse>,
) {
  try {
    const body = await request.json();
    const { turnstileToken, ...data } = body;

    if (!turnstileToken) {
      return createTurnstileErrorResponse("Security check required");
    }

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Import here to avoid circular dependencies
    const { validateTurnstileToken, getTurnstileErrorMessage } = await import(
      "@/operations/turnstileValidationOperations"
    );

    const turnstileValidation = await validateTurnstileToken(
      turnstileToken,
      clientIp,
    );

    if (!turnstileValidation.success) {
      const errorMessage = getTurnstileErrorMessage(
        turnstileValidation.errorCodes || [],
      );
      return createTurnstileErrorResponse(errorMessage);
    }

    return await handler(data);
  } catch (error) {
    return handleApiRouteError(error, "Request processing failed");
  }
}
