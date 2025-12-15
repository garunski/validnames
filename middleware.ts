import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { csrfMiddleware } from "./src/middleware/csrfMiddleware";

export async function middleware(request: NextRequest) {
  // Apply CSRF protection for sensitive operations
  const csrfResponse = await csrfMiddleware(request);
  if (csrfResponse) {
    return csrfResponse;
  }

  // If accessing login, register, privacy, terms, email routes, or root path, allow through
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/privacy") ||
    request.nextUrl.pathname.startsWith("/terms") ||
    request.nextUrl.pathname.startsWith("/verify-email") ||
    request.nextUrl.pathname.startsWith("/forgot-password") ||
    request.nextUrl.pathname.startsWith("/reset-password") ||
    request.nextUrl.pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get("session");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs", // Use Node.js runtime to access request body
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
