interface TurnstileValidationResponse {
  success: boolean;
  errorCodes?: string[];
}

export async function validateTurnstileToken(
  token: string,
  remoteIp?: string,
): Promise<TurnstileValidationResponse> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Development bypass: if no secret key is configured in development, auto-pass
  if (process.env.NODE_ENV === "development" && !secretKey) {
    console.log("Turnstile validation bypassed in development mode");
    return { success: true };
  }

  if (!secretKey) {
    console.error("TURNSTILE_SECRET_KEY not configured in production");
    return { success: false, errorCodes: ["missing_secret_key"] };
  }

  if (!token) {
    console.error("Turnstile token is missing");
    return { success: false, errorCodes: ["missing_input_token"] };
  }

  // Development bypass: if token is the development bypass value, auto-pass
  if (
    process.env.NODE_ENV === "development" &&
    token === "development-bypass"
  ) {
    console.log("Turnstile validation bypassed with development token");
    return { success: true };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    console.log("Making Turnstile validation request:", {
      hasSecret: !!secretKey,
      hasToken: !!token,
      remoteIp,
      environment: process.env.NODE_ENV,
    });

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      },
    );

    if (!response.ok) {
      console.error("Turnstile validation request failed:", {
        status: response.status,
        statusText: response.statusText,
        environment: process.env.NODE_ENV,
      });
      return { success: false, errorCodes: ["request_failed"] };
    }

    const result = await response.json();

    console.log("Turnstile validation response:", {
      success: result.success,
      errorCodes: result["error-codes"],
      environment: process.env.NODE_ENV,
    });

    if (!result.success) {
      console.error("Turnstile validation failed:", {
        errorCodes: result["error-codes"],
        environment: process.env.NODE_ENV,
      });
      return {
        success: false,
        errorCodes: result["error-codes"] || ["validation_failed"],
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Turnstile validation error:", {
      error: error instanceof Error ? error.message : String(error),
      environment: process.env.NODE_ENV,
    });
    return { success: false, errorCodes: ["network_error"] };
  }
}

export function getTurnstileErrorMessage(errorCodes: string[]): string {
  const errorMessages: Record<string, string> = {
    "missing-input-secret": "Turnstile secret key is missing",
    "invalid-input-secret": "Turnstile secret key is invalid",
    "missing-input-response": "Turnstile response token is missing",
    "invalid-input-response": "Turnstile response token is invalid",
    "bad-request": "Invalid request to Turnstile",
    "timeout-or-duplicate": "Turnstile token expired or already used",
    "internal-error": "Turnstile internal error",
    missing_secret_key: "Turnstile not properly configured",
    missing_input_token: "Please complete the security check",
    request_failed: "Security check request failed",
    validation_failed: "Security check failed",
    network_error: "Network error during security check",
  };

  const firstError = errorCodes[0];
  return errorMessages[firstError] || "Security check failed";
}
