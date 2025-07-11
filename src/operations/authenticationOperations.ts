import {
  getTurnstileErrorMessage,
  validateTurnstileToken,
} from "@/operations/turnstileValidationOperations";
import { validateRequestBody } from "@/validators/requestValidation";
import { NextRequest } from "next/server";
import { z } from "zod";

// Common schema for Turnstile token validation
export const turnstileTokenSchema = z.object({
  turnstileToken: z.string().min(1, "Please complete the security check"),
});

// Common schema for email + Turnstile token validation
export const emailWithTurnstileSchema = z.object({
  email: z.string().email(),
  turnstileToken: z.string().min(1, "Please complete the security check"),
});

/**
 * Validates Turnstile token from request headers and body
 */
export async function validateRequestTurnstileToken(
  request: NextRequest,
  tokenField: string = "turnstileToken",
): Promise<{ success: boolean; errorMessage?: string }> {
  try {
    const body = await request.json();
    const token = body[tokenField];

    if (!token) {
      return { success: false, errorMessage: "Security check required" };
    }

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const turnstileValidation = await validateTurnstileToken(token, clientIp);

    if (!turnstileValidation.success) {
      const errorMessage = getTurnstileErrorMessage(
        turnstileValidation.errorCodes || [],
      );
      return { success: false, errorMessage };
    }

    return { success: true };
  } catch {
    return { success: false, errorMessage: "Invalid request format" };
  }
}

/**
 * Validates Turnstile token using the standard validation pattern
 */
export async function validateStandardTurnstileToken(
  request: NextRequest,
): Promise<{ success: boolean; errorMessage?: string }> {
  try {
    const validation = await validateRequestBody(turnstileTokenSchema, request);

    if (!validation.success) {
      return { success: false, errorMessage: "Security check required" };
    }

    const { turnstileToken } = validation.data!;

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const turnstileValidation = await validateTurnstileToken(
      turnstileToken,
      clientIp,
    );

    if (!turnstileValidation.success) {
      const errorMessage = getTurnstileErrorMessage(
        turnstileValidation.errorCodes || [],
      );
      return { success: false, errorMessage };
    }

    return { success: true };
  } catch {
    return { success: false, errorMessage: "Invalid request format" };
  }
}

/**
 * Validates email with Turnstile token using the standard validation pattern
 */
export async function validateEmailWithTurnstileToken(
  request: NextRequest,
): Promise<{
  success: boolean;
  data?: { email: string; turnstileToken: string };
  errorMessage?: string;
}> {
  try {
    const validation = await validateRequestBody(
      emailWithTurnstileSchema,
      request,
    );

    if (!validation.success) {
      return {
        success: false,
        errorMessage: "Invalid email or security check required",
      };
    }

    const { email, turnstileToken } = validation.data!;

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const turnstileValidation = await validateTurnstileToken(
      turnstileToken,
      clientIp,
    );

    if (!turnstileValidation.success) {
      const errorMessage = getTurnstileErrorMessage(
        turnstileValidation.errorCodes || [],
      );
      return { success: false, errorMessage };
    }

    return { success: true, data: { email, turnstileToken } };
  } catch {
    return { success: false, errorMessage: "Invalid request format" };
  }
}
