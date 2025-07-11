import { prisma } from "@/app/database/client";
import { rateLimitEmailOperations } from "@/middleware/rateLimitingMiddleware";
import { sendEmailVerification } from "@/operations/emailVerificationOperations";
import { generateEmailVerificationToken } from "@/operations/tokenOperations";
import {
  getTurnstileErrorMessage,
  validateTurnstileToken,
} from "@/operations/turnstileValidationOperations";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  email: z.string().email(),
  turnstileToken: z.string().min(1, "Please complete the security check"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, turnstileToken } = requestSchema.parse(body);

    // Validate Turnstile token
    const clientIp =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const turnstileValidation = await validateTurnstileToken(
      turnstileToken,
      clientIp,
    );
    if (!turnstileValidation.success) {
      const errorMessage = getTurnstileErrorMessage(
        turnstileValidation.errorCodes || [],
      );
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 },
      );
    }

    const token = await generateEmailVerificationToken(user.id);
    await sendEmailVerification(user.email, user.name || "User", token);

    return NextResponse.json({ message: "Verification email sent" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((e) => e.message),
        },
        { status: 400 },
      );
    }

    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 },
    );
  }
}
