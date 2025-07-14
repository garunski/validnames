import {
  getTurnstileErrorMessage,
  validateTurnstileToken,
} from "@/operations/turnstileValidationOperations";
import { NextRequest } from "next/server";

export async function validateTurnstileTokenDirectly(
  turnstileToken: string,
  request: NextRequest,
): Promise<{ success: boolean; errorMessage?: string }> {
  try {
    if (!turnstileToken) {
      return { success: false, errorMessage: "Security check required" };
    }

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
