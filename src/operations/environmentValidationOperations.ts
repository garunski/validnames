import { validateJwtSecret } from "./securityOperations";

interface EnvironmentConfig {
  resendApiKey: string;
  resendFromEmail: string;
  appUrl: string;
  nodeEnv: string;
  jwtSecret: string;
  turnstileSecretKey: string;
  turnstileSiteKey: string;
  databaseUrl: string;
}

/**
 * Validates required environment variables for the entire application.
 * Throws an error if any required variable is missing or invalid.
 * @returns {EnvironmentConfig} The validated environment configuration
 */
export function validateEnvironment(): EnvironmentConfig {
  const requiredVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }

  // Validate JWT secret
  const jwtValidation = validateJwtSecret(requiredVars.JWT_SECRET!);
  if (!jwtValidation.isValid) {
    throw new Error(`JWT_SECRET validation failed: ${jwtValidation.error}`);
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

  // Validate database URL format
  if (!requiredVars.DATABASE_URL!.startsWith("postgresql://")) {
    throw new Error(
      "DATABASE_URL must be a valid PostgreSQL connection string",
    );
  }

  // Validate Turnstile keys (basic format check)
  if (requiredVars.TURNSTILE_SECRET_KEY!.length < 10) {
    throw new Error("TURNSTILE_SECRET_KEY appears to be invalid");
  }

  if (requiredVars.NEXT_PUBLIC_TURNSTILE_SITE_KEY!.length < 10) {
    throw new Error("NEXT_PUBLIC_TURNSTILE_SITE_KEY appears to be invalid");
  }

  return {
    resendApiKey: requiredVars.RESEND_API_KEY!,
    resendFromEmail: requiredVars.RESEND_FROM_EMAIL!,
    appUrl: requiredVars.NEXT_PUBLIC_APP_URL!,
    nodeEnv: process.env.NODE_ENV || "development",
    jwtSecret: requiredVars.JWT_SECRET!,
    turnstileSecretKey: requiredVars.TURNSTILE_SECRET_KEY!,
    turnstileSiteKey: requiredVars.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
    databaseUrl: requiredVars.DATABASE_URL!,
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

/**
 * Validates environment variables specifically for email integration.
 * This is a subset of the full validation for backward compatibility.
 * @returns {Partial<EnvironmentConfig>} The validated email environment configuration
 */
export function validateEmailEnvironment(): Pick<
  EnvironmentConfig,
  "resendApiKey" | "resendFromEmail" | "appUrl" | "nodeEnv"
> {
  const config = validateEnvironment();
  return {
    resendApiKey: config.resendApiKey,
    resendFromEmail: config.resendFromEmail,
    appUrl: config.appUrl,
    nodeEnv: config.nodeEnv,
  };
}
