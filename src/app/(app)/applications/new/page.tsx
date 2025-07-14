"use client";

import { FormBuilder } from "@/components/forms/FormBuilder";
import { BaseHeader } from "@/components/layout/BaseHeader";
import { Link } from "@/primitives/link";
import { FolderIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

export default function NewApplicationPage() {
  const router = useRouter();

  const config = {
    fields: [
      {
        name: "name",
        type: "text" as const,
        placeholder: "Enter application name",
        required: true,
        className: "w-full",
        validate: (value: string) => {
          if (!value.trim()) return "Name is required";
          if (value.length > 100) return "Name must be at most 100 characters";
          return undefined;
        },
      },
      {
        name: "description",
        type: "textarea" as const,
        placeholder: "Enter application description (optional)",
        required: false,
        className: "w-full",
        rows: 4,
        validate: (value: string) => {
          if (value && value.length > 500)
            return "Description must be at most 500 characters";
          return undefined;
        },
      },
    ],
    submitText: "Add Application",
    loadingText: "Adding...",
    endpoint: "/api/applications",
    method: "POST" as const,
    layout: "vertical" as const,
    invalidateQueries: ["applications"],
  };

  const handleSuccess = (data: unknown) => {
    // Redirect to the newly created application details page
    if (
      data &&
      typeof data === "object" &&
      data !== null &&
      "id" in data &&
      typeof data.id === "string"
    ) {
      router.push(`/applications/${data.id}`);
    } else {
      router.push("/applications");
    }
  };

  // Breadcrumb for Add Application
  const Breadcrumb = () => (
    <div className="mb-4 flex items-center gap-2 text-sm">
      <Link
        href="/applications"
        className="flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        Applications
      </Link>
      <span className="text-zinc-300 dark:text-zinc-600">/</span>
      <span className="font-medium text-zinc-900 dark:text-zinc-100">
        Add Application
      </span>
    </div>
  );

  // Header card using BaseHeader
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <BaseHeader
        icon={<FolderIcon className="size-5" />}
        title="Add Application"
        description="Enter a name (required) and an optional description."
      />
      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <FormBuilder
          config={config}
          onSuccess={handleSuccess}
          onCancel={() => router.push("/applications")}
        />
      </div>
    </div>
  );
}
