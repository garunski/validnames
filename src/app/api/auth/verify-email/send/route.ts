import { prisma } from "@/app/database/client";
import { rateLimitEmailOperations } from "@/middleware/rateLimitingMiddleware";
import {
  createAlreadyVerifiedResponse,
  createEmailSuccessResponse,
  createTurnstileErrorResponse,
  createUserNotFoundResponse,
  handleApiRouteError,
} from "@/operations/apiResponseOperations";
import { validateEmailWithTurnstileToken } from "@/operations/authenticationOperations";
import { sendEmailVerification } from "@/operations/emailVerificationOperations";
import { generateEmailVerificationToken } from "@/operations/tokenOperations";
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
      "verification",
    );
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return createUserNotFoundResponse();
    }

    if (user.emailVerified) {
      return createAlreadyVerifiedResponse();
    }

    const token = await generateEmailVerificationToken(user.id);
    await sendEmailVerification(user.email, user.name || "User", token);

    return createEmailSuccessResponse("Verification email sent");
  } catch (error) {
    return handleApiRouteError(error, "Failed to send verification email");
  }
}
