import { prisma } from "@/app/database/client";
import { rateLimitEmailOperations } from "@/middleware/rateLimitingMiddleware";
import {
  createEmailSuccessResponse,
  createPasswordResetResponse,
  createTurnstileErrorResponse,
  handleApiRouteError,
} from "@/operations/apiResponseOperations";
import { validateEmailWithTurnstileToken } from "@/operations/authenticationOperations";
import { sendPasswordReset } from "@/operations/passwordResetOperations";
import { generatePasswordResetToken } from "@/operations/tokenOperations";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const validation = await validateEmailWithTurnstileToken(req);

    if (!validation.success) {
      return createTurnstileErrorResponse(validation.errorMessage!);
    }

    const { email } = validation.data!;

    // Check rate limiting
    const rateLimitResult = await rateLimitEmailOperations(
      email,
      "passwordReset",
    );
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal that user doesn't exist
      return createPasswordResetResponse();
    }

    const token = await generatePasswordResetToken(user.id);
    await sendPasswordReset(user.email, user.name || "User", token);

    return createEmailSuccessResponse("Password reset email sent");
  } catch (error) {
    return handleApiRouteError(error, "Failed to send password reset email");
  }
}
