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

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email address";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password.trim()) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/\d/.test(password)) return "Password must contain at least one number";
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword.trim()) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return undefined;
}
