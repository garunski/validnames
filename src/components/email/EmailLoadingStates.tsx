interface EmailLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function EmailSendingSpinner({
  message = "Sending email...",
  size = "md",
}: EmailLoadingProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${
          size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6"
        }`}
      />
      <span className="text-gray-600">{message}</span>
    </div>
  );
}

export function EmailVerifyingSpinner({
  message = "Verifying email...",
  size = "md",
}: EmailLoadingProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-green-600 ${
          size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6"
        }`}
      />
      <span className="text-gray-600">{message}</span>
    </div>
  );
}

export function EmailProcessingSpinner({
  message = "Processing...",
  size = "md",
}: EmailLoadingProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-purple-600 ${
          size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6"
        }`}
      />
      <span className="text-gray-600">{message}</span>
    </div>
  );
}
