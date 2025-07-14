import {
  getTurnstileErrorMessage,
  validateTurnstileToken,
} from "@/operations/turnstileValidationOperations";
import { NextRequest } from "next/server";

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
