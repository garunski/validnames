"use client";

import { Input } from "@/primitives/input";
import { Textarea } from "@/primitives/textarea";
import { useEffect } from "react";
import { TurnstileField } from "./TurnstileField";

export interface FormField {
  name: string;
  type: "text" | "email" | "password" | "number" | "textarea" | "turnstile";
  placeholder: string;
  label?: string;
  required?: boolean;
  className?: string;
  rows?: number;
  siteKey?: string; // For turnstile fields
  validate?: (
    value: string,
    allValues?: Record<string, string>,
  ) => string | undefined;
}

interface FormFieldProps {
  field: FormField;
  value: string;
  error?: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  layout?: "horizontal" | "vertical";
}

export function FormField({
  field,
  value,
  error,
  isLoading,
  onChange,
  onBlur,
  layout = "vertical",
}: FormFieldProps) {
  const isHorizontal = layout === "horizontal";
  const containerClass = isHorizontal ? "flex-1" : "";
  const inputClass = field.className || (isHorizontal ? "flex-1" : "");

  // Handle development bypass for Turnstile fields
  useEffect(() => {
    if (field.type === "turnstile") {
      const isDevelopment = process.env.NODE_ENV === "development";
      const hasSiteKey = field.siteKey && field.siteKey !== "";

      if (isDevelopment && !hasSiteKey && value !== "development-bypass") {
        onChange("development-bypass");
      }
    }
  }, [field.type, field.siteKey, value, onChange]);

  const renderInput = () => {
    if (field.type === "turnstile") {
      // Skip Turnstile in development if no site key is configured
      const isDevelopment = process.env.NODE_ENV === "development";
      const hasSiteKey = field.siteKey && field.siteKey !== "";

      if (isDevelopment && !hasSiteKey) {
        // In development without site key, render a hidden input with a dummy value
        return (
          <input
            type="hidden"
            value="development-bypass"
            onChange={() => onChange("development-bypass")}
          />
        );
      }

      return (
        <TurnstileField
          siteKey={field.siteKey || ""}
          onVerify={(token) => onChange(token)}
          onExpire={() => onChange("")}
          onError={() => onChange("")}
          disabled={isLoading}
          className={inputClass}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={field.placeholder}
          disabled={isLoading}
          className={inputClass}
          rows={field.rows || 3}
          aria-invalid={!!error}
        />
      );
    }

    return (
      <Input
        type={field.type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={field.placeholder}
        disabled={isLoading}
        className={inputClass}
        aria-invalid={!!error}
      />
    );
  };

  return (
    <div className={containerClass}>
      {field.label && (
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {field.label}
          {field.required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <div className="mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
