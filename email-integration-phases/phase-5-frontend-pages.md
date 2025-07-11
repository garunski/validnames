# Phase 5: Frontend Pages Implementation

## Overview

This phase focuses on creating the React pages for email verification and password reset flows, including forms, success/error states, and proper user experience.

## Tasks

### Task 21: Create Email Verification Request Page

- **File**: `src/app/(auth)/verify-email/page.tsx`
- **Action**: Create page for users to request email verification resend
- **Code**:

  ```typescript
  'use client';

  import { useState } from 'react';
  import { useMutation } from '@tanstack/react-query';
  import { Button } from '@/primitives/button';
  import { Input } from '@/primitives/input';
  import { Card } from '@/primitives/card';
  import { FeatureErrorBoundary } from '@/components/FeatureErrorBoundary';
  import { validateEmail } from '@/validators/emailValidation';

  function VerifyEmailContent() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const sendEmailMutation = useMutation({
      mutationFn: async (email: string) => {
        const response = await fetch('/api/auth/verify-email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send verification email');
        }

        return response.json();
      },
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      sendEmailMutation.mutate(email);
    };

    if (sendEmailMutation.isSuccess) {
      return (
        <Card className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Email Sent</h1>
          <p className="text-green-600 text-center mb-4">
            Verification email sent to {email}
          </p>
          <p className="text-gray-600 text-center text-sm">
            Please check your inbox and click the verification link.
          </p>
        </Card>
      );
    }

    return (
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={sendEmailMutation.isPending}
          />
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          <Button
            type="submit"
            disabled={sendEmailMutation.isPending}
            className="w-full"
          >
            {sendEmailMutation.isPending ? 'Sending...' : 'Send Verification Email'}
          </Button>
        </form>
      </Card>
    );
  }

  export default function VerifyEmailPage() {
    return (
      <FeatureErrorBoundary>
        <VerifyEmailContent />
      </FeatureErrorBoundary>
    );
  }
  ```

- **Line Count**: ~70 lines

### Task 22: Create Email Verification Success Page

- **File**: `src/app/(auth)/verify-email/success/page.tsx`
- **Action**: Create page shown after successful email verification
- **Code**:

  ```typescript
  'use client';

  import { useEffect, useState } from 'react';
  import { useSearchParams, useRouter } from 'next/navigation';
  import { useMutation } from '@tanstack/react-query';
  import { Button } from '@/primitives/button';
  import { Card } from '@/primitives/card';
  import { FeatureErrorBoundary } from '@/components/FeatureErrorBoundary';

  function VerifyEmailSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [error, setError] = useState('');

    const verifyEmailMutation = useMutation({
      mutationFn: async (token: string) => {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Verification failed');
        }

        return response.json();
      },
    });

    useEffect(() => {
      const token = searchParams.get('token');
      if (!token) {
        setError('No verification token provided');
        setVerificationStatus('error');
        return;
      }

      verifyEmailMutation.mutate(token, {
        onSuccess: () => {
          setVerificationStatus('success');
        },
        onError: (error) => {
          setError(error.message);
          setVerificationStatus('error');
        },
      });
    }, [searchParams]);

    if (verificationStatus === 'verifying') {
      return (
        <Card className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Verifying Email</h1>
          <p className="text-gray-600 text-center">Please wait while we verify your email...</p>
        </Card>
      );
    }

    if (verificationStatus === 'error') {
      return (
        <Card className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-center text-red-600">Verification Failed</h1>
          <p className="text-red-600 text-center mb-4">{error}</p>
          <Button
            onClick={() => router.push('/verify-email')}
            className="w-full"
          >
            Try Again
          </Button>
        </Card>
      );
    }

    return (
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-green-600">Email Verified!</h1>
        <p className="text-green-600 text-center mb-4">
          Your email has been successfully verified.
        </p>
        <p className="text-gray-600 text-center text-sm mb-6">
          You can now log in to your account and start using Valid Names.
        </p>
        <Button
          onClick={() => router.push('/login')}
          className="w-full"
        >
          Go to Login
        </Button>
      </Card>
    );
  }

  export default function VerifyEmailSuccessPage() {
    return (
      <FeatureErrorBoundary>
        <VerifyEmailSuccessContent />
      </FeatureErrorBoundary>
    );
  }
  ```

- **Line Count**: ~85 lines

### Task 23: Create Forgot Password Page

