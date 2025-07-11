interface EnvironmentConfig {
  resendApiKey: string;
  resendFromEmail: string;
  appUrl: string;
  nodeEnv: string;
}

/**
 * Validates required environment variables for email integration.
 * Throws an error if any required variable is missing or invalid.
 * @returns {EnvironmentConfig} The validated environment configuration
 */
export function validateEnvironment(): EnvironmentConfig {
  const requiredVars = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(requiredVars.RESEND_FROM_EMAIL!)) {
    throw new Error("RESEND_FROM_EMAIL must be a valid email address");
  }

  // Validate URL format
  try {
    new URL(requiredVars.NEXT_PUBLIC_APP_URL!);
  } catch {
    throw new Error("NEXT_PUBLIC_APP_URL must be a valid URL");
  }

  return {
    resendApiKey: requiredVars.RESEND_API_KEY!,
    resendFromEmail: requiredVars.RESEND_FROM_EMAIL!,
    appUrl: requiredVars.NEXT_PUBLIC_APP_URL!,
    nodeEnv: process.env.NODE_ENV || "development",
  };
}

/**
 * Returns the validated environment configuration, logging errors if validation fails.
 * @returns {EnvironmentConfig}
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  try {
    return validateEnvironment();
  } catch (error) {
    console.error("Environment validation failed:", error);
    throw error;
  }
}
