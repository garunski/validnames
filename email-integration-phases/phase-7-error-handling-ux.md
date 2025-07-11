# Phase 7: Error Handling and User Experience

## Overview
This phase focuses on implementing comprehensive error handling, loading states, toast notifications, and email status components to provide a smooth user experience.

## Tasks

### Task 31: Create Email Error Handler
- **File**: `src/operations/emailErrorHandler.ts`
- **Action**: Create centralized error handling for email operations
- **Code**:
  ```typescript
  export interface EmailError {
    code: string;
    message: string;
    userMessage: string;
    retryable: boolean;
  }
  
  export function handleResendError(error: any): EmailError {
    if (error?.message?.includes('API key')) {
      return {
        code: 'INVALID_API_KEY',
        message: 'Invalid Resend API key',
        userMessage: 'Email service configuration error. Please contact support.',
        retryable: false,
      };
    }
    
    if (error?.message?.includes('rate limit')) {
      return {
        code: 'RATE_LIMITED',
        message: 'Rate limit exceeded',
        userMessage: 'Too many email requests. Please try again later.',
        retryable: true,
      };
    }
    
    if (error?.message?.includes('domain')) {
      return {
        code: 'INVALID_DOMAIN',
        message: 'Invalid sender domain',
        userMessage: 'Email service configuration error. Please contact support.',
        retryable: false,
      };
    }
    
    return {
      code: 'UNKNOWN_ERROR',
      message: error?.message || 'Unknown email error',
      userMessage: 'Failed to send email. Please try again.',
      retryable: true,
    };
  }
  
  export function handleTokenError(error: any): EmailError {
    if (error?.message?.includes('expired')) {
      return {
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired',
        userMessage: 'This link has expired. Please request a new one.',
        retryable: true,
      };
    }
    
    if (error?.message?.includes('invalid')) {
      return {
        code: 'INVALID_TOKEN',
        message: 'Invalid token provided',
        userMessage: 'Invalid or corrupted link. Please request a new one.',
        retryable: true,
      };
    }
    
    return {
      code: 'TOKEN_ERROR',
      message: error?.message || 'Token validation error',
      userMessage: 'Unable to process your request. Please try again.',
      retryable: true,
    };
  }
  
  export function handleValidationError(error: any): EmailError {
    return {
      code: 'VALIDATION_ERROR',
      message: error?.message || 'Validation failed',
      userMessage: 'Please check your input and try again.',
      retryable: true,
    };
  }
  ```
- **Line Count**: ~60 lines

### Task 32: Add Loading States
- **File**: `src/components/email/EmailLoadingStates.tsx`
- **Action**: Create loading state components for email operations
- **Code**:
  ```typescript
  import { Spinner } from '@/primitives/spinner';
  
  interface EmailLoadingProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
  }
  
  export function EmailSendingSpinner({ message = 'Sending email...', size = 'md' }: EmailLoadingProps) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Spinner size={size} />
        <span className="text-gray-600">{message}</span>
      </div>
    );
  }
  
  export function EmailVerifyingSpinner({ message = 'Verifying email...', size = 'md' }: EmailLoadingProps) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Spinner size={size} />
        <span className="text-gray-600">{message}</span>
      </div>
    );
  }
  
  export function EmailProcessingSpinner({ message = 'Processing...', size = 'md' }: EmailLoadingProps) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Spinner size={size} />
        <span className="text-gray-600">{message}</span>
      </div>
    );
  }
  ```
- **Line Count**: ~30 lines

