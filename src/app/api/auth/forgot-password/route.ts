import { prisma } from "@/app/database/client";
import { rateLimitEmailOperations } from "@/middleware/rateLimitingMiddleware";
import { sendPasswordReset } from "@/operations/passwordResetOperations";
import { generatePasswordResetToken } from "@/operations/tokenOperations";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = requestSchema.parse(body);

    // Check rate limiting
    const rateLimitResult = await rateLimitEmailOperations(
      req,
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
      return NextResponse.json({
        message: "If an account exists, password reset email sent",
      });
    }

    const token = await generatePasswordResetToken(user.id);
    await sendPasswordReset(user.email, user.name || "User", token);

    return NextResponse.json({ message: "Password reset email sent" });
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

    console.error("Error sending password reset email:", error);
    return NextResponse.json(
      { error: "Failed to send password reset email" },
      { status: 500 },
    );
  }
}
