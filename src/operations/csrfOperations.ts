import { cookies } from "next/headers";

/**
 * Generates a cryptographically secure CSRF token using Web Crypto API
 * Compatible with Edge Runtime (Vercel Edge Functions)
 * @returns A secure random token
 */
export function generateCsrfToken(): string {
  // Use Web Crypto API for Edge Runtime compatibility
  // crypto is available as a global in Edge Runtime (Vercel, Cloudflare Workers, etc.)
  const array = new Uint8Array(32);
  globalThis.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * Validates a CSRF token against the stored token in cookies
 * @param token - The token to validate
 * @returns Validation result
 */
export async function validateCsrfToken(token: string): Promise<{
  isValid: boolean;
  error?: string;
}> {
  if (!token) {
    return { isValid: false, error: "CSRF token is required" };
  }

  const cookieStore = await cookies();
  const storedToken = cookieStore.get("csrf-token")?.value;

  if (!storedToken) {
    return { isValid: false, error: "No CSRF token found in session" };
  }

  if (token !== storedToken) {
    return { isValid: false, error: "CSRF token mismatch" };
  }

  return { isValid: true };
}

/**
 * Sets a CSRF token in an httpOnly cookie
 * @param token - The token to store
 */
export async function setCsrfToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("csrf-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

/**
 * Gets the current CSRF token from cookies
 * @returns The current CSRF token or null if not found
 */
export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("csrf-token")?.value || null;
}

/**
 * Refreshes the CSRF token (generates new token and sets it)
 * @returns The new CSRF token
 */
export async function refreshCsrfToken(): Promise<string> {
  const newToken = generateCsrfToken();
  await setCsrfToken(newToken);
  return newToken;
}

/**
 * Clears the CSRF token from cookies
 */
export async function clearCsrfToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("csrf-token", "", {
    expires: new Date(0),
    path: "/",
  });
}
