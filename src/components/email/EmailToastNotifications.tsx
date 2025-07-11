import { EmailError } from "@/operations/emailErrorHandler";
import { toast } from "react-hot-toast";

export function showEmailSuccessToast(message: string) {
  toast.success(message, {
    duration: 5000,
    position: "top-right",
  });
}

export function showEmailErrorToast(error: EmailError) {
  toast.error(error.userMessage, {
    duration: 7000,
    position: "top-right",
  });
}

export function showEmailInfoToast(message: string) {
  toast(message, {
    duration: 4000,
    position: "top-right",
  });
}

export function showRateLimitToast(resetTime: Date) {
  const timeUntilReset = Math.ceil(
    (resetTime.getTime() - Date.now()) / (1000 * 60),
  );
  toast.error(
    `Too many attempts. Please try again in ${timeUntilReset} minutes.`,
    {
      duration: 8000,
      position: "top-right",
    },
  );
}

export function showVerificationSuccessToast() {
  toast.success("Email verified successfully! Welcome to Valid Names.", {
    duration: 6000,
    position: "top-right",
  });
}

export function showPasswordResetSuccessToast() {
  toast.success("Password reset successfully! You can now log in.", {
    duration: 6000,
    position: "top-right",
  });
}
