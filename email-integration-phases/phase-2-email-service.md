# Phase 2: Email Service Implementation

## Overview

This phase focuses on setting up the Resend client, creating email templates, and implementing token operations and email sending functions.

## Tasks

### Task 5: Create Resend Client

- **File**: `src/lib/resend.ts`
- **Action**: Create Resend client instance following Next.js patterns
- **Code**:

  ```typescript
  import { Resend } from "resend";

  export const resend = new Resend(process.env.RESEND_API_KEY);
  ```

- **Line Count**: ~5 lines

### Task 6: Create Email Types

- **File**: `src/types/emailTypes.ts`
- **Action**: Define TypeScript interfaces for email operations
- **Code**:

  ```typescript
  export interface EmailVerificationData {
    email: string;
    userName: string;
    token: string;
  }

  export interface PasswordResetData {
    email: string;
    userName: string;
    token: string;
  }

  export interface WelcomeEmailData {
    email: string;
    userName: string;
  }

  export interface EmailTemplateProps {
    userName: string;
    verificationLink?: string;
    resetLink?: string;
    loginLink?: string;
  }
  ```

- **Line Count**: ~22 lines

### Task 7: Create Email Verification Template

- **File**: `src/components/emails/EmailVerificationTemplate.tsx`
- **Action**: Create React email template component using React Email
- **Code**:

  ```typescript
  import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

  interface EmailVerificationTemplateProps {
    userName: string;
    verificationLink: string;
  }

  export default function EmailVerificationTemplate({
    userName,
    verificationLink,
  }: EmailVerificationTemplateProps) {
    return (
      <Html>
        <Head />
        <Body>
          <Container>
            <Text>Hi {userName},</Text>
            <Text>Please verify your email address:</Text>
            <Button href={verificationLink}>Verify Email</Button>
            <Text>Link expires in 24 hours.</Text>
          </Container>
        </Body>
      </Html>
    );
  }
  ```

- **Line Count**: ~25 lines

### Task 8: Create Password Reset Template

- **File**: `src/components/emails/PasswordResetTemplate.tsx`
- **Action**: Create React email template component using React Email
- **Code**:

  ```typescript
  import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

  interface PasswordResetTemplateProps {
    userName: string;
    resetLink: string;
  }

  export default function PasswordResetTemplate({
    userName,
    resetLink,
  }: PasswordResetTemplateProps) {
    return (
      <Html>
        <Head />
        <Body>
          <Container>
            <Text>Hi {userName},</Text>
            <Text>Reset your password:</Text>
            <Button href={resetLink}>Reset Password</Button>
            <Text>Link expires in 24 hours.</Text>
            <Text>Ignore if you didn't request this.</Text>
          </Container>
        </Body>
      </Html>
    );
  }
  ```

- **Line Count**: ~27 lines

### Task 9: Create Welcome Email Template

- **File**: `src/components/emails/WelcomeEmailTemplate.tsx`
- **Action**: Create React email template component for post-verification welcome
- **Code**:

  ```typescript
  import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

  interface WelcomeEmailTemplateProps {
    userName: string;
    loginLink: string;
  }

  export default function WelcomeEmailTemplate({
    userName,
    loginLink,
  }: WelcomeEmailTemplateProps) {
    return (
      <Html>
        <Head />
        <Body>
          <Container>
            <Text>Welcome {userName}!</Text>
            <Text>Your email is verified and account is ready.</Text>
            <Button href={loginLink}>Get Started</Button>
          </Container>
        </Body>
      </Html>
    );
  }
  ```

- **Line Count**: ~23 lines

### Task 10: Create Token Operations

- **File**: `src/operations/tokenOperations.ts`
- **Action**: Implement token generation functions
- **Code**:

  ```typescript
  import { randomBytes } from "crypto";
  import { prisma } from "@/database/client";

  export async function generateEmailVerificationToken(
    userId: string,
  ): Promise<string> {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
      data: { userId, token, expiresAt },
    });

    return token;
  }

  export async function generatePasswordResetToken(
    userId: string,
  ): Promise<string> {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.passwordResetToken.create({
      data: { userId, token, expiresAt },
    });

    return token;
  }
  ```

- **Line Count**: ~22 lines

### Task 11: Create Token Validators

- **File**: `src/validators/tokenValidators.ts`
- **Action**: Implement token validation functions
- **Code**:

  ```typescript
  import { prisma } from "@/database/client";

  export async function validateEmailVerificationToken(token: string) {
    const tokenRecord = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return null;
    }

    return tokenRecord;
  }

  export async function validatePasswordResetToken(token: string) {
    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return null;
    }

    return tokenRecord;
  }
  ```

- **Line Count**: ~25 lines

### Task 12: Create Email Verification Operations

- **File**: `src/operations/emailVerificationOperations.ts`
- **Action**: Create email verification sending functions
- **Code**:

  ```typescript
  import { resend } from "@/lib/resend";
  import EmailVerificationTemplate from "@/components/emails/EmailVerificationTemplate";

  export async function sendEmailVerification(
    email: string,
    userName: string,
    token: string,
  ) {
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: "Verify your email address",
      react: EmailVerificationTemplate({
        userName,
        verificationLink,
      }),
    });

    if (error) {
      throw new Error(`Email verification failed: ${error.message}`);
    }

    return data;
  }
  ```

- **Line Count**: ~25 lines

### Task 13: Create Password Reset Email Operations

- **File**: `src/operations/passwordResetOperations.ts`
- **Action**: Create password reset email sending functions
- **Code**:

  ```typescript
  import { resend } from "@/lib/resend";
  import PasswordResetTemplate from "@/components/emails/PasswordResetTemplate";

  export async function sendPasswordReset(
    email: string,
    userName: string,
    token: string,
  ) {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: "Reset your password",
      react: PasswordResetTemplate({
        userName,
        resetLink,
      }),
    });

    if (error) {
      throw new Error(`Password reset email failed: ${error.message}`);
    }

    return data;
  }
  ```

- **Line Count**: ~25 lines

### Task 13a: Create Welcome Email Operations

- **File**: `src/operations/welcomeOperations.ts`
- **Action**: Create welcome email sending functions
- **Code**:

  ```typescript
  import { resend } from "@/lib/resend";
  import WelcomeEmailTemplate from "@/components/emails/WelcomeEmailTemplate";

  export async function sendWelcomeEmail(email: string, userName: string) {
    const loginLink = `${process.env.NEXT_PUBLIC_APP_URL}/login`;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: "Welcome to Valid Names!",
      react: WelcomeEmailTemplate({
        userName,
        loginLink,
      }),
    });

    if (error) {
      throw new Error(`Welcome email failed: ${error.message}`);
    }

    return data;
  }
  ```

- **Line Count**: ~23 lines

## Validation Checklist

- [ ] Resend client created and configured
- [ ] Email types defined with proper TypeScript interfaces
- [ ] All email templates created using React Email components
- [ ] Token generation functions implemented
- [ ] Token validation functions implemented
- [ ] Email sending functions implemented for all types
- [ ] All functions include proper error handling
- [ ] All files under 150 lines of code
- [ ] Proper TypeScript types used throughout

## Next Phase

After completing Phase 2, proceed to **Phase 3: API Route Implementation** to create the backend API routes for email verification and password reset.
