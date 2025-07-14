import { z } from "zod";
import {
  PASSWORD_POLICY,
  PasswordStrength,
  calculatePasswordScore,
  getPasswordStrength,
  isCommonPassword,
} from "./passwordStrengthCalculator";

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
  if (PASSWORD_POLICY.preventCommonPasswords && isCommonPassword(password)) {
    errors.push("Password is too common. Please choose a more unique password");
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
  if (score < 40) {
    warnings.push("Password is weak. Consider using a stronger password.");
    suggestions.push(
      "Try adding more characters, mixing case, numbers, and symbols",
    );
  } else if (score < 60) {
    warnings.push("Password could be stronger.");
    suggestions.push("Consider adding more complexity or length");
  }

  // Add specific suggestions based on missing requirements
  if (!/[A-Z]/.test(password)) {
    suggestions.push("Add uppercase letters");
  }
  if (!/[a-z]/.test(password)) {
    suggestions.push("Add lowercase letters");
  }
  if (!/\d/.test(password)) {
    suggestions.push("Add numbers");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    suggestions.push("Add special characters");
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
  .min(PASSWORD_POLICY.minLength, {
    message: `Password must be at least ${PASSWORD_POLICY.minLength} characters long`,
  })
  .max(PASSWORD_POLICY.maxLength, {
    message: `Password must be no more than ${PASSWORD_POLICY.maxLength} characters long`,
  })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((password) => /\d/.test(password), {
    message: "Password must contain at least one number",
  })
  .refine(
    (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    {
      message: "Password must contain at least one special character",
    },
  )
  .refine((password) => !isCommonPassword(password), {
    message: "Password is too common. Please choose a more unique password",
  });
