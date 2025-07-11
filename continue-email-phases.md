# Email Integration - Continue Phases Prompt

You are continuing the implementation of the email verification and password reset system for the Valid Names application. The previous agent has started the implementation and you need to continue from where they left off.

## CONTEXT

- This is a Next.js 15 application with TypeScript, Prisma ORM, and PostgreSQL
- The implementation follows a 9-phase plan in the `email-integration-phases/` folder
- Each phase builds upon the previous one and must be completed sequentially
- Manual testing is required (no unit/integration tests)

## CRITICAL RULES TO FOLLOW

1. **File Size Limit**: NO file should exceed 150 lines of code
2. **Anti-Generic Naming**: NEVER use generic names like "util", "helper", "service", "manager" - use purpose-specific names
3. **Existing Components**: Use components from `src/primitives/` - DO NOT modify them
4. **Directory Structure**: Use purpose-specific directories (operations/, formatters/, validators/, generators/, parsers/)
5. **Error Handling**: Use FeatureErrorBoundary for React component error isolation
6. **State Management**: Use React Query for server state, custom hooks for feature-specific logic
7. **Validation**: Use Zod schemas for all API inputs with structured error responses

## ASSESSMENT STEPS

### 1. Review Current State

- Check what has been implemented so far
- Review the `email-integration-phases/` folder structure
- Read `email-integration-phases/IMPROVEMENTS_NEEDED.md` for critical fixes
- Examine the current codebase to understand what's been done

### 2. Identify Current Phase

- Check which phase files exist and their content
- Look for implementation artifacts in the codebase
- Determine the last completed phase
- Identify any incomplete tasks or issues

### 3. Validate Previous Work

- Ensure all previous phases are properly implemented
- Check that critical fixes from `IMPROVEMENTS_NEEDED.md` are applied
- Verify file sizes are under 150 lines
- Confirm proper TypeScript types and error handling

## CONTINUATION STRATEGY

### If Previous Phase is Complete

1. **Read the next phase file** from `email-integration-phases/`
2. **Review dependencies** from previous phases
3. **Implement the phase** following the detailed instructions
4. **Test manually** after implementation
5. **Validate against checklist** in the phase file

### If Previous Phase is Incomplete

1. **Complete any unfinished tasks** from the previous phase
2. **Fix any issues** or errors found
3. **Test the completed phase** thoroughly
4. **Then proceed** to the next phase

### If Issues Found

1. **Document the issues** clearly
2. **Apply fixes** from `IMPROVEMENTS_NEEDED.md`
3. **Test the fixes** manually
4. **Continue with next phase** only after resolution

## PHASE IMPLEMENTATION GUIDELINES

### For Each Phase:

1. **Read the phase file completely** before starting
2. **Understand all tasks and requirements**
3. **Check for dependencies** from previous phases
4. **Follow the exact file paths and naming** specified
5. **Implement all tasks** in the phase
6. **Test manually** after each task
7. **Validate against the phase checklist**
8. **Run code quality checks** and fix any issues
9. **Commit changes** with descriptive message

### File Implementation:

- **Database**: Follow Prisma schema patterns
- **API Routes**: Use Next.js 15 App Router patterns
- **Components**: Use existing `src/primitives/` components
- **Validation**: Use Zod schemas with structured errors
- **Error Handling**: Use FeatureErrorBoundary for React components

## TECHNICAL REQUIREMENTS

### Database Operations

- Use Prisma ORM with proper error handling
- Follow existing schema patterns
- Add proper indexes and constraints
- Use meaningful field names and types

### API Routes

- Use Next.js 15 API routes
- Implement proper error handling
- Use Zod validation for all inputs
- Return structured error responses
- Use appropriate HTTP status codes

### Frontend Components

- Use existing `src/primitives/` components
- Implement proper loading states
- Add error boundaries
- Use React Query for server state
- Follow existing styling patterns

### Email Integration

- Use Resend with React Email templates
- Implement proper error handling
- Add rate limiting and security
- Use professional email templates
- Add comprehensive logging

