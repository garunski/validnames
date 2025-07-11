"use client";

import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { FormBuilder } from "@/components/forms/FormBuilder";
import { createTurnstileValidator } from "@/components/forms/turnstileValidation";
import { Link } from "@/primitives/link";
import { validateEmail } from "@/validators/emailValidation";
import { KeyIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

function ForgotPasswordContent() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const config = {
    fields: [
      {
        name: "email",
        type: "email" as const,
        placeholder: "Enter your email address",
        required: true,
        validate: validateEmail,
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
    submitText: "Send Reset Email",
    loadingText: "Sending...",
    endpoint: "/api/auth/forgot-password",
    method: "POST" as const,
    layout: "vertical" as const,
  };

  const handleSuccess = () => {
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="relative w-full max-w-md">
        <div className="relative rounded-2xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
              <KeyIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              Reset Email Sent
            </h1>
            <p className="mb-4 text-green-600">
              We&#39;ve sent a password reset email if the address exists in our
              system.
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Please check your inbox and click the reset link to create a new
              password.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative rounded-2xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg transition-transform hover:scale-105">
              <KeyIcon className="h-8 w-8 text-white" />
            </div>
          </Link>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-600">
            Enter your email address and we&#39;ll send you a link to reset your
            password.
          </p>
        </div>
        <FormBuilder config={config} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <FeatureErrorBoundary>
      <ForgotPasswordContent />
    </FeatureErrorBoundary>
  );
}
