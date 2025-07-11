"use client";

import { Card } from "@/components/Card";
import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
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
      <Card maxWidth="md">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Verification Email Sent
          </h1>
          <p className="mb-4 text-green-600">
            We&apos;ve sent a verification email to {email}
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Please check your inbox and click the verification link to complete
            your registration.
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
