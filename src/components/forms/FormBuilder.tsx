"use client";

import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { Button } from "@/primitives/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
  onSuccess: (data?: unknown) => void;
  onCancel?: () => void;
  additionalData?: Record<string, unknown>;
}

export function FormBuilder({
  config,
  onSuccess,
  onCancel,
  additionalData = {},
}: FormBuilderProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetchWithAuth(config.endpoint, {
        method: config.method || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...additionalData }),
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
      setFormData({});
      setErrors({});
      setGeneralError(null);
      onSuccess(data);
    },
    onError: async (error: unknown) => {
      const { fieldErrors, generalError: errorMessage } =
        processFormError(error);
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      setGeneralError(errorMessage);
    },
  });

  const handleBlur = (field: FormFieldType) => {
    const value = formData[field.name] || "";
    const error = field.validate ? field.validate(value) : undefined;
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

  const isLoading = mutation.isPending;
  const isHorizontal = config.layout === "horizontal";

  return (
    <div className={`rounded-lg p-6 ${config.containerClassName || ""}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {generalError && (
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? config.loadingText : config.submitText}
          </Button>
          {onCancel && (
            <Button onClick={onCancel} plain disabled={isLoading}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
