import { randomBytes } from "crypto";

export function generateSecureToken(): string {
  return randomBytes(32).toString("hex");
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
