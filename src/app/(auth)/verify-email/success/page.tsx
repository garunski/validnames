"use client";

import { Card } from "@/components/Card";
import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VerifyEmailSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("No verification token provided");
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Verification failed");
        }

        setStatus("success");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed");
        setStatus("error");
      }
    };

    verifyEmail();
  }, [searchParams]);

  if (status === "verifying") {
    return (
      <Card maxWidth="md">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Verifying Your Email
          </h1>
          <p className="text-gray-600">
            Please wait while we verify your email address...
          </p>
        </div>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card maxWidth="md">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Verification Failed
          </h1>
          <p className="mb-6 text-red-600">{error}</p>
          <button
            onClick={() => router.push("/verify-email")}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card maxWidth="md">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-green-600">
          Email Verified Successfully!
        </h1>
        <p className="mb-4 text-green-600">
          Your email has been verified and your account is now active.
        </p>
        <p className="mb-6 text-sm text-gray-600">
          You can now log in to your account and start using Valid Names.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    </Card>
  );
}

export default function VerifyEmailSuccessPage() {
  return (
    <FeatureErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailSuccessContent />
      </Suspense>
    </FeatureErrorBoundary>
  );
}
