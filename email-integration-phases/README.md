# Email Integration Implementation Plan

## Overview

This folder contains the phased implementation plan for adding email verification and password reset functionality to the Valid Names application using Resend and React Email.

## Critical Rules for Implementation

1. **File Size Limit**: NO file should exceed 150 lines of code
2. **Anti-Generic Naming**: NEVER use generic names like "util", "helper", "service", "manager"
3. **Descriptive Naming**: Use purpose-specific names that immediately convey functionality
4. **Existing Components**: Use components from `src/primitives/` - DO NOT modify them
5. **Directory Structure**: Use purpose-specific directories (operations/, formatters/, validators/, generators/, parsers/)
6. **Error Handling**: Use FeatureErrorBoundary for React component error isolation
7. **State Management**: Use React Query for server state, custom hooks for feature-specific logic
8. **Validation**: Use Zod schemas for all API inputs with structured error responses

## Implementation Phases

### Phase 1: Database and Core Setup

- **File**: `phase-1-database-setup.md`
- **Tasks**: 1-4
- **Focus**: Prisma schema updates, migrations, dependencies, environment variables

### Phase 2: Email Service Implementation

- **File**: `phase-2-email-service.md`
- **Tasks**: 5-13
- **Focus**: Resend client, email templates, token operations, email sending functions

### Phase 3: API Route Implementation

- **File**: `phase-3-api-routes.md`
- **Tasks**: 14-19
- **Focus**: Backend API routes for email verification and password reset

### Phase 4: Validation Schemas

- **File**: `phase-4-validation-schemas.md`
- **Tasks**: 20
- **Focus**: Zod validation schemas for email operations

### Phase 5: Frontend Pages Implementation

- **File**: `phase-5-frontend-pages.md`
- **Tasks**: 21-26
- **Focus**: React pages for email verification and password reset flows

### Phase 6: Security and Middleware Updates

- **File**: `phase-6-security-middleware.md`
- **Tasks**: 27-28
- **Focus**: Middleware updates, rate limiting

### Phase 7: Error Handling and User Experience

- **File**: `phase-7-error-handling-ux.md`
- **Tasks**: 29-32
- **Focus**: Error handling, loading states, toast notifications

### Phase 8: Testing and Validation

- **File**: `phase-8-testing-validation.md`
- **Tasks**: 33-36
- **Focus**: Testing flows, edge cases, email template previews

### Phase 9: Final Polish and Documentation

- **File**: `phase-9-final-polish.md`
- **Tasks**: 37-40
- **Focus**: Styling, environment validation, documentation, logging

## Implementation Priority Order

1. **Critical Path**: Phase 1 (Database setup)
2. **Core Infrastructure**: Phase 2 (Email service)
3. **API Implementation**: Phase 3 (Backend routes)
4. **Validation**: Phase 4 (Schemas)
5. **Frontend Integration**: Phase 5 (User interface)
6. **Security & UX**: Phase 6-7 (Polish and security)
7. **Testing**: Phase 8 (Validation)
8. **Final Polish**: Phase 9 (Documentation and cleanup)

## Notes for AI Implementation

- Follow Resend's official Next.js documentation patterns
- Use React Email components for template creation instead of HTML strings
- Store Resend client in `src/lib/resend.ts` following Next.js conventions
- Email templates should be React components in `src/components/emails/`
- Use `@react-email/render` to convert React components to HTML for Resend
- Email sending functions should be in `src/lib/email.ts`
- Always handle Resend API errors properly using their error response format
- Use the `react` prop in Resend's `emails.send()` method for React Email templates
- Each task should be implemented as a separate commit
- Follow existing codebase patterns and naming conventions
- Use TypeScript for all new code
- Include proper error handling in all functions
- Add JSDoc comments for all exported functions
- Use existing UI components and styling patterns
- Test each task before moving to the next one
- Ensure proper type safety throughout implementation
