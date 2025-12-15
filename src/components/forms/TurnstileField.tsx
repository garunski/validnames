"use client";

import { useCallback } from "react";
import Turnstile from "react-turnstile";

export interface TurnstileFieldProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
  disabled?: boolean;
}

export function TurnstileField({
  siteKey,
  onVerify,
  onExpire,
  onError,
  className = "",
  disabled = false,
}: TurnstileFieldProps) {
  const handleVerify = useCallback(
    (token: string) => {
      if (!disabled) {
        onVerify(token);
      }
    },
    [disabled, onVerify],
  );

  const handleExpire = useCallback(() => {
    if (onExpire) {
      onExpire();
    }
  }, [onExpire]);

  const handleError = useCallback(() => {
    if (onError) {
      onError();
    }
  }, [onError]);

  const handleLoad = useCallback(() => {
    // Widget loaded successfully
  }, []);

  return (
    <div className={`relative flex justify-center ${className}`}>
      <Turnstile
        sitekey={siteKey}
        onVerify={handleVerify}
        onExpire={handleExpire}
        onError={handleError}
        onLoad={handleLoad}
        theme="light"
        size="normal"
      />
      {disabled && (
        <div className="absolute inset-0 z-10 cursor-not-allowed bg-white/60" />
      )}
    </div>
  );
}
