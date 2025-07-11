# AI Implementation Prompt - Security Enhancement Plan

## 🚨 Critical Rules for AI Implementation

### 1. File Size Limit

- **NO file should exceed 150 lines of code**
- Break large files into smaller, focused modules
- Use purpose-specific directories for organization

### 2. Anti-Generic Naming Rule

- **NEVER use generic names** like "util", "utils", "helper", "helpers", "service", "services", "manager", "managers", "common", "shared", "misc", "lib", "libs"
- **ALL files and directories MUST be named by their specific purpose and functionality**
- Use descriptive names that immediately convey what the code does
- Examples: "registrarLinkGenerator.ts" NOT "linkUtils.ts", "availabilityStatusFormatter.ts" NOT "statusHelper.ts"

### 3. Descriptive Naming

- Use purpose-specific names that immediately convey functionality
- Directory names must be purpose-specific: "operations/", "formatters/", "validators/", "generators/", "parsers/" etc.
- This rule applies to ALL code: components, hooks, functions, classes, directories, and variables

### 4. Existing Components

- **Use components from src/primitives/ - DO NOT modify them** (these are third-party UI components)
- **Reuse components in the src/components folder**
- **Make sure FormBuilder is used for forms** - leverage the existing FormBuilder component for all form implementations

### 5. Directory Structure

- Use purpose-specific directories: operations/, formatters/, validators/, generators/, parsers/
- Organize code by feature areas with descriptive directory names
- Follow the existing project structure and patterns

### 6. Error Handling

- Use FeatureErrorBoundary for React component error isolation
- Implement proper error handling without exposing sensitive data
- Use standardized error responses with custom error classes

### 7. State Management

- Use React Query for server state management
- Use custom hooks for feature-specific state logic
- Follow React Query patterns for data fetching and caching

### 8. Validation

- Use comprehensive Zod schemas for all API inputs
- Implement standardized error handling with structured field-level error information
- All API routes use consistent validation and error response patterns

### 9. Code Organization

- Keep API routes under 150 lines
- Keep React components under 150 lines
- Use proper separation of concerns
- Create reusable functions with descriptive names (NO generic "utility" functions)
- Follow Next.js 15 app router patterns

---

## 🎯 Implementation Task

Implement the following 6 critical security improvements to the Valid Names application:

### 1. Remove Hardcoded JWT Secret Fallback

**Current Issue:**

```typescript
// src/app/api/auth/authOperations.ts
const secretKey = process.env.JWT_SECRET || "your-secret-key";
```

**Implementation:**

- Remove hardcoded fallback
- Add proper error handling for missing secret
- Enhance environment validation
- Create secure secret generation utility

**Files to Modify:**

- `src/app/api/auth/authOperations.ts`
- `src/operations/environmentValidationOperations.ts`
- `src/operations/securityOperations.ts`

### 2. Add Environment Variable Validation on Startup

**Implementation:**

- Expand environment validation for all required variables
- Create startup validation function
- Add graceful error handling
- Different validation rules for development/production

**Files to Create/Modify:**

- `src/operations/environmentValidationOperations.ts`
- `src/app/startupValidation.ts` (new)
- `src/app/layout.tsx` (startup integration)

**Required Environment Variables:**

```typescript
const REQUIRED_ENV_VARS = {
  DATABASE_URL: "PostgreSQL connection string",
  JWT_SECRET: "Cryptographically secure secret (min 32 chars)",
  RESEND_API_KEY: "Resend email service API key",
  RESEND_FROM_EMAIL: "Verified sender email address",
  NEXT_PUBLIC_APP_URL: "Application URL",
  TURNSTILE_SECRET_KEY: "Cloudflare Turnstile secret key",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "Cloudflare Turnstile site key",
};
```

### 3. Implement Global Security Headers

**Implementation:**

- Update `next.config.mjs` with comprehensive security headers
- Add CSP, HSTS, XSS Protection, and other security headers
- Environment-specific header configurations

**Security Headers to Implement:**

```javascript
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.resend.com; frame-src https://challenges.cloudflare.com;",
  },
];
```

### 4. Add CSRF Protection for Sensitive Operations

**Implementation:**

- Create CSRF token generation and validation
- Implement middleware for sensitive routes
- Add CSRF tokens to form submissions
- Protect all state-changing operations

**Files to Create:**

- `src/operations/csrfOperations.ts`
- `src/middleware/csrfMiddleware.ts`

**Protected Operations:**

- User registration, password reset, email verification
- Profile updates, application/category/domain creation/deletion

### 5. Enhance Password Policy Requirements

**Implementation:**

- Create comprehensive password requirements
- Implement password strength scoring
- Add real-time validation feedback
- Update Zod schemas and form validation

**Password Policy:**

```typescript
const PASSWORD_POLICY = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  maxLength: 128,
  preventCommonPasswords: true,
  preventUserInfo: true,
};
```

**Files to Create:**