## QUALITY ASSURANCE

### Before Moving to Next Phase:

- [ ] All tasks in current phase completed
- [ ] Manual testing passed
- [ ] Error handling works properly
- [ ] File sizes under 150 lines
- [ ] TypeScript types are correct
- [ ] No linting errors
- [ ] Follows existing patterns
- [ ] Security measures implemented
- [ ] Prettier formatting applied: `npx prettier --write .`
- [ ] TypeScript build successful: `npm run build` or `npx tsc --noEmit`
- [ ] All formatting and TypeScript errors fixed
- [ ] Changes committed: `git add . && git commit -m "feat: complete phase X - [phase description]"`

## CODE QUALITY AND VERSION CONTROL

### Phase Completion Workflow:

1. **Complete Implementation**: Finish all tasks in the current phase
2. **Manual Testing**: Test all functionality thoroughly
3. **Code Formatting**: Run `npx prettier --write .` to ensure consistent formatting
4. **Type Checking**: Run `npm run build` or `npx tsc --noEmit` to catch TypeScript errors
5. **Fix Issues**: Address any formatting or type errors found
6. **Re-test**: Run manual tests again after fixes
7. **Commit Changes**: Use descriptive commit messages following conventional commits

### Commit Message Guidelines:

- Use conventional commit format: `type: description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep descriptions concise but descriptive
- Include phase number and main functionality
- Reference any critical fixes or improvements
- Examples:
  - `feat: complete phase 4 - validation schemas for email operations`
  - `feat: complete phase 5 - frontend pages for email verification`
  - `feat: complete phase 6 - security middleware and rate limiting`

### Quality Gates:

- **No TypeScript errors** before committing
- **No Prettier formatting issues** before committing
- **All manual tests pass** before committing
- **File sizes under 150 lines** before committing
- **Proper error handling** implemented before committing
- **Security measures** properly implemented before committing

### Critical Checks:

- [ ] Database schema is correct and migrated
- [ ] API routes handle errors properly
- [ ] Frontend components are accessible
- [ ] Email templates render correctly
- [ ] Rate limiting is working
- [ ] Environment variables are set
- [ ] Dependencies are installed

## TROUBLESHOOTING

### Common Issues:

1. **File Size Exceeds 150 Lines**: Break into smaller, purpose-specific files
2. **Generic Naming**: Use descriptive, purpose-specific names
3. **Missing Dependencies**: Check `IMPROVEMENTS_NEEDED.md` for missing packages
4. **Database Errors**: Ensure migrations are run and schema is correct
5. **API Errors**: Check validation schemas and error handling
6. **Email Issues**: Verify Resend API key and domain setup
7. **Prettier Errors**: Run `npx prettier --write .` to fix formatting
8. **TypeScript Errors**: Fix type issues before committing
9. **Build Errors**: Ensure `npm run build` passes before moving to next phase

### Getting Help:

- Review `email-integration-phases/IMPROVEMENTS_NEEDED.md` for known issues
- Check existing codebase patterns for guidance
- Use the phase file checklists for validation
- Test manually to identify issues

## NEXT ACTIONS

1. **Assess the current state** of the implementation
2. **Identify the current phase** and any incomplete work
3. **Apply critical fixes** from `IMPROVEMENTS_NEEDED.md`
4. **Complete the current phase** if needed
5. **Move to the next phase** following the detailed instructions
6. **Test thoroughly** after each phase
7. **Run code quality checks** and commit changes after each phase
8. **Document progress** and any issues encountered

## SUCCESS CRITERIA

- All 9 phases completed successfully
- Email verification flow works end-to-end
- Password reset flow works end-to-end
- Rate limiting and security measures implemented
- Error handling works for all scenarios
- Mobile-responsive design
- Comprehensive logging and monitoring
- All files under 150 lines
- Proper TypeScript types throughout
- Follows existing project patterns

Continue the implementation from where the previous agent left off, ensuring quality and following all established patterns and requirements.
