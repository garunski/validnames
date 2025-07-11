"use client";

import { useState } from "react";
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
  const [, setIsLoaded] = useState(false);

  const handleVerify = (token: string) => {
    if (!disabled) {
      onVerify(token);
    }
  };

  const handleExpire = () => {
    if (onExpire) {
      onExpire();
    }
  };

  const handleError = () => {
    if (onError) {
      onError();
    }
  };

  return (
    <div className={`relative flex justify-center ${className}`}>
      <Turnstile
        sitekey={siteKey}
        onVerify={handleVerify}
        onExpire={handleExpire}
        onError={handleError}
        onLoad={() => setIsLoaded(true)}
        theme="light"
        size="normal"
      />
      {disabled && (
        <div className="absolute inset-0 z-10 cursor-not-allowed bg-white/60" />
      )}
    </div>
  );
}
