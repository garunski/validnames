# Phase 1: Database and Core Setup

## Overview
This phase focuses on setting up the database schema, migrations, dependencies, and environment variables needed for email integration.

## Tasks

### Task 1: Update Prisma Schema
- **File**: `prisma/schema.prisma`
- **Action**: Add new models for email verification and password reset tokens
- **Details**: 
  - Add `EmailVerificationToken` model with fields: id, userId, token, expiresAt, createdAt, user relation
  - Add `PasswordResetToken` model with fields: id, userId, token, expiresAt, createdAt, user relation
  - Add `EmailRateLimit` model for rate limiting
  - Add `EmailLog` model for logging email operations
  - Update `User` model to include: emailVerified (Boolean), emailVerifiedAt (DateTime), relations to all token models
  - Add proper indexes and table mappings

**Schema Changes**:
```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String?
  password          String
  emailVerified     Boolean   @default(false)
  emailVerifiedAt   DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  emailVerificationTokens EmailVerificationToken[]
  passwordResetTokens     PasswordResetToken[]
  emailRateLimits         EmailRateLimit[]
  emailLogs               EmailLog[]
  applications            Application[]
  categories             Category[]
  domains                Domain[]
  tlds                   TLD[]
  checks                 Check[]
  backgroundJobs         BackgroundJob[]
}

model EmailVerificationToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([token])
  @@index([userId])
  @@index([expiresAt])
  @@map("email_verification_tokens")
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([token])
  @@index([userId])
  @@index([expiresAt])
  @@map("password_reset_tokens")
}

model EmailRateLimit {
  id        String   @id @default(cuid())
  email     String
  type      String   // 'verification' or 'passwordReset'
  ipAddress String?
  createdAt DateTime @default(now())
  
  @@index([email, type, createdAt])
  @@index([ipAddress, type, createdAt])
  @@map("email_rate_limits")
}

model EmailLog {
  id        String   @id @default(cuid())
  type      String   // 'verification', 'password_reset', 'welcome'
  email     String
  userId    String?
  status    String   // 'success', 'error'
  error     String?
  metadata  Json?
  createdAt DateTime @default(now())
  
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@index([type, createdAt])
  @@index([email, createdAt])
  @@index([status, createdAt])
  @@map("email_logs")
}
```

### Task 2: Create Database Migration
- **Command**: `npx prisma migrate dev --name add-email-verification`
- **Action**: Generate and apply database migration for new schema changes
- **Expected Output**: New migration file created in `prisma/migrations/`

### Task 3: Install Dependencies
- **Command**: `npm install resend crypto @react-email/components @react-email/render react-hot-toast bcryptjs`
- **Command**: `npm install --save-dev @types/crypto @types/bcryptjs`
- **Action**: Add required packages for Resend email with React Email templates
- **Packages**:
  - `resend`: Email delivery service
  - `crypto`: Node.js crypto module for token generation
  - `@react-email/components`: React components for email templates
  - `@react-email/render`: Render React components to HTML
  - `react-hot-toast`: Toast notifications for user feedback
  - `bcryptjs`: Password hashing for reset functionality
  - `@types/crypto`: TypeScript types for crypto module
  - `@types/bcryptjs`: TypeScript types for bcryptjs

### Task 4: Update Environment Variables
- **File**: `.env.local` or `.env`
- **Action**: Add the following variables:
  ```
  # Required for email functionality
  RESEND_API_KEY=your_resend_api_key
  RESEND_FROM_EMAIL=noreply@yourdomain.com
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  
  # Optional (for development)
  NODE_ENV=development
  ```
- **Notes**:
  - Get RESEND_API_KEY from [Resend Dashboard](https://resend.com/api-keys)
  - RESEND_FROM_EMAIL should be a verified domain in Resend
  - NEXT_PUBLIC_APP_URL should match your development/production URL
  - NODE_ENV is automatically set by Next.js but can be overridden

### Task 5: Create Environment Validation
- **File**: `src/operations/environmentValidationOperations.ts`
- **Action**: Create environment validation to ensure all required variables are set
- **Code**:
  ```typescript
  interface EnvironmentConfig {
    resendApiKey: string;
    resendFromEmail: string;
    appUrl: string;
    nodeEnv: string;
  }
  
  export function validateEnvironment(): EnvironmentConfig {
    const requiredVars = {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    };
    
    const missingVars = Object.entries(requiredVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
    
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requiredVars.RESEND_FROM_EMAIL!)) {
      throw new Error('RESEND_FROM_EMAIL must be a valid email address');
    }
    
    // Validate URL format
    try {
      new URL(requiredVars.NEXT_PUBLIC_APP_URL!);
    } catch {
      throw new Error('NEXT_PUBLIC_APP_URL must be a valid URL');
    }
    
    return {
      resendApiKey: requiredVars.RESEND_API_KEY!,
      resendFromEmail: requiredVars.RESEND_FROM_EMAIL!,
      appUrl: requiredVars.NEXT_PUBLIC_APP_URL!,
      nodeEnv: process.env.NODE_ENV || 'development',
    };
  }
  
  export function getEnvironmentConfig(): EnvironmentConfig {
    try {
      return validateEnvironment();
    } catch (error) {
      console.error('Environment validation failed:', error);
      throw error;
    }
  }
  ```
- **Line Count**: ~45 lines

## Validation Checklist

- [ ] Prisma schema updated with all required models
- [ ] Database migration created and applied successfully
- [ ] All dependencies installed without errors
- [ ] Environment variables added to .env.local
- [ ] Environment validation function created
- [ ] Resend API key obtained and configured
- [ ] From email address verified in Resend dashboard
- [ ] All database indexes created properly
- [ ] User model relations updated correctly

## Database Models Summary

### Core Models:
- **EmailVerificationToken**: Stores verification tokens with expiration
- **PasswordResetToken**: Stores password reset tokens with expiration
- **EmailRateLimit**: Tracks rate limiting for email operations
- **EmailLog**: Logs all email operations for monitoring

### Key Features:
- **Cascade Deletes**: Tokens are automatically deleted when user is deleted
- **Indexes**: Optimized queries for token lookup and rate limiting
- **Expiration Tracking**: Automatic cleanup of expired tokens
- **Audit Trail**: Complete logging of email operations
- **Rate Limiting**: Prevents abuse of email endpoints

## Next Phase
After completing Phase 1, proceed to **Phase 2: Email Service Implementation** to set up the Resend client and email templates. 