import { checkEmailRateLimit } from "@/operations/rateLimitingOperations";
import { NextResponse } from "next/server";

export async function rateLimitEmailOperations(
  email: string,
  type: "verification" | "passwordReset",
): Promise<NextResponse | null> {
  try {
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const rateLimitResult = await checkEmailRateLimit(email, type);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: `Too many ${type} attempts. Please try again after ${rateLimitResult.resetTime.toLocaleString()}`,
          resetTime: rateLimitResult.resetTime,
        },
        { status: 429 },
      );
    }

    return null; // Continue with request
  } catch (error) {
    console.error("Rate limiting error:", error);
    return NextResponse.json(
      { error: "Rate limiting check failed" },
      { status: 500 },
    );
  }
}
