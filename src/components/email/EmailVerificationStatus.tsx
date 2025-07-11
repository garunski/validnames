"use client";

import { handleResendError } from "@/operations/emailErrorHandler";
import { Badge } from "@/primitives/badge";
import { Button } from "@/primitives/button";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { EmailSendingSpinner } from "./EmailLoadingStates";
import {
  showEmailErrorToast,
  showEmailSuccessToast,
} from "./EmailToastNotifications";

interface EmailVerificationStatusProps {
  email: string;
  isVerified: boolean;
  verifiedAt?: Date;
}

export function EmailVerificationStatus({
  email,
  isVerified,
  verifiedAt,
}: EmailVerificationStatusProps) {
  const [isResending, setIsResending] = useState(false);

  const resendMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/auth/verify-email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send verification email");
      }

      return response.json();
    },
  });

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendMutation.mutateAsync(email);
      showEmailSuccessToast("Verification email sent successfully!");
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
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            Email Verification
          </h3>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
        <Badge color={isVerified ? "green" : "zinc"}>
          {isVerified ? "Verified" : "Not Verified"}
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
          <Button onClick={handleResend} disabled={isResending} outline>
            {isResending ? (
              <EmailSendingSpinner message="Sending..." size="sm" />
            ) : (
              "Resend Verification Email"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
