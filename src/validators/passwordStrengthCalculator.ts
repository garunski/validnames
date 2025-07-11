/**
 * Password policy configuration
 */
export const PASSWORD_POLICY = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  maxLength: 128,
  preventCommonPasswords: true,
  preventUserInfo: true,
} as const;

/**
 * Common weak passwords to prevent
 */
const COMMON_PASSWORDS = [
  "password",
  "123456",
  "123456789",
  "qwerty",
  "abc123",
  "password123",
  "admin",
  "letmein",
  "welcome",
  "monkey",
  "dragon",
  "master",
  "football",
  "superman",
  "trustno1",
  "hello123",
  "freedom",
  "whatever",
  "qwerty123",
  "admin123",
  "login",
  "passw0rd",
  "password1",
  "12345678",
  "qwertyuiop",
  "baseball",
  "dragon123",
  "master123",
  "football123",
  "superman123",
];

/**
 * Password strength levels
 */
export enum PasswordStrength {
  VERY_WEAK = "very_weak",
  WEAK = "weak",
  MEDIUM = "medium",
  STRONG = "strong",
  VERY_STRONG = "very_strong",
}

/**
 * Calculates password strength score (0-100)
 * @param password - The password to score
 * @returns Strength score
 */
export function calculatePasswordScore(password: string): number {
  let score = 0;

  // Length contribution (up to 25 points)
  if (password.length >= PASSWORD_POLICY.minLength) {
    score += Math.min(25, (password.length - PASSWORD_POLICY.minLength) * 2);
  }

  // Character variety contribution (up to 25 points)
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (hasUppercase) score += 5;
  if (hasLowercase) score += 5;
  if (hasNumbers) score += 5;
  if (hasSymbols) score += 10;

  // Complexity contribution (up to 25 points)
  const uniqueChars = new Set(password).size;
  score += Math.min(25, uniqueChars * 2);

  // Entropy contribution (up to 25 points)
  const charSetSize =
    (hasUppercase ? 26 : 0) +
    (hasLowercase ? 26 : 0) +
    (hasNumbers ? 10 : 0) +
    (hasSymbols ? 32 : 0);
  const entropy = Math.log2(Math.pow(charSetSize, password.length));
  score += Math.min(25, entropy / 4);

  return Math.min(100, Math.max(0, score));
}

/**
 * Determines password strength level based on score
 * @param score - Password strength score
 * @returns Password strength level
 */
export function getPasswordStrength(score: number): PasswordStrength {
  if (score < 20) return PasswordStrength.VERY_WEAK;
  if (score < 40) return PasswordStrength.WEAK;
  if (score < 60) return PasswordStrength.MEDIUM;
  if (score < 80) return PasswordStrength.STRONG;
  return PasswordStrength.VERY_STRONG;
}

/**
 * Checks if password is in the common passwords list
 * @param password - The password to check
 * @returns True if password is common
 */
export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.includes(password.toLowerCase());
}
