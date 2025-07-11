"use client";

import { Input } from "@/primitives/input";
import { Textarea } from "@/primitives/textarea";

export interface FormField {
  name: string;
  type: "text" | "email" | "password" | "number" | "textarea";
  placeholder: string;
  required?: boolean;
  className?: string;
  rows?: number;
  validate?: (value: string) => string | undefined;
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

  const renderInput = () => {
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
      {renderInput()}
      {error && (
        <div className="mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
