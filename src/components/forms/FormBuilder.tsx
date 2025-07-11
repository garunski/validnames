"use client";

import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { Button } from "@/primitives/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { processFormError } from "./FormErrorProcessor";
import { FormField, type FormField as FormFieldType } from "./FormField";
import { hasValidationErrors, validateAllFields } from "./FormValidation";

export interface FormConfig {
  fields: FormFieldType[];
  submitText: string;
  loadingText: string;
  endpoint: string;
  method?: "POST" | "PUT" | "PATCH";
  invalidateQueries?: string[];
  containerClassName?: string;
  layout?: "horizontal" | "vertical";
}

interface FormBuilderProps {
  config: FormConfig;
  onSuccess: (data?: unknown, formValues?: Record<string, string>) => void;
  onCancel?: () => void;
  additionalData?: Record<string, unknown>;
  initialValues?: Record<string, string>;
  onGeneralError?: (error: string | null) => void;
}

export function FormBuilder({
  config,
  onSuccess,
  onCancel,
  additionalData = {},
  initialValues = {},
  onGeneralError,
}: FormBuilderProps) {
  const [formData, setFormData] =
    useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const queryClient = useQueryClient();

  // Update form data when initialValues change (e.g., after successful save)
  useEffect(() => {
    // Only update if values are actually different (shallow compare)
    const keys = Object.keys(initialValues || {});
    const isDifferent = keys.some(
      (key) => formData[key] !== initialValues[key],
    );
    if (isDifferent) {
      setFormData(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  // Fetch CSRF token on mount
  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        const res = await fetch("/api/auth/csrfToken");
        const data = await res.json();
        if (data.csrfToken) setCsrfToken(data.csrfToken);
      } catch {
        // Optionally handle error
      }
    }
    fetchCsrfToken();
  }, []);

  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetchWithAuth(config.endpoint, {
        method: config.method || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...additionalData, csrfToken }),
      });

      if (response.error) {
        throw response;
      }

      return response.data;
    },
    onSuccess: (data) => {
      if (config.invalidateQueries) {
        config.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }
      resetForm();
      onSuccess(data, formData); // Pass both API response and formData
      if (onGeneralError) onGeneralError(null);
    },
    onError: async (error: unknown) => {
      const { fieldErrors, generalError: errorMessage } =
        processFormError(error);
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      setGeneralError(errorMessage);
      if (onGeneralError) onGeneralError(errorMessage);
    },
  });

  const handleBlur = (field: FormFieldType) => {
    const value = formData[field.name] || "";
    const error = field.validate ? field.validate(value, formData) : undefined;
    setErrors((prev) => ({ ...prev, [field.name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateAllFields(config.fields, formData);
    setErrors(newErrors);

    if (hasValidationErrors(newErrors)) return;
    mutation.mutate(formData);
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    setGeneralError(null);
  };

  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
    setGeneralError(null);
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  const isLoading = mutation.isPending;
  const isHorizontal = config.layout === "horizontal";

  // Disable submit if loading or any required field is empty
  const isAnyRequiredFieldEmpty = config.fields.some(
    (field) =>
      field.required &&
      (!formData[field.name] || formData[field.name].trim() === ""),
  );
  const isSubmitDisabled = isLoading || isAnyRequiredFieldEmpty;

  return (
    <div className={`rounded-lg p-6 ${config.containerClassName || ""}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Only show generalError here if onGeneralError is not provided */}
        {!onGeneralError && generalError && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
            {generalError}
          </div>
        )}

        <div className={isHorizontal ? "flex gap-4" : "flex flex-col gap-4"}>
          {config.fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name] || ""}
              error={errors[field.name]}
              isLoading={isLoading}
              onChange={(value) => handleInputChange(field.name, value)}
              onBlur={() => handleBlur(field)}
              layout={config.layout}
            />
          ))}
        </div>

        <div className="flex justify-center gap-2">
          <Button type="submit" disabled={isSubmitDisabled}>
            {isLoading ? config.loadingText : config.submitText}
          </Button>
          {onCancel && (
            <Button onClick={handleCancel} plain disabled={isLoading}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
