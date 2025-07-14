import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import type { Domain } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";

export function useDomainChecking(
  domains: Domain[],
  selectedTldExtensions: string[],
  selectedCategory: string | null,
  onRefreshDomains: () => void,
) {
  const queryClient = useQueryClient();

  // Function for starting domain checks (no loading state)
  const startDomainCheck = async (request: {
    domainIds?: string[];
    categoryId?: string;
    domainId?: string;
    tldExtensions: string[];
  }) => {
    const endpoint =
      request.domainId || request.categoryId
        ? "/api/checks/refresh"
        : "/api/checks";

    try {
      await fetchWithAuth(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      // Refetch domains after check is completed
      queryClient.invalidateQueries({
        queryKey: ["domains", selectedCategory],
      });
      onRefreshDomains();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to start domain check");
      }
    }
  };

  const handleCheckDomains = async () => {
    if (selectedTldExtensions.length === 0 || domains.length === 0) {
      alert(
        selectedTldExtensions.length === 0
          ? "Please select TLDs first"
          : "No domains to check",
      );
      return;
    }
    await startDomainCheck({
      domainIds: domains.map((d) => d.id),
      tldExtensions: selectedTldExtensions,
    });
  };

  const handleRefreshChecks = async () => {
    if (selectedTldExtensions.length === 0 || !selectedCategory) {
      alert("Please select TLDs first");
      return;
    }
    await startDomainCheck({
      categoryId: selectedCategory,
      tldExtensions: selectedTldExtensions,
    });
  };

  const handleRefreshDomain = async (domainId: string) => {
    if (selectedTldExtensions.length === 0) {
      alert("Please select TLDs first");
      return;
    }
    await startDomainCheck({
      domainId: domainId,
      tldExtensions: selectedTldExtensions,
    });
  };

  return {
    handleCheckDomains,
    handleRefreshChecks,
    handleRefreshDomain,
  };
}
