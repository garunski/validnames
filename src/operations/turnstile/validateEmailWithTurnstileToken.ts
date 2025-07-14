import {
  getTurnstileErrorMessage,
  validateTurnstileToken,
} from "@/operations/turnstileValidationOperations";
import { validateRequestBody } from "@/validators/requestValidation";
import { NextRequest } from "next/server";
import { emailWithTurnstileSchema } from "../authenticationOperations";

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
