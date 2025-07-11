import { z } from "zod";

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
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  score: number; // 0-100
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * Calculates password strength score (0-100)
 * @param password - The password to score
 * @returns Strength score
 */
function calculatePasswordScore(password: string): number {
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
function getPasswordStrength(score: number): PasswordStrength {
  if (score < 20) return PasswordStrength.VERY_WEAK;
  if (score < 40) return PasswordStrength.WEAK;
  if (score < 60) return PasswordStrength.MEDIUM;
  if (score < 80) return PasswordStrength.STRONG;
  return PasswordStrength.VERY_STRONG;
}

/**
 * Validates password against policy requirements
 * @param password - The password to validate
 * @param userInfo - Optional user information to check against
 * @returns Password validation result
 */
export function validatePassword(
  password: string,
  userInfo?: { email?: string; name?: string },
): PasswordValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Basic length validation
  if (password.length < PASSWORD_POLICY.minLength) {
    errors.push(
      `Password must be at least ${PASSWORD_POLICY.minLength} characters long`,
    );
  }

  if (password.length > PASSWORD_POLICY.maxLength) {
    errors.push(
      `Password must be no more than ${PASSWORD_POLICY.maxLength} characters long`,
    );
  }

  // Character requirements
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (PASSWORD_POLICY.requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (
    PASSWORD_POLICY.requireSymbols &&
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    errors.push("Password must contain at least one special character");
  }

  // Common password check
  if (PASSWORD_POLICY.preventCommonPasswords) {
    const lowerPassword = password.toLowerCase();
    if (COMMON_PASSWORDS.includes(lowerPassword)) {
      errors.push(
        "Password is too common. Please choose a more unique password",
      );
    }
  }

  // User info check
  if (PASSWORD_POLICY.preventUserInfo && userInfo) {
    const lowerPassword = password.toLowerCase();
    const userEmail = userInfo.email?.toLowerCase();
    const userName = userInfo.name?.toLowerCase();

    if (userEmail && lowerPassword.includes(userEmail.split("@")[0])) {
      errors.push("Password should not contain your email username");
    }

    if (userName && lowerPassword.includes(userName.replace(/\s+/g, ""))) {
      errors.push("Password should not contain your name");
    }
  }

  // Calculate strength
  const score = calculatePasswordScore(password);
  const strength = getPasswordStrength(score);

  // Add warnings and suggestions based on strength
  if (strength === PasswordStrength.VERY_WEAK) {
    warnings.push("This password is very weak and easily guessable");
    suggestions.push("Use a mix of uppercase, lowercase, numbers, and symbols");
    suggestions.push("Make it at least 12 characters long");
  } else if (strength === PasswordStrength.WEAK) {
    warnings.push("This password is weak and could be easily cracked");
    suggestions.push("Add more special characters and numbers");
    suggestions.push("Consider using a passphrase");
  } else if (strength === PasswordStrength.MEDIUM) {
    suggestions.push("Add more complexity to make it stronger");
    suggestions.push("Consider using a password manager");
  } else if (strength === PasswordStrength.STRONG) {
    suggestions.push(
      "This is a good password. Consider using a password manager for even better security",
    );
  } else {
    suggestions.push(
      "Excellent password strength! Keep it secure and don't reuse it elsewhere",
    );
  }

  return {
    isValid: errors.length === 0,
    strength,
    score,
    errors,
    warnings,
    suggestions,
  };
}

/**
 * Zod schema for password validation
 */
export const passwordSchema = z
  .string()
  .min(
    PASSWORD_POLICY.minLength,
    `Password must be at least ${PASSWORD_POLICY.minLength} characters`,
  )
  .max(
    PASSWORD_POLICY.maxLength,
    `Password must be no more than ${PASSWORD_POLICY.maxLength} characters`,
  )
  .refine(
    (password) => /[A-Z]/.test(password),
    "Password must contain at least one uppercase letter",
  )
  .refine(
    (password) => /[a-z]/.test(password),
    "Password must contain at least one lowercase letter",
  )
  .refine(
    (password) => /\d/.test(password),
    "Password must contain at least one number",
  )
  .refine(
    (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    "Password must contain at least one special character",
  )
  .refine(
    (password) => !COMMON_PASSWORDS.includes(password.toLowerCase()),
    "Password is too common",
  )
  .refine((password) => {
    const score = calculatePasswordScore(password);
    return score >= 40; // Require at least "weak" strength
  }, "Password is too weak. Please choose a stronger password");
