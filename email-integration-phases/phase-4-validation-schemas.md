# Phase 4: Validation Schemas

## Overview

This phase focuses on creating comprehensive Zod validation schemas for all email operations to ensure data integrity and proper error handling.

## Tasks

### Task 20: Add Email Validation Schemas

- **File**: `src/validators/emailSchemas.ts`
- **Action**: Add new Zod schemas for email operations
- **Code**:

  ```typescript
  import { z } from "zod";

  export const emailVerificationSchema = z.object({
    token: z.string().min(1, "Token is required"),
  });

  export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
  });

  export const resetPasswordSchema = z
    .object({
      token: z.string().min(1, "Token is required"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
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
  });

  export const tokenValidationSchema = z.object({
    token: z.string().min(1, "Token is required"),
  });

  export const passwordResetRequestSchema = z.object({
    email: z.string().email("Invalid email address"),
  });

  export const passwordResetSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
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
  export type PasswordResetResponse = z.infer<
    typeof passwordResetResponseSchema
  >;
  export type ErrorResponse = z.infer<typeof errorResponseSchema>;
  ```

- **Line Count**: ~45 lines

### Task 20a: Update Existing Validation Files

- **File**: `src/validators/schemas.ts`
- **Action**: Import and export email schemas from the new emailSchemas file
- **Changes**:
  ```typescript
  // Add to existing imports
  export * from "./emailSchemas";
  ```

### Task 20b: Create Email Validation Utilities

- **File**: `src/validators/emailValidation.ts`
- **Action**: Create utility functions for email validation
- **Code**:

  ```typescript
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
  ```

- **Line Count**: ~50 lines

## Validation Checklist

- [ ] Email validation schemas created with proper Zod validation
- [ ] All email operation schemas defined
- [ ] Response schemas for consistent API responses
- [ ] Type exports for TypeScript usage
- [ ] Email validation utilities created
- [ ] Password validation utilities created
- [ ] Existing validation files updated to export email schemas
- [ ] All schemas include proper error messages
- [ ] All files under 150 lines of code
- [ ] Proper TypeScript types used throughout

## Schema Usage Examples

### In API Routes

```typescript
import { validateEmailVerificationRequest } from "@/validators/emailValidation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = validateEmailVerificationRequest(body);
    // ... rest of the logic
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((e) => e.message),
        },
        { status: 400 },
      );
    }
    // ... handle other errors
  }
}
```

### In React Components

```typescript
import { validateEmail, validatePassword } from "@/validators/emailValidation";

const handleSubmit = (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!validateEmail(email)) {
    setError("Please enter a valid email address");
    return;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    setError(passwordValidation.errors.join(", "));
    return;
  }

  // ... submit form
};
```

## Next Phase

After completing Phase 4, proceed to **Phase 5: Frontend Pages Implementation** to create the React pages for email verification and password reset flows.
