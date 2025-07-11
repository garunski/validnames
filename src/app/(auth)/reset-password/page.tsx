"use client";

import { Card } from "@/components/Card";
import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { FormBuilder } from "@/components/forms/FormBuilder";
import { PasswordStrengthIndicator } from "@/components/forms/PasswordStrengthIndicator";
import { createTurnstileValidator } from "@/components/forms/turnstileValidation";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");

  // Get token from URL on component mount
  useState(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  });

  const validateConfirmPassword = (
    confirmPassword: string,
    allValues?: Record<string, string>,
  ) => {
    if (!confirmPassword.trim()) return "Please confirm your password";
    if (allValues && confirmPassword !== allValues["password"]) {
      return "Passwords do not match";
    }
    return undefined;
  };

  const config = {
    fields: [
      {
        name: "password",
        type: "password" as const,
        placeholder: "Enter new password",
        required: true,
        validate: (value: string) => {
          setPassword(value);
          return undefined;
        },
        onChange: (value: string) => setPassword(value),
      },
      {
        name: "confirmPassword",
        type: "password" as const,
        placeholder: "Confirm new password",
        required: true,
        validate: validateConfirmPassword,
      },
      {
        name: "turnstileToken",
        type: "turnstile" as const,
        placeholder: "",
        required: true,
        siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
        validate: createTurnstileValidator(),
      },
    ],
    submitText: "Reset Password",
    loadingText: "Resetting...",
    endpoint: "/api/auth/reset-password",
    method: "POST" as const,
    layout: "vertical" as const,
  };

  const handleSuccess = () => {
    setSuccess(true);
  };

  if (!token) {
    return (
      <Card maxWidth="md">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Invalid Reset Link
          </h1>
          <p className="mb-6 text-red-600">
            No reset token provided. Please use the link from your email.
          </p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Request New Reset Link
          </button>
        </div>
      </Card>
    );
  }

  if (success) {
    return (
      <Card maxWidth="md">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-green-600">
            Password Reset Successfully
          </h1>
          <p className="mb-4 text-green-600">
            Your password has been updated successfully.
          </p>
          <p className="mb-6 text-sm text-gray-600">
            You can now log in with your new password.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card maxWidth="md">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Reset Your Password
        </h1>
        <p className="mb-6 text-gray-600">Enter your new password below.</p>
      </div>
      <FormBuilder
        config={config}
        onSuccess={handleSuccess}
        additionalData={{ token }}
      />
      <div className="my-4">
        <PasswordStrengthIndicator password={password} />
      </div>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <FeatureErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </FeatureErrorBoundary>
  );
}
