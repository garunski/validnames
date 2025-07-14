import { useState } from "react";

export function useDeleteAccountState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  return {
    formData,
    setFormData,
    isLoading,
    error,
    setError,
    setIsLoading,
  };
}
