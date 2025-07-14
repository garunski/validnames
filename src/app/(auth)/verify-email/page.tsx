"use client";

import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { FormBuilder } from "@/components/forms/FormBuilder";
import { createTurnstileValidator } from "@/components/forms/turnstileValidation";
import { Link } from "@/primitives/link";
import { validateEmail } from "@/validators/emailValidation";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function VerifyEmailContent() {
  const [email, setEmail] = useState("");
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
    submitText: "Send Verification Email",
    loadingText: "Sending...",
    endpoint: "/api/auth/verify-email/send",
    method: "POST" as const,
    layout: "vertical" as const,
  };

  // Capture the email from the form input
  const handleSuccess = (
    _data: unknown,
    formValues?: Record<string, string>,
  ) => {
    setSuccess(true);
    if (formValues && typeof formValues.email === "string") {
      setEmail(formValues.email);
    }
  };

  if (success) {
    return (
      <div className="relative w-full max-w-md">
        <div className="relative rounded-2xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
              <EnvelopeIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              Verification Email Sent
            </h1>
            <p className="mb-4 text-green-600">
              We&apos;ve sent a verification email to {email}
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Please check your inbox and click the verification link to
              complete your registration.
            </p>
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
              <EnvelopeIcon className="h-8 w-8 text-white" />
            </div>
          </Link>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Verify Your Email
          </h1>
          <p className="text-sm text-gray-600">
            Enter your email address to receive a verification link.
          </p>
        </div>
        <FormBuilder config={config} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <FeatureErrorBoundary>
      <VerifyEmailContent />
    </FeatureErrorBoundary>
  );
}
