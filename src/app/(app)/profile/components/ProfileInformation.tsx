"use client";

import { AppUser } from "@/app/api/auth/authTypes";
import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { Button } from "@/primitives/button";
import { Heading } from "@/primitives/heading";
import { Input } from "@/primitives/input";
import { Text } from "@/primitives/text";
import { CheckIcon } from "@heroicons/react/16/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface ProfileInformationProps {
  user: AppUser;
  queryClient: ReturnType<typeof useQueryClient>;
  alwaysEditable?: boolean;
}

export function ProfileInformation({
  user,
  queryClient,
}: ProfileInformationProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      const response = await fetchWithAuth("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setErrors({});
    },
    onError: (error: unknown) => {
      const errorData = error as {
        errors?: Array<{ field: string; message: string }>;
      };
      if (errorData.errors) {
        const fieldErrors: Record<string, string> = {};
        errorData.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      }
    },
  });

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="p-6">
      <Heading level={2} className="mb-6 text-lg font-semibold">
        Personal Information
      </Heading>
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Full Name
          </label>
          <div className="space-y-2">
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your full name"
              className={
                errors.name ? "border-red-300 focus:border-red-500" : ""
              }
            />
            {errors.name && (
              <Text className="text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </Text>
            )}
          </div>
        </div>
        {/* Email Field */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email Address
          </label>
          <div className="space-y-2">
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email address"
              className={
                errors.email ? "border-red-300 focus:border-red-500" : ""
              }
            />
            {errors.email && (
              <Text className="text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </Text>
            )}
          </div>
        </div>
        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="flex items-center gap-2"
          >
            <CheckIcon className="size-4" />
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
