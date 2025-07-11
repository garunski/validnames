import crypto from "crypto";

/**
 * Generates a cryptographically secure random string for use as JWT secret
 * @param length - Length of the secret (default: 64)
 * @returns Cryptographically secure random string
 */
export function generateSecureSecret(length: number = 64): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Validates JWT secret requirements
 * @param secret - The JWT secret to validate
 * @returns Validation result with error message if invalid
 */
export function validateJwtSecret(secret: string): {
  isValid: boolean;
  error?: string;
} {
  if (!secret) {
    return { isValid: false, error: "JWT_SECRET is required" };
  }

  if (secret.length < 32) {
    return {
      isValid: false,
      error: "JWT_SECRET must be at least 32 characters long",
    };
  }

  // Check if it's the default fallback value
  if (secret === "your-secret-key") {
    return {
      isValid: false,
      error: "JWT_SECRET cannot use the default fallback value",
    };
  }

  // Check for common weak patterns
  const weakPatterns = [
    "secret",
    "key",
    "password",
    "123",
    "admin",
    "test",
    "dev",
    "development",
  ];

  const lowerSecret = secret.toLowerCase();
  for (const pattern of weakPatterns) {
    if (lowerSecret.includes(pattern)) {
      return {
        isValid: false,
        error: `JWT_SECRET contains potentially weak pattern: ${pattern}`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Creates a secure JWT key from the provided secret
 * @param secret - The JWT secret
 * @returns TextEncoder instance for JWT operations
 */
export function createJwtKey(secret: string): Uint8Array {
  const validation = validateJwtSecret(secret);
  if (!validation.isValid) {
    throw new Error(`Invalid JWT secret: ${validation.error}`);
  }

  return new TextEncoder().encode(secret);
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return email;
  }

  const maskedLocal =
    localPart.charAt(0) +
    "*".repeat(localPart.length - 2) +
    localPart.charAt(localPart.length - 1);
  return `${maskedLocal}@${domain}`;
}

export function isEmailDomainAllowed(
  email: string,
  allowedDomains: string[],
): boolean {
  if (allowedDomains.length === 0) return true;

  const domain = email.split("@")[1]?.toLowerCase();
  return allowedDomains.some((allowed) => domain === allowed.toLowerCase());
}
