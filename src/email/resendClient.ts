import { Resend } from "resend";

// Lazy initialization to avoid errors during build when env vars might not be set
let resendInstance: Resend | null = null;
let cachedApiKey: string | undefined = undefined;

export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  
  // Re-initialize if API key changed or instance doesn't exist
  if (!resendInstance || cachedApiKey !== apiKey) {
    // Use dummy key only during build when env var is not available
    const keyToUse = apiKey || "dummy-key-for-build";
    resendInstance = new Resend(keyToUse);
    cachedApiKey = apiKey;
  }
  
  return resendInstance;
}

// Export getter function for lazy access
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    return getResend()[prop as keyof Resend];
  },
});
