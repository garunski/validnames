/**
 * Reusable Turnstile validation function that bypasses validation in development
 * when no site key is configured.
 */
export function createTurnstileValidator() {
  return (value: string) => {
    // Skip validation in development if no site key is configured
    const isDevelopment = process.env.NODE_ENV === "development";
    const hasSiteKey =
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY !== "";

    if (isDevelopment && !hasSiteKey) {
      return undefined; // Skip validation in development
    }

    if (!value.trim()) return "Please complete the security check";
    return undefined;
  };
}
