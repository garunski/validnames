import { generateCsrfToken } from "@/operations/csrfOperations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Try to get the CSRF token from cookies
  const csrfCookie = request.cookies.get("csrf-token");
  let csrfToken = csrfCookie?.value;

  // If not present, generate a new one
  if (!csrfToken) {
    csrfToken = generateCsrfToken();
  }

  // Set the CSRF token as an httpOnly cookie
  const response = NextResponse.json({ csrfToken });
  response.cookies.set("csrf-token", csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  // Also set a non-httpOnly cookie for client-side JS to read (for form injection)
  response.cookies.set("csrf-token-client", csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
