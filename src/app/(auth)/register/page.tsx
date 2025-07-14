"use client";

import { FormBuilder } from "@/components/forms/FormBuilder";
import { PasswordStrengthIndicator } from "@/components/forms/PasswordStrengthIndicator";
import { createTurnstileValidator } from "@/components/forms/turnstileValidation";
import { Link } from "@/primitives/link";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const config = {
    fields: [
      {
        name: "name",
        type: "text" as const,
        placeholder: "Enter your full name",
        required: true,
        validate: (value: string) => {
          if (!value.trim()) return "Name is required";
          return undefined;
        },
      },
      {
        name: "email",
        type: "email" as const,
        placeholder: "Enter your email",
        required: true,
        validate: (value: string) => {
          if (!value.trim()) return "Email is required";
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
            return "Invalid email address";
          return undefined;
        },
      },
      {
        name: "password",
        type: "password" as const,
        placeholder: "Create a password (min 8 characters)",
        required: true,
        validate: (value: string) => {
          if (!value.trim()) return "Password is required";
          if (value.length < 8) return "Password must be at least 8 characters";
          return undefined;
        },
        onChange: (value: string) => setPassword(value),
      },
      {
        name: "confirmPassword",
        type: "password" as const,
        placeholder: "Confirm your password",
        required: true,
        validate: (value: string, allValues?: Record<string, string>) => {
          if (!value.trim()) return "Please confirm your password";
          if (allValues && value !== allValues["password"])
            return "Passwords do not match";
          return undefined;
        },
      },
      {
        name: "turnstileToken",
        type: "turnstile" as const,
        placeholder: "",
        required: true,
        siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
        validate: createTurnstileValidator(),
      },
    ],
    submitText: "Create account",
    loadingText: "Creating account...",
    endpoint: "/api/auth/register",
    method: "POST" as const,
    layout: "vertical" as const,
  };

  const handleSuccess = () => {
    router.push(
      "/login?message=Registration successful! Please check your email and verify your account before signing in.",
    );
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative rounded-2xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg transition-transform hover:scale-105">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
          </Link>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Join Valid Names
          </h1>
          <p className="text-sm text-gray-600">
            Create your account to get started
          </p>
        </div>
        <FormBuilder config={config} onSuccess={handleSuccess} />
        <div className="my-4">
          <PasswordStrengthIndicator password={password} />
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-purple-600 transition-colors duration-200 hover:text-purple-700"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