- `src/validators/passwordPolicyValidator.ts`
- `src/components/forms/PasswordStrengthIndicator.tsx`

### 6. Add Delete User Functionality

**Implementation:**

- Create user account deletion capability
- Implement GDPR "right to be forgotten"
- Add data export functionality
- Implement grace period for account recovery

**Deletion Strategy:**

```typescript
const DELETION_STRATEGY = {
  immediateDeletion: false,
  gracePeriodDays: 30,
  dataRetention: {
    anonymizedData: 30,
    hardDelete: true,
  },
  exportOptions: {
    json: true,
    csv: true,
    pdf: true,
  },
};
```

**Files to Create:**

- `src/app/api/user/delete/route.ts`
- `src/operations/userDeletionOperations.ts`
- `src/validators/userDeletionSchemas.ts`
- `src/components/forms/DeleteAccountForm.tsx`
- `src/components/DeleteAccountConfirmation.tsx`
- `src/app/api/user/export/route.ts`

**Deletion Process Flow:**

1. User requests account deletion
2. Re-authentication required (password + 2FA if enabled)
3. Data export offered (GDPR compliance)
4. Deletion confirmation sent via email
5. Account enters grace period (30 days)
6. User can cancel deletion during grace period
7. After grace period: hard delete all data

---

## 🔧 Technical Requirements

### Authentication & Security

- JWT-based auth with httpOnly cookies
- All data is user-scoped and filtered by userId
- Use bcrypt for password hashing (12 salt rounds)
- Implement proper session management

### Database & Architecture

- Use PostgreSQL database with Prisma as ORM
- Create clean, normalized database schema
- Use proper TypeScript types for all database entities
- Implement proper error handling

### API Guidelines

- Use Next.js API routes
- Implement proper error handling with standardized error responses
- Use appropriate HTTP status codes
- Add comprehensive request validation using Zod schemas
- All API responses follow consistent format with timestamps

### UI/UX Guidelines

- Use existing component library from src/primitives/
- Maintain consistent styling with current app
- Implement responsive design
- Use proper loading states
- Show clear success/error messages
- Follow accessibility best practices
- Use FeatureErrorBoundary for error isolation

### Form Implementation

- **ALWAYS use the existing FormBuilder component** for all forms
- Leverage the FormBuilder's built-in validation, error handling, and submission logic
- Use the FormBuilder's field types and validation patterns
- Ensure consistent form behavior across the application

---

## 📋 Implementation Checklist

### Week 1: Foundation

- [ ] Environment validation enhancement
- [ ] Remove JWT secret fallback
- [ ] Basic security headers implementation

### Week 2: Core Security

- [ ] CSRF protection implementation
- [ ] Enhanced password policy
- [ ] Security header testing

### Week 3: Integration & Testing

- [ ] Frontend integration
- [ ] Comprehensive testing
- [ ] Documentation updates

### Week 4: User Deletion & Compliance

- [ ] Delete user functionality implementation
- [ ] GDPR compliance features
- [ ] Data export functionality

### Week 5: Production Readiness

- [ ] Security audit
- [ ] Performance testing
- [ ] Legal compliance review
- [ ] Deployment preparation

---

## 🎯 Success Criteria

### Technical Success

- [ ] All environment variables properly validated
- [ ] No hardcoded secrets in codebase
- [ ] Security headers present on all routes
- [ ] CSRF protection active on sensitive operations
- [ ] Password policy enforced consistently
- [ ] User deletion functionality working correctly
- [ ] Data export functionality operational
- [ ] Grace period recovery system functional

### Security Success

- [ ] Zero security vulnerabilities in automated scans
- [ ] All security headers properly configured
- [ ] CSRF attacks prevented
- [ ] Password strength requirements met
- [ ] Environment validation prevents misconfiguration
- [ ] User deletion properly secured and authenticated
- [ ] Data export securely implemented
- [ ] No data leakage during deletion process
- [ ] Grace period security maintained

### User Experience Success

- [ ] Clear password requirements communicated
- [ ] Smooth authentication flows maintained
- [ ] Helpful error messages for security issues
- [ ] Minimal impact on application performance
- [ ] Clear account deletion process
- [ ] Easy data export functionality
- [ ] Grace period recovery process intuitive
- [ ] Privacy controls clearly communicated

---

## 🚀 Implementation Notes

1. **Start with the foundation** - environment validation and JWT secret removal
2. **Use existing patterns** - follow the established code structure and naming conventions
3. **Leverage FormBuilder** - use the existing FormBuilder for all form implementations
4. **Test thoroughly** - each security improvement should be tested independently
5. **Document changes** - update documentation as you implement each feature
6. **Maintain security** - ensure no security regressions during implementation
7. **Follow the rules** - adhere strictly to the critical rules listed above

**Remember: This is a security-critical implementation. Take your time, test thoroughly, and ensure each component is properly secured before moving to the next.**
