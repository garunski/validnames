"use client";

import { FormBuilder } from "@/components/forms/FormBuilder";

interface AddDomainFormProps {
  categoryId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddDomainForm({
  categoryId,
  onSuccess,
  onCancel,
}: AddDomainFormProps) {
  const config = {
    fields: [
      {
        name: "name",
        type: "text" as const,
        placeholder: "Domain name (without TLD)",
        required: true,
        className: "flex-1",
        validate: (value: string) => {
          if (!value.trim()) return "Domain name is required";
          if (value.length > 100)
            return "Domain name must be at most 100 characters";
          if (/\s/.test(value)) return "No spaces allowed";
          if (value.includes(".")) return "Do not include TLD (e.g. .com)";
          if (value !== value.toLowerCase())
            return "Use only lowercase letters";
          return undefined;
        },
      },
    ],
    submitText: "Add Domain",
    loadingText: "Adding...",
    endpoint: "/api/domains",
    invalidateQueries: ["domains", "categories"],
    containerClassName:
      "border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
    layout: "horizontal" as const,
  };

  return (
    <FormBuilder
      config={config}
      onSuccess={onSuccess}
      onCancel={onCancel}
      additionalData={{ categoryId }}
    />
  );
}
