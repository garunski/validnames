# Phase 3: API Route Implementation

## Overview

This phase focuses on creating the backend API routes for email verification and password reset functionality.

## Tasks

### Task 14: Create Send Verification Email Route

- **File**: `src/app/api/auth/verify-email/send/route.ts`
- **Action**: Implement POST endpoint to send verification email using Resend
- **Code**:

  ```typescript
  import { NextRequest, NextResponse } from "next/server";
  import { sendEmailVerification } from "@/operations/emailVerificationOperations";
  import { generateEmailVerificationToken } from "@/operations/tokenOperations";
  import { prisma } from "@/database/client";
  import { z } from "zod";

  const requestSchema = z.object({
    email: z.string().email(),
  });

  export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { email } = requestSchema.parse(body);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (user.emailVerified) {
        return NextResponse.json(
          { error: "Email already verified" },
          { status: 400 },
        );
      }

      const token = await generateEmailVerificationToken(user.id);
      await sendEmailVerification(user.email, user.name || "User", token);

      return NextResponse.json({ message: "Verification email sent" });
    } catch (error) {
      console.error("Error sending verification email:", error);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 },
      );
    }
  }
  ```

- **Line Count**: ~40 lines

### Task 15: Create Verify Email Token Route

- **File**: `src/app/api/auth/verify-email/route.ts`
- **Action**: Implement POST endpoint to verify email with token
- **Code**:

  ```typescript
  import { NextRequest, NextResponse } from "next/server";
  import { validateEmailVerificationToken } from "@/validators/tokenValidators";
  import { sendWelcomeEmail } from "@/operations/welcomeOperations";
  import { prisma } from "@/database/client";
  import { z } from "zod";

  const requestSchema = z.object({
    token: z.string().min(1),
  });

  export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { token } = requestSchema.parse(body);

      const tokenRecord = await validateEmailVerificationToken(token);

      if (!tokenRecord) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 400 },
        );
      }

      await prisma.user.update({
        where: { id: tokenRecord.userId },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });

      await prisma.emailVerificationToken.delete({
        where: { token },
      });

      await sendWelcomeEmail(
        tokenRecord.user.email,
        tokenRecord.user.name || "User",
      );

      return NextResponse.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Error verifying email:", error);
      return NextResponse.json(
        { error: "Failed to verify email" },
        { status: 500 },
      );
    }
  }
  ```

- **Line Count**: ~48 lines

### Task 16: Create Forgot Password Route

- **File**: `src/app/api/auth/forgot-password/route.ts`
- **Action**: Implement POST endpoint for password reset request using Resend
- **Code**:

  ```typescript
  import { NextRequest, NextResponse } from "next/server";
  import { sendPasswordReset } from "@/operations/passwordResetOperations";
  import { generatePasswordResetToken } from "@/operations/tokenOperations";
  import { prisma } from "@/database/client";
  import { z } from "zod";

  const requestSchema = z.object({
    email: z.string().email(),
  });

  export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { email } = requestSchema.parse(body);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Don't reveal that user doesn't exist
        return NextResponse.json({
          message: "If an account exists, password reset email sent",
        });
      }

      const token = await generatePasswordResetToken(user.id);
      await sendPasswordReset(user.email, user.name || "User", token);

      return NextResponse.json({ message: "Password reset email sent" });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return NextResponse.json(
        { error: "Failed to send password reset email" },
        { status: 500 },
      );
    }
  }
  ```

- **Line Count**: ~35 lines

### Task 17: Create Reset Password Route

- **File**: `src/app/api/auth/reset-password/route.ts`
- **Action**: Implement POST endpoint to reset password with token
- **Code**:

  ```typescript
  import { NextRequest, NextResponse } from "next/server";
  import { validatePasswordResetToken } from "@/validators/tokenValidators";
  import { prisma } from "@/database/client";
  import { hash } from "bcryptjs";
  import { z } from "zod";

  const requestSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(8),
  });

  export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { token, password } = requestSchema.parse(body);

      const tokenRecord = await validatePasswordResetToken(token);

      if (!tokenRecord) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 400 },
        );
      }

      const hashedPassword = await hash(password, 12);

      await prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { password: hashedPassword },
      });

      await prisma.passwordResetToken.delete({
        where: { token },
      });

      return NextResponse.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      return NextResponse.json(
        { error: "Failed to reset password" },
        { status: 500 },
      );
    }
  }
  ```

- **Line Count**: ~45 lines

### Task 18: Update Registration Route

- **File**: `src/app/api/auth/register/route.ts`
- **Action**: Modify existing registration to send verification email using Resend
- **Changes**:

  ```typescript
  // Add imports
  import { sendEmailVerification } from "@/operations/emailVerificationOperations";
  import { generateEmailVerificationToken } from "@/operations/tokenOperations";

  // After user is created successfully (around line 45):
  const token = await generateEmailVerificationToken(user.id);
  await sendEmailVerification(user.email, user.name || "User", token);
  ```

- **Note**: Only add the email sending code after successful user creation

### Task 19: Update Login Route

- **File**: `src/app/api/auth/login/route.ts`
- **Action**: Add email verification check before allowing login
- **Changes**:
  ```typescript
  // Add after user lookup but before password verification:
  if (!user.emailVerified) {
    return NextResponse.json(
      { error: "Please verify your email before logging in" },
      { status: 401 },
    );
  }
  ```
- **Note**: This should be added after finding the user but before password verification

## Validation Checklist

- [ ] Send verification email route implemented
- [ ] Verify email token route implemented
- [ ] Forgot password route implemented
- [ ] Reset password route implemented
- [ ] Registration route updated to send verification email
- [ ] Login route updated to check email verification
- [ ] All routes use proper Zod validation
- [ ] All routes include proper error handling
- [ ] All routes return consistent response formats
- [ ] All files under 150 lines of code
- [ ] Proper HTTP status codes used

## Next Phase

After completing Phase 3, proceed to **Phase 4: Validation Schemas** to create comprehensive Zod validation schemas for email operations.
