import { validateEnvironment } from "../operations/environmentValidationOperations";

/**
 * Validates all required environment variables on application startup.
 * This function should be called early in the application lifecycle.
 * @throws Error if any required environment variables are missing or invalid
 */
export function validateStartupEnvironment(): void {
  try {
    validateEnvironment();
    console.log("✅ Environment validation passed");
  } catch (error) {
    console.error("❌ Environment validation failed:", error);
    throw error;
  }
}

/**
 * Validates environment variables and returns a status object.
 * This is useful for health checks and monitoring.
 * @returns Object with validation status and any errors
 */
export function getEnvironmentStatus(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    validateEnvironment();
  } catch (error) {
    errors.push(
      error instanceof Error ? error.message : "Unknown validation error",
    );
  }

  // Additional warnings for development environment
  if (process.env.NODE_ENV === "development") {
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 64) {
      warnings.push(
        "JWT_SECRET is shorter than recommended for production (64+ characters)",
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
