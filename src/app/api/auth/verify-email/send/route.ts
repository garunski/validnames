import { prisma } from "@/app/database/client";
import { sendEmailVerification } from "@/operations/emailVerificationOperations";
import { generateEmailVerificationToken } from "@/operations/tokenOperations";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = requestSchema.parse(body);

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
