"use client";

import { FormBuilder } from "@/components/forms/FormBuilder";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const config = {
    fields: [
      {
        name: "email",
        type: "email" as const,
        placeholder: "Enter your email",
        required: true,
        validate: (value: string) => {
          if (!value.trim()) return "Email is required";
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
            return "Invalid email address";
          return undefined;
        },
      },
      {
        name: "password",
        type: "password" as const,
        placeholder: "Enter your password",
        required: true,
        validate: (value: string) => {
          if (!value.trim()) return "Password is required";
          return undefined;
        },
      },
    ],
    submitText: "Sign in",
    loadingText: "Signing in...",
    endpoint: "/api/auth/login",
    method: "POST" as const,
    layout: "vertical" as const,
  };

  const handleSuccess = () => {
    router.push("/applications");
  };

  const successMessage = searchParams.get("message");

  // Custom error handler to capture general error from FormBuilder
  const handleGeneralError = (error: string | null) => {
    setGeneralError(error);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative rounded-2xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <UserGroupIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Sign in to Valid Names
          </h1>
          <p className="text-sm text-gray-600">Access your dashboard</p>
        </div>
        {successMessage && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}
        {/* Single error alert with optional resend link */}
        {generalError && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-3 text-center text-sm text-red-700">
            <div>{generalError}</div>
            {generalError === "Please verify your email before logging in" && (
              <div className="mt-2">
                <a
                  href="/verify-email"
                  className="text-sm font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700"
                >
                  Resend verification email
                </a>
              </div>
            )}
          </div>
        )}
        <FormBuilder
          config={config}
          onSuccess={handleSuccess}
          onGeneralError={handleGeneralError}
        />
        <div className="mt-6 text-center">
          <a
            href="/forgot-password"
            className="text-sm font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700"
          >
            Forgot your password?
          </a>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700"
            >
              Create one now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPageWithSuspense() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
