import { NextRequest, NextResponse } from "next/server";
import { validateCsrfToken } from "../operations/csrfOperations";

/**
 * List of sensitive operations that require CSRF protection
 */
const PROTECTED_OPERATIONS = [
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/verify-email",
  "/api/auth/verify-email/send",
  "/api/applications",
  "/api/categories",
  "/api/domains",
  "/api/user/profile",
  "/api/user/settings",
];

/**
 * HTTP methods that modify state and require CSRF protection
 */
const PROTECTED_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

/**
 * Checks if a request requires CSRF protection
 * @param request - The incoming request
 * @returns True if CSRF protection is required
 */
function requiresCsrfProtection(request: NextRequest): boolean {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Check if the path matches any protected operations
  const isProtectedPath = PROTECTED_OPERATIONS.some((protectedPath) =>
    path.startsWith(protectedPath),
  );

  // Check if the method modifies state
  const isProtectedMethod = PROTECTED_METHODS.includes(method);

  return isProtectedPath && isProtectedMethod;
}

/**
 * Extracts CSRF token from request headers or body
 * @param request - The incoming request
 * @returns The CSRF token or null if not found
 */
async function extractCsrfToken(request: NextRequest): Promise<string | null> {
  // Try to get token from headers first
  const headerToken = request.headers.get("x-csrf-token");
  if (headerToken) {
    return headerToken;
  }

  // Try to get token from form data
  try {
    const formData = await request.formData();
    const formToken = formData.get("csrfToken");
    if (formToken && typeof formToken === "string") {
      return formToken;
    }
  } catch {
    // Form data parsing failed, try JSON
  }

  // Try to get token from JSON body
  try {
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const body = await request.json();
      if (body.csrfToken && typeof body.csrfToken === "string") {
        return body.csrfToken;
      }
    }
  } catch {
    // JSON parsing failed
  }

  return null;
}

/**
 * CSRF middleware function
 * @param request - The incoming request
 * @returns NextResponse or null to continue
 */
export async function csrfMiddleware(
  request: NextRequest,
): Promise<NextResponse | null> {
  // Skip CSRF protection for non-protected operations
  if (!requiresCsrfProtection(request)) {
    return null;
  }

  // Extract CSRF token from request
  const csrfToken = await extractCsrfToken(request);

  // Validate CSRF token
  const validation = await validateCsrfToken(csrfToken || "");

  if (!validation.isValid) {
    return NextResponse.json(
      {
        error: "CSRF validation failed",
        message: validation.error,
        code: "CSRF_ERROR",
      },
      { status: 403 },
    );
  }

  // CSRF validation passed, continue with request
  return null;
}
