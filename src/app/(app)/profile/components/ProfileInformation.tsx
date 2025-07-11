"use client";

import { AppUser } from "@/app/api/auth/authTypes";
import { FormBuilder, type FormConfig } from "@/components/forms/FormBuilder";
import { type FormField } from "@/components/forms/FormField";
import { Heading } from "@/primitives/heading";

interface ProfileInformationProps {
  user: AppUser;
  alwaysEditable?: boolean;
}

export function ProfileInformation({ user }: ProfileInformationProps) {
  const formConfig: FormConfig = {
    fields: [
      {
        name: "name",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
        validate: (value: string) => {
          if (!value.trim()) return "Name is required";
          if (value.trim().length > 100)
            return "Name must be less than 100 characters";
          return undefined;
        },
      },
      {
        name: "email",
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email address",
        required: true,
        validate: (value: string) => {
          if (!value.trim()) return "Email is required";
          const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
          if (!emailRegex.test(value))
            return "Please enter a valid email address";
          if (value.length > 255)
            return "Email must be less than 255 characters";
          return undefined;
        },
      },
    ] as FormField[],
    submitText: "Save Changes",
    loadingText: "Saving...",
    endpoint: "/api/user/profile",
    method: "PUT",
    invalidateQueries: ["user"],
    containerClassName: "",
    layout: "vertical",
  };

  const handleSuccess = () => {
    // Form will automatically reset to initial values after successful submission
  };

  return (
    <div className="p-6">
      <Heading level={2} className="mb-6 text-lg font-semibold">
        Personal Information
      </Heading>
      <FormBuilder
        config={formConfig}
        onSuccess={handleSuccess}
        initialValues={{
          name: user?.name || "",
          email: user?.email || "",
        }}
      />
    </div>
  );
}
