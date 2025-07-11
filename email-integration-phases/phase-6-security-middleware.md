# Phase 6: Security and Middleware Updates

## Overview
This phase focuses on updating middleware to allow access to email verification and password reset routes, and implementing rate limiting for email operations.

## Tasks

### Task 27: Update Middleware
- **File**: `middleware.ts`
- **Action**: Allow access to email verification and password reset routes
- **Changes**:
  ```typescript
  // Add these routes to the publicRoutes array:
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/verify-email',
    '/verify-email/success',
    '/forgot-password',
    '/reset-password',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/verify-email',
    '/api/auth/verify-email/send',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
  ];
  ```

### Task 28: Add Rate Limiting
- **File**: `src/operations/rateLimitingOperations.ts`
- **Action**: Implement rate limiting for email sending operations
- **Code**:
  ```typescript
  import { prisma } from '@/database/client';
  
  interface RateLimitConfig {
    maxAttempts: number;
    windowMs: number;
  }
  
  const EMAIL_RATE_LIMITS: Record<string, RateLimitConfig> = {
    verification: { maxAttempts: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
    passwordReset: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  };
  
  export async function checkEmailRateLimit(
    email: string,
    type: 'verification' | 'passwordReset'
  ): Promise<{ allowed: boolean; remainingAttempts: number; resetTime: Date }> {
    const config = EMAIL_RATE_LIMITS[type];
    const windowStart = new Date(Date.now() - config.windowMs);
    
    const attempts = await prisma.emailRateLimit.findMany({
      where: {
        email,
        type,
        createdAt: {
          gte: windowStart,
        },
      },
    });
    
    const remainingAttempts = Math.max(0, config.maxAttempts - attempts.length);
    const allowed = remainingAttempts > 0;
    
    if (allowed) {
      await prisma.emailRateLimit.create({
        data: {
          email,
          type,
          ipAddress: 'unknown', // Will be set by middleware
        },
      });
    }
    
    const resetTime = new Date(Date.now() + config.windowMs);
    
    return {
      allowed,
      remainingAttempts,
      resetTime,
    };
  }
  
  export async function cleanupExpiredRateLimits(): Promise<void> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    await prisma.emailRateLimit.deleteMany({
      where: {
        createdAt: {
          lt: oneDayAgo,
        },
      },
    });
  }
  ```
- **Line Count**: ~50 lines

### Task 28a: Create Rate Limit Database Model
- **File**: `prisma/schema.prisma`
- **Action**: Add EmailRateLimit model to track rate limiting
- **Schema Addition**:
  ```prisma
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
  ```

### Task 28b: Create Rate Limiting Middleware
- **File**: `src/middleware/rateLimitingMiddleware.ts`
- **Action**: Create middleware function for rate limiting
- **Code**:
  ```typescript
  import { NextRequest, NextResponse } from 'next/server';
  import { checkEmailRateLimit } from '@/operations/rateLimitingOperations';
  
  export async function rateLimitEmailOperations(
    req: NextRequest,
    type: 'verification' | 'passwordReset'
  ): Promise<NextResponse | null> {
    try {
      const body = await req.json();
      const email = body.email;
      
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        );
      }
      
      const rateLimitResult = await checkEmailRateLimit(email, type);
      
      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          { 
            error: `Too many ${type} attempts. Please try again after ${rateLimitResult.resetTime.toLocaleString()}`,
            resetTime: rateLimitResult.resetTime,
          },
          { status: 429 }
        );
      }
      
      return null; // Continue with request
    } catch (error) {
      console.error('Rate limiting error:', error);
      return NextResponse.json(
        { error: 'Rate limiting check failed' },
        { status: 500 }
      );
    }
  }
  ```
- **Line Count**: ~35 lines

### Task 28c: Update API Routes with Rate Limiting
- **File**: `src/app/api/auth/verify-email/send/route.ts`
- **Action**: Add rate limiting to verification email route
- **Changes**:
  ```typescript
  // Add import
  import { rateLimitEmailOperations } from '@/middleware/rateLimitingMiddleware';
  
  // Add at the beginning of POST function:
  const rateLimitResult = await rateLimitEmailOperations(req, 'verification');
  if (rateLimitResult) {
    return rateLimitResult;
  }
  ```

- **File**: `src/app/api/auth/forgot-password/route.ts`
- **Action**: Add rate limiting to forgot password route
- **Changes**:
  ```typescript
  // Add import
  import { rateLimitEmailOperations } from '@/middleware/rateLimitingMiddleware';
  
  // Add at the beginning of POST function:
  const rateLimitResult = await rateLimitEmailOperations(req, 'passwordReset');
  if (rateLimitResult) {
    return rateLimitResult;
  }
  ```

### Task 29: Add Security Headers
- **File**: `next.config.mjs`
- **Action**: Add security headers for email-related routes
- **Changes**:
  ```javascript
  // Add to existing config:
  const nextConfig = {
    // ... existing config
    async headers() {
      return [
        {
          source: '/api/auth/:path*',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
          ],
        },
      ];
    },
  };
  ```

### Task 30: Create Security Utilities
- **File**: `src/operations/securityOperations.ts`
- **Action**: Create security utilities for email operations
- **Code**:
  ```typescript
  import { randomBytes } from 'crypto';
  
  export function generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }
  
  export function sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }
  
  export function validateEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  export function maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return email;
    }
    
    const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  }
  
  export function isEmailDomainAllowed(email: string, allowedDomains: string[]): boolean {
    if (allowedDomains.length === 0) return true;
    
    const domain = email.split('@')[1]?.toLowerCase();
    return allowedDomains.some(allowed => domain === allowed.toLowerCase());
  }
  ```
- **Line Count**: ~35 lines

## Validation Checklist

- [ ] Middleware updated to allow email routes
- [ ] Rate limiting database model created
- [ ] Rate limiting operations implemented
- [ ] Rate limiting middleware created
- [ ] API routes updated with rate limiting
- [ ] Security headers added to Next.js config
- [ ] Security utilities created
- [ ] All rate limiting functions include proper error handling
- [ ] All files under 150 lines of code
- [ ] Proper TypeScript types used throughout
- [ ] Rate limiting cleanup function implemented

## Rate Limiting Configuration

### Email Verification
- **Limit**: 5 attempts per hour per email
- **Window**: 1 hour
- **Purpose**: Prevent spam verification requests

### Password Reset
- **Limit**: 3 attempts per hour per email
- **Window**: 1 hour
- **Purpose**: Prevent password reset abuse

## Security Considerations

1. **Rate Limiting**: Prevents abuse of email sending endpoints
2. **Token Security**: Uses cryptographically secure random tokens
3. **Email Sanitization**: Normalizes email addresses
4. **Domain Validation**: Optional domain allowlist support
5. **Security Headers**: Protects against common web vulnerabilities
6. **Cleanup**: Automatic cleanup of old rate limit records

## Next Phase
After completing Phase 6, proceed to **Phase 7: Error Handling and User Experience** to implement comprehensive error handling and improve user experience. 