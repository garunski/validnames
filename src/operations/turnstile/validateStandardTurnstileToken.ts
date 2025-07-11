import {
  getTurnstileErrorMessage,
  validateTurnstileToken,
} from "@/operations/turnstileValidationOperations";
import { validateRequestBody } from "@/validators/requestValidation";
import { NextRequest } from "next/server";
import { turnstileTokenSchema } from "../authenticationOperations";

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
