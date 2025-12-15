import { prisma } from "@/app/database/client";
import {
  getTurnstileErrorMessage,
  validateTurnstileToken,
} from "@/operations/turnstileValidationOperations";
import { validatePasswordResetToken } from "@/validators/tokenValidators";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(1),
    turnstileToken: z.string().min(1, "Please complete the security check"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password, turnstileToken } = requestSchema.parse(body);

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

    const tokenRecord = await validatePasswordResetToken(token);

    if (!tokenRecord) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { passwordHash: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => e.message),
        },
        { status: 400 },
      );
    }

    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 },
    );
  }
}
