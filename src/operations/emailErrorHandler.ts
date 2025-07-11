export interface EmailError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (typeof error === "object" && error && "message" in error && typeof (error as { message: string }).message === "string") {
    return (error as { message: string }).message;
  }
  return "";
}

export function handleResendError(error: unknown): EmailError {
  const message = getErrorMessage(error);
  if (message.includes("API key")) {
    return {
      code: "INVALID_API_KEY",
      message: "Invalid Resend API key",
      userMessage: "Email service configuration error. Please contact support.",
      retryable: false,
    };
  }

  if (message.includes("rate limit")) {
    return {
      code: "RATE_LIMITED",
      message: "Rate limit exceeded",
      userMessage: "Too many email requests. Please try again later.",
      retryable: true,
    };
  }

  if (message.includes("domain")) {
    return {
      code: "INVALID_DOMAIN",
      message: "Invalid sender domain",
      userMessage: "Email service configuration error. Please contact support.",
      retryable: false,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: message || "Unknown email error",
    userMessage: "Failed to send email. Please try again.",
    retryable: true,
  };
}

export function handleTokenError(error: unknown): EmailError {
  const message = getErrorMessage(error);
  if (message.includes("expired")) {
    return {
      code: "TOKEN_EXPIRED",
      message: "Token has expired",
      userMessage: "This link has expired. Please request a new one.",
      retryable: true,
    };
  }

  if (message.includes("invalid")) {
    return {
      code: "INVALID_TOKEN",
      message: "Invalid token provided",
      userMessage: "Invalid or corrupted link. Please request a new one.",
      retryable: true,
    };
  }

  return {
    code: "TOKEN_ERROR",
    message: message || "Token validation error",
    userMessage: "Unable to process your request. Please try again.",
    retryable: true,
  };
}

export function handleValidationError(error: unknown): EmailError {
  const message = getErrorMessage(error);
  return {
    code: "VALIDATION_ERROR",
    message: message || "Validation failed",
    userMessage: "Please check your input and try again.",
    retryable: true,
  };
}
