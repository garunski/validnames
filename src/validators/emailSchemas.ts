import { z } from "zod";
import { passwordSchema } from "./passwordPolicyValidator";

export const emailVerificationSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  turnstileToken: z.string().min(1, "Please complete the security check"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    turnstileToken: z.string().min(1, "Please complete the security check"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resendEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const emailVerificationRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  turnstileToken: z.string().min(1, "Please complete the security check"),
});

export const tokenValidationSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
});

// Response schemas for consistent API responses
export const emailVerificationResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
});

export const passwordResetResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
});

export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.array(z.string()).optional(),
});

// Type exports for use in components and API routes
export type EmailVerificationRequest = z.infer<
  typeof emailVerificationRequestSchema
>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type TokenValidationRequest = z.infer<typeof tokenValidationSchema>;
export type EmailVerificationResponse = z.infer<
  typeof emailVerificationResponseSchema
>;
export type PasswordResetResponse = z.infer<typeof passwordResetResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
