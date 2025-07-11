import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Only allow in development or with a secret key for production debugging
  const debugKey = request.nextUrl.searchParams.get("key");
  const isDevelopment = process.env.NODE_ENV === "development";
  const isAuthorized =
    isDevelopment || debugKey === process.env.DEBUG_SECRET_KEY;

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const diagnostics = {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    environmentVariables: {
      hasJwtSecret: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET?.length || 0,
      hasTurnstileSecret: !!process.env.TURNSTILE_SECRET_KEY,
      turnstileSecretLength: process.env.TURNSTILE_SECRET_KEY?.length || 0,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlType: process.env.DATABASE_URL?.includes("neon.tech")
        ? "neon"
        : "other",
      hasDebugSecret: !!process.env.DEBUG_SECRET_KEY,
    },
    headers: {
      userAgent: request.headers.get("user-agent"),
      xForwardedFor: request.headers.get("x-forwarded-for"),
      xRealIp: request.headers.get("x-real-ip"),
    },
  };

  return NextResponse.json(diagnostics);
}
