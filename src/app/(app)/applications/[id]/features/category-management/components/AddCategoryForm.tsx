"use client";

import { FormBuilder } from "@/components/forms/FormBuilder";

interface AddCategoryFormProps {
  applicationId: string;
  onSuccess: (category?: unknown) => void;
  onCancel: () => void;
}

export function AddCategoryForm({
  applicationId,
  onSuccess,
  onCancel,
}: AddCategoryFormProps) {
  const config = {
    fields: [
      {
        name: "name",
        type: "text" as const,
        placeholder: "Category name",
        required: true,
        validate: (value: string) => {
          if (!value.trim()) return "Name is required";
          if (value.length > 100) return "Name must be at most 100 characters";
          return undefined;
        },
      },
      {
        name: "description",
        type: "text" as const,
        placeholder: "Description (optional)",
        validate: (value: string) => {
          if (value && value.length > 500)
            return "Description must be at most 500 characters";
          return undefined;
        },
      },
    ],
    submitText: "Create Category",
    loadingText: "Creating...",
    endpoint: "/api/categories",
    invalidateQueries: ["categories", "application"],
  };

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50">
      <FormBuilder
        config={config}
        onSuccess={(data) => onSuccess(data)}
        onCancel={onCancel}
        additionalData={{ applicationId }}
      />
    </div>
  );
}