### Task 33: Add Toast Notifications
- **File**: `src/components/email/EmailToastNotifications.tsx`
- **Action**: Create toast notification components for email actions
- **Code**:
  ```typescript
  import { toast } from 'react-hot-toast';
  import { EmailError } from '@/operations/emailErrorHandler';
  
  export function showEmailSuccessToast(message: string) {
    toast.success(message, {
      duration: 5000,
      position: 'top-right',
    });
  }
  
  export function showEmailErrorToast(error: EmailError) {
    toast.error(error.userMessage, {
      duration: 7000,
      position: 'top-right',
    });
  }
  
  export function showEmailInfoToast(message: string) {
    toast(message, {
      duration: 4000,
      position: 'top-right',
    });
  }
  
  export function showRateLimitToast(resetTime: Date) {
    const timeUntilReset = Math.ceil((resetTime.getTime() - Date.now()) / (1000 * 60));
    toast.error(
      `Too many attempts. Please try again in ${timeUntilReset} minutes.`,
      {
        duration: 8000,
        position: 'top-right',
      }
    );
  }
  
  export function showVerificationSuccessToast() {
    toast.success('Email verified successfully! Welcome to Valid Names.', {
      duration: 6000,
      position: 'top-right',
    });
  }
  
  export function showPasswordResetSuccessToast() {
    toast.success('Password reset successfully! You can now log in.', {
      duration: 6000,
      position: 'top-right',
    });
  }
  ```
- **Line Count**: ~40 lines

### Task 34: Create Email Status Components
- **File**: `src/components/email/EmailVerificationStatus.tsx`
- **Action**: Create component to show email verification status
- **Code**:
  ```typescript
  'use client';
  
  import { useState } from 'react';
  import { useMutation } from '@tanstack/react-query';
  import { Button } from '@/primitives/button';
  import { Badge } from '@/primitives/badge';
  import { showEmailSuccessToast, showEmailErrorToast } from './EmailToastNotifications';
  import { EmailSendingSpinner } from './EmailLoadingStates';
  import { handleResendError } from '@/operations/emailErrorHandler';
  
  interface EmailVerificationStatusProps {
    email: string;
    isVerified: boolean;
    verifiedAt?: Date;
  }
  
  export function EmailVerificationStatus({ 
    email, 
    isVerified, 
    verifiedAt 
  }: EmailVerificationStatusProps) {
    const [isResending, setIsResending] = useState(false);
    
    const resendMutation = useMutation({
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
    
    const handleResend = async () => {
      setIsResending(true);
      try {
        await resendMutation.mutateAsync(email);
        showEmailSuccessToast('Verification email sent successfully!');
      } catch (error) {
        const emailError = handleResendError(error);
        showEmailErrorToast(emailError);
      } finally {
        setIsResending(false);
      }
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Email Verification</span>
          <Badge variant={isVerified ? 'success' : 'destructive'}>
            {isVerified ? 'Verified' : 'Not Verified'}
          </Badge>
        </div>
        
        {isVerified && verifiedAt && (
          <p className="text-sm text-gray-600">
            Verified on {verifiedAt.toLocaleDateString()}
          </p>
        )}
        
        {!isVerified && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Please verify your email address to access all features.
            </p>
            <Button
              onClick={handleResend}
              disabled={isResending}
              variant="outline"
              size="sm"
            >
              {isResending ? (
                <EmailSendingSpinner message="Sending..." size="sm" />
              ) : (
                'Resend Verification Email'
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }
  ```
- **Line Count**: ~70 lines

### Task 35: Create Email Error Boundary
- **File**: `src/components/email/EmailErrorBoundary.tsx`
- **Action**: Create specialized error boundary for email components
- **Code**:
  ```typescript
  'use client';
  
  import { Component, ReactNode } from 'react';
  import { Button } from '@/primitives/button';
  import { Card } from '@/primitives/card';
  
  interface EmailErrorBoundaryState {
    hasError: boolean;
    error?: Error;
  }
  
  interface EmailErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
  }
  
  export class EmailErrorBoundary extends Component<
    EmailErrorBoundaryProps,
    EmailErrorBoundaryState
  > {
    constructor(props: EmailErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error: Error): EmailErrorBoundaryState {
      return { hasError: true, error };
    }
    
    componentDidCatch(error: Error, errorInfo: any) {
      console.error('Email component error:', error, errorInfo);
    }
    
    handleRetry = () => {
      this.setState({ hasError: false, error: undefined });
    };
    
    render() {
      if (this.state.hasError) {
        if (this.props.fallback) {
          return this.props.fallback;
        }
        
        return (
          <Card className="p-4 border-red-200 bg-red-50">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              Email Service Error
            </h3>
            <p className="text-sm text-red-700 mb-3">
              Something went wrong with the email service. Please try again.
            </p>
            <Button onClick={this.handleRetry} size="sm" variant="outline">
              Try Again
            </Button>
          </Card>
        );
      }
      
      return this.props.children;
    }
  }
  ```
