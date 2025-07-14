import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDomainDeletion() {
  const queryClient = useQueryClient();

  const deleteDomainMutation = useMutation({
    mutationFn: async (domainId: string) => {
      const response = await fetchWithAuth(`/api/domains/${domainId}`, {
        method: "DELETE",
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["application"] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to delete domain");
      }
    },
  });

  const deleteDomain = async (domainId: string) => {
    await deleteDomainMutation.mutateAsync(domainId);
  };

  return {
    deleteDomain,
    isDeleting: deleteDomainMutation.isPending,
  };
}
