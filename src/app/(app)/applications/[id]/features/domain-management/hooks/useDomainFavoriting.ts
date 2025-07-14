import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useDomainFavoriting(
  onMessage?: (message: string, type: "success" | "error") => void,
) {
  const [isFavoriting, setIsFavoriting] = useState(false);
  const queryClient = useQueryClient();

  const addToFavorites = async (domainId: string) => {
    setIsFavoriting(true);
    try {
      const response = await fetchWithAuth(`/api/domains/${domainId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: "favorite" }),
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["application"] });

      // Show success message based on response
      if (response.message === "Domain already in favorites") {
        onMessage?.("Domain is already in favorites", "success");
      } else {
        onMessage?.("Domain added to favorites successfully", "success");
      }
    } catch (error) {
      console.error("Failed to add domain to favorites", error);
      onMessage?.("Failed to add domain to favorites", "error");
      throw error;
    } finally {
      setIsFavoriting(false);
    }
  };

  return {
    addToFavorites,
    isFavoriting,
  };
}
