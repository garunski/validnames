# Phase 8: Testing and Validation

## Overview

This phase focuses on manual testing of email flows, edge cases, and creating email template previews for development and validation.

## Tasks

### Task 37: Manual Testing - Email Verification Flow

- **Action**: Manually test complete email verification flow
- **Steps**:
  1. Register a new user
  2. Verify email is sent automatically
  3. Check email inbox for verification link
  4. Click verification link
  5. Verify user is marked as verified
  6. Verify welcome email is sent
  7. Test login with verified account

### Task 38: Manual Testing - Password Reset Flow

- **Action**: Manually test complete password reset flow
- **Steps**:
  1. Go to forgot password page
  2. Enter email address
  3. Verify reset email is sent
  4. Check email inbox for reset link
  5. Click reset link
  6. Enter new password
  7. Verify password is updated
  8. Test login with new password

### Task 39: Manual Testing - Edge Cases

- **Action**: Manually test error scenarios and edge cases
- **Test Cases**:
  1. **Expired tokens**: Wait 24+ hours and try to use token
  2. **Invalid tokens**: Use malformed or non-existent tokens
  3. **Already verified users**: Try to verify already verified email
  4. **Non-existent users**: Try to send email to non-existent user
  5. **Rate limiting**: Exceed rate limits and verify proper error messages
  6. **Invalid email formats**: Test with malformed email addresses
  7. **Weak passwords**: Test password validation rules
  8. **Network errors**: Simulate network failures

### Task 40: Add Email Template Previews

- **File**: `src/app/api/email/preview/route.ts`
- **Action**: Create development route to preview email templates
- **Code**:

  ```typescript
  import { NextRequest, NextResponse } from "next/server";
  import { render } from "@react-email/render";
  import EmailVerificationTemplate from "@/components/emails/EmailVerificationTemplate";
  import PasswordResetTemplate from "@/components/emails/PasswordResetTemplate";
  import WelcomeEmailTemplate from "@/components/emails/WelcomeEmailTemplate";

  export async function GET(req: NextRequest) {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "Not available in production" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(req.url);
    const template = searchParams.get("template");
    const userName = searchParams.get("userName") || "John Doe";

    let html = "";
    let subject = "";

    switch (template) {
      case "verification":
        html = render(
          EmailVerificationTemplate({
            userName,
            verificationLink:
              "https://example.com/verify?token=sample-token-123",
          }),
        );
        subject = "Verify your email address";
        break;

      case "reset":
        html = render(
          PasswordResetTemplate({
            userName,
            resetLink: "https://example.com/reset?token=sample-token-123",
          }),
        );
        subject = "Reset your password";
        break;

      case "welcome":
        html = render(
          WelcomeEmailTemplate({
            userName,
            loginLink: "https://example.com/login",
          }),
        );
        subject = "Welcome to Valid Names!";
        break;

      default:
        return NextResponse.json(
          {
            error: "Template not found",
            availableTemplates: ["verification", "reset", "welcome"],
          },
          { status: 404 },
        );
    }

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Preview - ${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .preview-header { background: #f5f5f5; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
            .email-content { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
            .template-info { margin-top: 20px; padding: 15px; background: #e8f4fd; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="preview-header">
            <h1>Email Template Preview</h1>
            <p><strong>Template:</strong> ${template}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>User:</strong> ${userName}</p>
          </div>
          
          <div class="email-content">
            ${html}
          </div>
          
          <div class="template-info">
            <h3>Template Information</h3>
            <p><strong>URL:</strong> /api/email/preview?template=${template}&userName=${userName}</p>
            <p><strong>Available Templates:</strong> verification, reset, welcome</p>
            <p><strong>Parameters:</strong> template, userName (optional)</p>
          </div>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    );
  }
  ```

- **Line Count**: ~70 lines

### Task 41: Create Email Testing Utilities

