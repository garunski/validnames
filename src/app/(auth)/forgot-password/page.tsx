"use client";

import { Card } from "@/components/Card";
import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { FormBuilder } from "@/components/forms/FormBuilder";
import { validateEmail } from "@/validators/emailValidation";
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
      <Card maxWidth="md">
        <div className="text-center">
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
      </Card>
    );
  }

  return (
    <Card maxWidth="md">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Forgot Password
        </h1>
        <p className="mb-6 text-gray-600">
          Enter your email address and we&#39;ll send you a link to reset your
          password.
        </p>
      </div>
      <FormBuilder config={config} onSuccess={handleSuccess} />
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