- **Line Count**: ~55 lines

### Task 36: Create Email Progress Indicators
- **File**: `src/components/email/EmailProgressIndicators.tsx`
- **Action**: Create progress indicators for multi-step email processes
- **Code**:
  ```typescript
  interface EmailProgressStep {
    id: string;
    label: string;
    status: 'pending' | 'current' | 'completed' | 'error';
  }
  
  interface EmailProgressIndicatorProps {
    steps: EmailProgressStep[];
    currentStep: string;
  }
  
  export function EmailProgressIndicator({ steps, currentStep }: EmailProgressIndicatorProps) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.status === 'completed' 
                  ? 'bg-green-500 border-green-500 text-white'
                  : step.status === 'current'
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : step.status === 'error'
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}>
                {step.status === 'completed' ? '✓' : step.status === 'error' ? '✕' : index + 1}
              </div>
              <span className={`ml-2 text-sm ${
                step.status === 'completed' 
                  ? 'text-green-600'
                  : step.status === 'current'
                  ? 'text-blue-600 font-medium'
                  : step.status === 'error'
                  ? 'text-red-600'
                  : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export function EmailVerificationProgress() {
    const steps: EmailProgressStep[] = [
      { id: 'request', label: 'Request Sent', status: 'completed' },
      { id: 'email', label: 'Email Delivered', status: 'completed' },
      { id: 'click', label: 'Link Clicked', status: 'current' },
      { id: 'verify', label: 'Email Verified', status: 'pending' },
    ];
    
    return <EmailProgressIndicator steps={steps} currentStep="click" />;
  }
  
  export function PasswordResetProgress() {
    const steps: EmailProgressStep[] = [
      { id: 'request', label: 'Reset Requested', status: 'completed' },
      { id: 'email', label: 'Email Delivered', status: 'completed' },
      { id: 'click', label: 'Link Clicked', status: 'current' },
      { id: 'reset', label: 'Password Reset', status: 'pending' },
    ];
    
    return <EmailProgressIndicator steps={steps} currentStep="click" />;
  }
  ```
- **Line Count**: ~65 lines

## Validation Checklist

- [ ] Email error handler created with comprehensive error types
- [ ] Loading state components created for all email operations
- [ ] Toast notification system implemented
- [ ] Email verification status component created
- [ ] Email error boundary component created
- [ ] Email progress indicators created
- [ ] All components use existing UI primitives
- [ ] All components include proper TypeScript types
- [ ] All components handle loading and error states
- [ ] All files under 150 lines of code
- [ ] Proper error messages for different scenarios
- [ ] User-friendly error messages implemented

## Error Handling Strategy

1. **Resend API Errors**: Handle API key, rate limiting, and domain errors
2. **Token Errors**: Handle expired and invalid tokens
3. **Validation Errors**: Handle input validation failures
4. **Network Errors**: Handle connection and timeout issues
5. **User Feedback**: Provide clear, actionable error messages

## User Experience Features

1. **Loading States**: Visual feedback during email operations
2. **Toast Notifications**: Non-intrusive success/error messages
3. **Progress Indicators**: Multi-step process visualization
4. **Error Boundaries**: Graceful error handling and recovery
5. **Status Components**: Clear email verification status display

## Next Phase
After completing Phase 7, proceed to **Phase 8: Testing and Validation** to test all email flows and edge cases. 