- **File**: `src/operations/emailTestingOperations.ts`
- **Action**: Create utilities for manual testing of email functionality
- **Code**:

  ```typescript
  import { prisma } from "@/lib/prisma";
  import {
    generateEmailVerificationToken,
    generatePasswordResetToken,
  } from "./tokenOperations";
  import {
    sendEmailVerification,
    sendPasswordReset,
  } from "./emailVerificationOperations";

  export async function createTestEmailVerification(userId: string) {
    const token = await generateEmailVerificationToken(userId);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    await sendEmailVerification(user.email, user.name || "Test User", token);

    return {
      token,
      user,
      verificationLink: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`,
    };
  }

  export async function createTestPasswordReset(userId: string) {
    const token = await generatePasswordResetToken(userId);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    await sendPasswordReset(user.email, user.name || "Test User", token);

    return {
      token,
      user,
      resetLink: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`,
    };
  }

  export async function cleanupTestTokens() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    await prisma.emailVerificationToken.deleteMany({
      where: {
        createdAt: {
          lt: oneHourAgo,
        },
      },
    });

    await prisma.passwordResetToken.deleteMany({
      where: {
        createdAt: {
          lt: oneHourAgo,
        },
      },
    });
  }

  export async function getEmailStats() {
    const [verificationTokens, resetTokens, verifiedUsers] = await Promise.all([
      prisma.emailVerificationToken.count(),
      prisma.passwordResetToken.count(),
      prisma.user.count({ where: { emailVerified: true } }),
    ]);

    return {
      activeVerificationTokens: verificationTokens,
      activeResetTokens: resetTokens,
      verifiedUsers,
    };
  }
  ```

- **Line Count**: ~60 lines

### Task 42: Create Email Testing API Routes

- **File**: `src/app/api/test/email/route.ts`
- **Action**: Create testing endpoints for manual email testing (development only)
- **Code**:

  ```typescript
  import { NextRequest, NextResponse } from "next/server";
  import {
    createTestEmailVerification,
    createTestPasswordReset,
    cleanupTestTokens,
    getEmailStats,
  } from "@/operations/emailTestingOperations";
  import { prisma } from "@/lib/prisma";

  export async function GET(req: NextRequest) {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "Not available in production" },
        { status: 404 },
      );
    }

    const stats = await getEmailStats();
    return NextResponse.json(stats);
  }

  export async function POST(req: NextRequest) {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "Not available in production" },
        { status: 404 },
      );
    }

    try {
      const { action, userId } = await req.json();

      switch (action) {
        case "create-verification":
          const verification = await createTestEmailVerification(userId);
          return NextResponse.json(verification);

        case "create-reset":
          const reset = await createTestPasswordReset(userId);
          return NextResponse.json(reset);

        case "cleanup":
          await cleanupTestTokens();
          return NextResponse.json({ message: "Test tokens cleaned up" });

        case "stats":
          const stats = await getEmailStats();
          return NextResponse.json(stats);

        default:
          return NextResponse.json(
            { error: "Invalid action" },
            { status: 400 },
          );
      }
    } catch (error) {
      console.error("Email testing error:", error);
      return NextResponse.json(
        { error: "Testing operation failed" },
        { status: 500 },
      );
    }
  }
  ```

- **Line Count**: ~55 lines

## Validation Checklist

- [ ] Email verification flow manually tested
- [ ] Password reset flow manually tested
- [ ] All edge cases manually tested
- [ ] Email template preview route created
- [ ] Email testing utilities implemented
- [ ] Email testing API routes created (development only)
- [ ] Rate limiting manually tested
- [ ] Error handling manually tested for all scenarios
- [ ] All templates render correctly
- [ ] All API endpoints return proper responses
- [ ] Database operations work correctly
- [ ] Token expiration works as expected

## Manual Testing Scenarios

### Happy Path Testing

1. **Registration Flow**: User registers → Email sent → User verifies → Welcome email sent
2. **Password Reset Flow**: User requests reset → Email sent → User resets password → Success
3. **Login Flow**: Verified user logs in successfully

### Error Path Testing

1. **Invalid Tokens**: Expired, malformed, or non-existent tokens
2. **Rate Limiting**: Exceeding email send limits
3. **Network Errors**: Simulated API failures
4. **Validation Errors**: Invalid email formats, weak passwords
5. **Already Verified**: Attempting to verify already verified email

### Edge Case Testing

1. **Concurrent Requests**: Multiple verification attempts
2. **Token Cleanup**: Automatic cleanup of expired tokens
3. **Email Formatting**: Various email address formats
4. **Special Characters**: Passwords with special characters
5. **Long Inputs**: Very long email addresses or passwords

## Development Tools

### Email Template Preview

- **URL**: `/api/email/preview?template=verification&userName=John`
- **Templates**: verification, reset, welcome
- **Parameters**: template, userName (optional)

### Email Testing API

- **URL**: `/api/test/email`
- **Actions**: create-verification, create-reset, cleanup, stats
- **Environment**: Development only

## Next Phase

After completing Phase 8, proceed to **Phase 9: Final Polish and Documentation** to add styling, environment validation, and comprehensive documentation.
