interface EnvironmentConfig {
  appUrl: string;
  nodeEnv: string;
  jwtSecret: string;
  turnstileSecretKey: string;
  turnstileSiteKey: string;
  databaseUrl: string;
}

/**
 * Validates required environment variables
 * @returns {EnvironmentConfig} The validated environment configuration
 */
export function validateEnvironment(): EnvironmentConfig {
  const isProduction = process.env.NODE_ENV === "production";
  const isBuildTime = process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV;
  
  // Skip validation during build time on Vercel
  if (isBuildTime) {
    return {
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "",
      nodeEnv: process.env.NODE_ENV || "development",
      jwtSecret: process.env.JWT_SECRET || "",
      turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || "",
      turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
      databaseUrl: process.env.DATABASE_URL || "",
    };
  }

  const requiredVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  };

  // Only require Turnstile keys in production
  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => {
      if (
        !isProduction &&
        (key === "TURNSTILE_SECRET_KEY" ||
          key === "NEXT_PUBLIC_TURNSTILE_SITE_KEY")
      ) {
        return false;
      }
      return !value;
    })
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }

  // Validate JWT secret length
  if (requiredVars.JWT_SECRET!.length < 32) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters long for security",
    );
  }

  // Validate Resend API key format
  if (!requiredVars.RESEND_API_KEY!.startsWith("re_")) {
    throw new Error("RESEND_API_KEY must be a valid Resend API key");
  }

  // Validate app URL format
  if (!requiredVars.NEXT_PUBLIC_APP_URL!.startsWith("http")) {
    throw new Error("NEXT_PUBLIC_APP_URL must be a valid URL");
  }

  // Validate database URL format
  if (!requiredVars.DATABASE_URL!.startsWith("postgresql://")) {
    throw new Error(
      "DATABASE_URL must be a valid PostgreSQL connection string",
    );
  }

  // Validate Turnstile keys (basic format check) - only in production
  if (isProduction && requiredVars.TURNSTILE_SECRET_KEY!.length < 10) {
    throw new Error("TURNSTILE_SECRET_KEY appears to be invalid");
  }
  if (
    isProduction &&
    requiredVars.NEXT_PUBLIC_TURNSTILE_SITE_KEY!.length < 10
  ) {
    throw new Error("NEXT_PUBLIC_TURNSTILE_SITE_KEY appears to be invalid");
  }

  return {
    appUrl: requiredVars.NEXT_PUBLIC_APP_URL!,
    nodeEnv: process.env.NODE_ENV || "development",
    jwtSecret: requiredVars.JWT_SECRET!,
    turnstileSecretKey: requiredVars.TURNSTILE_SECRET_KEY || "",
    turnstileSiteKey: requiredVars.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
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
