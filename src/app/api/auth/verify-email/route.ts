import { prisma } from "@/app/database/client";
import { sendWelcomeEmail } from "@/operations/welcomeOperations";
import { validateEmailVerificationToken } from "@/validators/tokenValidators";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  token: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = requestSchema.parse(body);

    const tokenRecord = await validateEmailVerificationToken(token);

    if (!tokenRecord) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    await prisma.emailVerificationToken.delete({
      where: { token },
    });

    await sendWelcomeEmail(
      tokenRecord.user.email,
      tokenRecord.user.name || "User",
    );

    return NextResponse.json({ message: "Email verified successfully" });
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

    console.error("Error verifying email:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 },
    );
  }
}