- **File**: `src/app/(auth)/forgot-password/page.tsx`
- **Action**: Create page for password reset requests
- **Code**:

  ```typescript
  'use client';

  import { useState } from 'react';
  import { useMutation } from '@tanstack/react-query';
  import { Button } from '@/primitives/button';
  import { Input } from '@/primitives/input';
  import { Card } from '@/primitives/card';
  import { FeatureErrorBoundary } from '@/components/FeatureErrorBoundary';
  import { validateEmail } from '@/validators/emailValidation';

  function ForgotPasswordContent() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const forgotPasswordMutation = useMutation({
      mutationFn: async (email: string) => {
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send reset email');
        }

        return response.json();
      },
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      forgotPasswordMutation.mutate(email, {
        onSuccess: () => {
          setSuccess(true);
        },
      });
    };

    if (success) {
      return (
        <Card className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Email Sent</h1>
          <p className="text-green-600 text-center mb-4">
            Password reset email sent to {email}
          </p>
          <p className="text-gray-600 text-center text-sm">
            Please check your inbox and click the reset link.
          </p>
        </Card>
      );
    }

    return (
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={forgotPasswordMutation.isPending}
          />
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          <Button
            type="submit"
            disabled={forgotPasswordMutation.isPending}
            className="w-full"
          >
            {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Email'}
          </Button>
        </form>
      </Card>
    );
  }

  export default function ForgotPasswordPage() {
    return (
      <FeatureErrorBoundary>
        <ForgotPasswordContent />
      </FeatureErrorBoundary>
    );
  }
  ```

- **Line Count**: ~75 lines

### Task 24: Create Reset Password Page

- **File**: `src/app/(auth)/reset-password/page.tsx`
- **Action**: Create page for setting new password with token
- **Code**:

  ```typescript
  'use client';

  import { useState, useEffect } from 'react';
  import { useSearchParams, useRouter } from 'next/navigation';
  import { useMutation } from '@tanstack/react-query';
  import { Button } from '@/primitives/button';
  import { Input } from '@/primitives/input';
  import { Card } from '@/primitives/card';
  import { FeatureErrorBoundary } from '@/components/FeatureErrorBoundary';
  import { validatePassword } from '@/validators/emailValidation';

  function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    const resetPasswordMutation = useMutation({
      mutationFn: async ({ token, password }: { token: string; password: string }) => {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to reset password');
        }

        return response.json();
      },
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setPasswordErrors([]);

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const validation = validatePassword(password);
      if (!validation.isValid) {
        setPasswordErrors(validation.errors);
        return;
      }

      const token = searchParams.get('token');
      if (!token) {
        setError('No reset token provided');
        return;
      }

      resetPasswordMutation.mutate({ token, password }, {
        onSuccess: () => {
          router.push('/login?message=password-reset-success');
        },
      });
    };

    if (resetPasswordMutation.isSuccess) {
      return (
        <Card className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-center text-green-600">Password Reset</h1>
          <p className="text-green-600 text-center mb-4">
            Your password has been successfully reset.
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="w-full"
          >
            Go to Login
          </Button>
        </Card>
      );
    }

    return (
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={resetPasswordMutation.isPending}
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={resetPasswordMutation.isPending}
          />
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          {passwordErrors.length > 0 && (
            <div className="text-red-600 text-sm">
              {passwordErrors.map((err, index) => (
                <p key={index}>{err}</p>
              ))}
            </div>
          )}
          <Button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full"
          >
            {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Card>
    );
  }

  export default function ResetPasswordPage() {
    return (
      <FeatureErrorBoundary>
        <ResetPasswordContent />
      </FeatureErrorBoundary>
    );
  }
  ```

- **Line Count**: ~95 lines

### Task 25: Update Login Page

- **File**: `src/app/(auth)/login/page.tsx`
- **Action**: Add "Forgot Password?" link to existing login form
- **Changes**:
  ```typescript
  // Add after the password input field:
  <div className="flex justify-between items-center">
    <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
      Forgot Password?
    </Link>
  </div>
  ```

### Task 26: Update Profile Page

- **File**: `src/app/(app)/profile/page.tsx`
- **Action**: Add email verification status and password reset section
- **Changes**:
  ```typescript
  // Add to the profile information section:
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-500">Email Verification</span>
      <span className={`text-sm ${user.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
        {user.emailVerified ? 'Verified' : 'Not Verified'}
      </span>
    </div>
    {!user.emailVerified && (
      <Button
        onClick={() => router.push('/verify-email')}
        variant="outline"
        size="sm"
      >
        Resend Verification
      </Button>
    )}
    <Button
      onClick={() => router.push('/forgot-password')}
      variant="outline"
      size="sm"
    >
      Change Password
    </Button>
  </div>
  ```

## Validation Checklist

- [ ] Email verification request page created
- [ ] Email verification success page created
- [ ] Forgot password page created
- [ ] Reset password page created
- [ ] Login page updated with forgot password link
- [ ] Profile page updated with email verification status
- [ ] All pages use proper form validation
- [ ] All pages include loading states
- [ ] All pages handle errors gracefully
- [ ] All pages use existing UI components
- [ ] All files under 150 lines of code
- [ ] Proper TypeScript types used throughout
- [ ] FeatureErrorBoundary used for error isolation

## Next Phase

After completing Phase 5, proceed to **Phase 6: Security and Middleware Updates** to update middleware and add rate limiting for email operations.
