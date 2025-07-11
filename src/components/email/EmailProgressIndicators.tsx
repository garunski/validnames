"use client";

interface EmailProgressStep {
  id: string;
  label: string;
  status: "completed" | "current" | "pending";
}

interface EmailProgressIndicatorProps {
  steps: EmailProgressStep[];
  currentStep: string;
}

export function EmailProgressIndicator({ steps }: EmailProgressIndicatorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step.status === "completed"
                  ? "border-green-600 bg-green-600 text-white"
                  : step.status === "current"
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-gray-200 text-gray-500"
              }`}
            >
              {step.status === "completed" ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                step.status === "completed"
                  ? "text-green-600"
                  : step.status === "current"
                    ? "text-blue-600"
                    : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 w-12 ${
                  step.status === "completed" ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmailVerificationProgress() {
  const steps: EmailProgressStep[] = [
    { id: "request", label: "Request Sent", status: "completed" },
    { id: "email", label: "Email Delivered", status: "completed" },
    { id: "click", label: "Link Clicked", status: "current" },
    { id: "verify", label: "Email Verified", status: "pending" },
  ];

  return <EmailProgressIndicator steps={steps} currentStep="click" />;
}

export function PasswordResetProgress() {
  const steps: EmailProgressStep[] = [
    { id: "request", label: "Reset Requested", status: "completed" },
    { id: "email", label: "Email Delivered", status: "completed" },
    { id: "click", label: "Link Clicked", status: "current" },
    { id: "reset", label: "Password Reset", status: "pending" },
  ];

  return <EmailProgressIndicator steps={steps} currentStep="click" />;
}
