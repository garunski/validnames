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
    return { success: true };
  }

  if (!secretKey) {
    return { success: false, errorCodes: ["missing_secret_key"] };
  }

  if (!token) {
    return { success: false, errorCodes: ["missing_input_token"] };
  }

  // Development bypass: if token is the development bypass value, auto-pass
  if (
    process.env.NODE_ENV === "development" &&
    token === "development-bypass"
  ) {
    return { success: true };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

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
      return { success: false, errorCodes: ["request_failed"] };
    }

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        errorCodes: result["error-codes"] || ["validation_failed"],
      };
    }

    return { success: true };
  } catch {
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
