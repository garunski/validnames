import type {
  ApplicationWithCategoriesAndTlds,
  CategoryWithRelations,
  DomainWithRelations,
} from "@/app/api/applications/applicationTypes";
import { useDomainChecking } from "@/domain/hooks/useDomainChecking";
import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useApplicationFetching } from "./useApplicationFetching";
import { useAutoDomainChecking } from "./useAutoDomainChecking";
import { useAutoDomainCheckingNotifications } from "./useAutoDomainCheckingNotifications";

export function useApplicationData(id: string): {
  application: ApplicationWithCategoriesAndTlds | null;
  categories: CategoryWithRelations[];
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
  domains: DomainWithRelations[];
  loading: boolean;
  error: unknown;
  selectedTlds: string[];
  updateSelectedTlds: (tldExtensions: string[]) => Promise<boolean>;
  fetchData: () => void;
  fetchDomains: () => Promise<void>;
  handleCheckDomains: () => void;
  handleRefreshChecks: () => void;
  handleRefreshDomain: (domainId: string) => void;
  autoCheckToasts: Array<{
    id: string;
    message: string;
    type: "info" | "success" | "error";
    isVisible: boolean;
  }>;
  handleAutoCheckToastHide: (id: string) => void;
  isAutoChecking: boolean;
} {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTlds, setSelectedTlds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const {
    application,
    categories,
    domains,
    loading,
    error,
    fetchData,
    refetchDomains,
  } = useApplicationFetching(id, selectedCategory);

  const { handleCheckDomains, handleRefreshChecks, handleRefreshDomain } =
    useDomainChecking(domains, selectedTlds, selectedCategory, () =>
      refetchDomains(),
    );

  const {
    toasts: autoCheckToasts,
    showAutoCheckStart,
    showAutoCheckComplete,
    handleToastHide: handleAutoCheckToastHide,
  } = useAutoDomainCheckingNotifications();

  // Auto domain checking when switching to categories with unknown domains
  const { isAutoChecking } = useAutoDomainChecking({
    categories,
    selectedCategory,
    selectedTlds,
    onRefreshChecks: handleRefreshChecks,
    onAutoCheckStart: showAutoCheckStart,
    onAutoCheckComplete: showAutoCheckComplete,
  });

  // React Query mutation for updating application TLD settings
  const updateTldsMutation = useMutation({
    mutationFn: async (tldExtensions: string[]) => {
      const response = await fetchWithAuth(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedTldExtensions: tldExtensions }),
      });
      return response.data;
    },
    onSuccess: (_, tldExtensions) => {
      setSelectedTlds(tldExtensions);
      // Invalidate application data to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["application", id] });
    },
    onError: (error: unknown) => {
      console.error("Error updating application TLD settings:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
    },
  });

  // Load application TLD settings when application is loaded
  useEffect(() => {
    if (application) {
      // Use selectedTldExtensions from API response
      setSelectedTlds(application.selectedTldExtensions || []);
    }
  }, [application]);

  // Always call refetchDomains with the correct category id
  const fetchDomains = async () => {
    if (!selectedCategory) return;
    try {
      await refetchDomains();
    } catch {
      console.error("Error fetching domains");
    }
  };

  // Update application-specific TLD settings using React Query
  const updateSelectedTlds = async (tldExtensions: string[]) => {
    try {
      await updateTldsMutation.mutateAsync(tldExtensions);
      return true;
    } catch {
      return false;
    }
  };

  return {
    application,
    categories,
    selectedCategory,
    setSelectedCategory,
    domains,
    loading,
    error,
    selectedTlds,
    updateSelectedTlds,
    fetchData,
    fetchDomains,
    handleCheckDomains,
    handleRefreshChecks,
    handleRefreshDomain,
    autoCheckToasts,
    handleAutoCheckToastHide,
    isAutoChecking,
  };
}
