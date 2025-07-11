import { z } from "zod";
import {
  emailVerificationRequestSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  tokenValidationSchema,
  type EmailVerificationRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
  type TokenValidationRequest,
} from "./emailSchemas";

export function validateEmailVerificationRequest(
  data: unknown,
): EmailVerificationRequest {
  return emailVerificationRequestSchema.parse(data);
}

export function validateForgotPasswordRequest(
  data: unknown,
): ForgotPasswordRequest {
  return forgotPasswordSchema.parse(data);
}

export function validateResetPasswordRequest(
  data: unknown,
): ResetPasswordRequest {
  return resetPasswordSchema.parse(data);
}

export function validateTokenRequest(data: unknown): TokenValidationRequest {
  return tokenValidationSchema.parse(data);
}

export function validateEmail(email: string): boolean {
  try {
    z.string().email().parse(email);
    return true;
  } catch {
    return false;
  }
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
