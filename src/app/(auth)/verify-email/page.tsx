"use client";

import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { Card } from "@/components/Card";
import { FormBuilder } from "@/components/forms/FormBuilder";
import { validateEmail } from "@/validators/emailValidation";
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
    ],
    submitText: "Send Verification Email",
    loadingText: "Sending...",
    endpoint: "/api/auth/verify-email/send",
    method: "POST" as const,
    layout: "vertical" as const,
  };

  const handleSuccess = (data?: unknown) => {
    setSuccess(true);
    // Extract email from form data or use empty string
    if (data && typeof data === "object" && "email" in data && typeof (data as { email: string }).email === "string") {
      setEmail((data as { email: string }).email);
    }
  };

  if (success) {
    return (
      <Card maxWidth="md">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Verification Email Sent
          </h1>
          <p className="mb-4 text-green-600">
            We&#39;ve sent a verification email to {email}
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Please check your inbox and click the verification link to complete your registration.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card maxWidth="md">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Verify Your Email
        </h1>
        <p className="mb-6 text-gray-600">
          Enter your email address to receive a verification link.
        </p>
      </div>
      <FormBuilder config={config} onSuccess={handleSuccess} />
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
