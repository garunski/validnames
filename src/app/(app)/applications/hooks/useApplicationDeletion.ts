import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useApplicationDeletion() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteApplicationMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      const response = await fetchWithAuth(
        `/api/applications/${applicationId}`,
        {
          method: "DELETE",
        },
      );

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      // Redirect to applications list
      router.push("/applications");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to delete application");
      }
    },
  });

  const deleteApplication = async (applicationId: string) => {
    await deleteApplicationMutation.mutateAsync(applicationId);
  };

  return {
    deleteApplication,
    isDeleting: deleteApplicationMutation.isPending,
  };
}
