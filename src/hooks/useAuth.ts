import { AppUser } from "@/app/api/auth/authTypes";
import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch user with React Query
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetchWithAuth("/api/user");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (error) {
      router.push("/login");
    }
  }, [error, router]);

  const user: AppUser | null = data?.user || null;

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetchWithAuth("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });

  const handleSignOut = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return { user, loading, handleSignOut };
}
