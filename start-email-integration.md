# Email Integration Implementation - Start Prompt

You are tasked with implementing a complete email verification and password reset system for the Valid Names application. This is a Next.js 15 application with TypeScript, Prisma ORM, and PostgreSQL.

## CRITICAL RULES TO FOLLOW

1. **File Size Limit**: NO file should exceed 150 lines of code
2. **Anti-Generic Naming**: NEVER use generic names like "util", "helper", "service", "manager" - use purpose-specific names
3. **Existing Components**: Use components from `src/primitives/` - DO NOT modify them
4. **Directory Structure**: Use purpose-specific directories (operations/, formatters/, validators/, generators/, parsers/)
5. **Error Handling**: Use FeatureErrorBoundary for React component error isolation
6. **State Management**: Use React Query for server state, custom hooks for feature-specific logic
7. **Validation**: Use Zod schemas for all API inputs with structured error responses

## IMPLEMENTATION APPROACH

- Follow the phased implementation plan in the `email-integration-phases/` folder
- Start with Phase 1 and work through each phase sequentially
- Each phase builds upon the previous one
- Test each phase before moving to the next
- Use manual testing (no unit/integration tests required)

## TECHNICAL STACK

- **Backend**: Next.js 15 API routes, Prisma ORM, PostgreSQL
- **Email Service**: Resend with React Email templates
- **Frontend**: Next.js 15 App Router, Tailwind CSS, React Query
- **Validation**: Zod schemas
- **Security**: Rate limiting, CSRF protection, input validation

## KEY FEATURES TO IMPLEMENT

1. Email verification flow (registration → email → verification → welcome)
2. Password reset flow (forgot password → email → reset → success)
3. Rate limiting and security measures
4. Professional email templates
5. Error handling and user experience
6. Loading states and toast notifications

## STARTING POINT

1. Review the `email-integration-phases/README.md` for implementation overview
2. Read `email-integration-phases/IMPROVEMENTS_NEEDED.md` for critical fixes
3. Begin with `email-integration-phases/phase-1-database-setup.md`
4. Follow each phase file sequentially through phase-9

## ENVIRONMENT SETUP

- You'll need a Resend API key and domain setup
- Environment variables will be specified in each phase
- Database migrations will be created as needed

## SUCCESS CRITERIA

- Users can register and verify their email addresses
- Users can reset their passwords securely
- All email templates render correctly
- Rate limiting prevents abuse
- Error handling works for all scenarios
- Mobile-responsive design
- Comprehensive logging and monitoring

## IMPORTANT NOTES

- Use existing project patterns and naming conventions
- Follow the existing codebase structure
- Implement proper TypeScript types throughout
- Add comprehensive error handling
- Include proper JSDoc comments
- Test manually after each phase
- Ensure security best practices

## PROJECT STRUCTURE

The application follows this structure:
- `src/app/api/` - API routes
- `src/components/` - React components
- `src/lib/` - Utility libraries and services
- `src/operations/` - Business logic operations
- `src/validators/` - Zod validation schemas
- `src/primitives/` - Third-party UI components (DO NOT MODIFY)
- `prisma/` - Database schema and migrations

## EXISTING PATTERNS

- API routes use Next.js 15 App Router patterns
- Database operations use Prisma with proper error handling
- Frontend uses React Query for server state management
- Validation uses Zod schemas with structured error responses
- Error handling uses FeatureErrorBoundary for React components
- Styling uses Tailwind CSS with existing component library

## IMPLEMENTATION CHECKLIST

Before starting each phase:
- [ ] Read the phase file completely
- [ ] Understand the tasks and requirements
- [ ] Check for dependencies from previous phases
- [ ] Review the validation checklist
- [ ] Plan the implementation approach

After completing each phase:
- [ ] Test all functionality manually
- [ ] Verify error handling works
- [ ] Check that file sizes are under 150 lines
- [ ] Ensure proper TypeScript types
- [ ] Validate against the phase checklist
- [ ] Run Prettier formatting: `npx prettier --write .`
- [ ] Run TypeScript build: `npm run build` or `npx tsc --noEmit`
- [ ] Fix any formatting or TypeScript errors
- [ ] Commit changes with descriptive message: `git add . && git commit -m "feat: complete phase X - [phase description]"`
- [ ] Document any issues or deviations

## CODE QUALITY AND VERSION CONTROL

### After Each Phase Completion:
1. **Format Code**: Run `npx prettier --write .` to ensure consistent formatting
2. **Type Check**: Run `npm run build` or `npx tsc --noEmit` to catch TypeScript errors
3. **Fix Issues**: Address any formatting or type errors found
4. **Test Again**: Re-run manual tests after fixes
5. **Commit Changes**: Use descriptive commit messages following conventional commits
   - Format: `feat: complete phase X - [brief description]`
   - Examples:
     - `feat: complete phase 1 - database setup and migrations`
     - `feat: complete phase 2 - email service implementation`
     - `feat: complete phase 3 - API routes for email verification`

### Commit Message Guidelines:
- Use conventional commit format: `type: description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep descriptions concise but descriptive
- Include phase number and main functionality
- Reference any critical fixes or improvements

### Quality Gates:
- **No TypeScript errors** before committing
- **No Prettier formatting issues** before committing
- **All manual tests pass** before committing
- **File sizes under 150 lines** before committing
- **Proper error handling** implemented before committing

## NEXT STEPS

1. Read `email-integration-phases/README.md` for the complete implementation overview
2. Review `email-integration-phases/IMPROVEMENTS_NEEDED.md` for critical fixes to implement
3. Start with `email-integration-phases/phase-1-database-setup.md`
4. Implement each phase sequentially
5. Test thoroughly after each phase
6. Run code quality checks and commit changes after each phase
7. Document progress and any issues encountered

Begin by reading the implementation plan files and starting with Phase 1. Each phase contains detailed tasks, code snippets, and validation checklists to guide your implementation. 