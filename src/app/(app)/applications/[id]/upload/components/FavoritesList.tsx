"use client";

import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { HeartIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import { useDomainSelection } from "../hooks/useDomainSelection";
import { FavoriteDomainItem } from "./FavoriteDomainItem";

interface FavoritesListProps {
  applicationId: string;
  onAddToInput: (domainName: string) => void;
  onSelectVariationsPrompt?: () => void;
  currentInputValue?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  applicationId: string;
  createdAt: string;
  updatedAt: string;
}

interface FavoriteDomain {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
}

export function FavoritesList({
  applicationId,
  onAddToInput,
  onSelectVariationsPrompt,
  currentInputValue,
}: FavoritesListProps) {
  // Fetch categories to find the Favorite category
  const { data: categories = [] } = useQuery({
    queryKey: ["categories", applicationId],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `/api/categories?applicationId=${applicationId}`,
      );
      return response.data;
    },
    enabled: !!applicationId,
  });

  // Find the Favorite category
  const favoriteCategory = categories.find(
    (cat: Category) => cat.name === "Favorite",
  );

  // Fetch domains from the Favorite category
  const { data: favoriteDomains = [], isLoading } = useQuery({
    queryKey: ["domains", favoriteCategory?.id],
    queryFn: async () => {
      if (!favoriteCategory) return [];
      const response = await fetchWithAuth(
        `/api/domains?categoryId=${favoriteCategory.id}`,
      );
      return response.data;
    },
    enabled: !!favoriteCategory,
  });

  const { handleAddDomain, isDomainSelected } = useDomainSelection({
    currentInputValue,
    onAddToInput,
    onSelectVariationsPrompt,
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"></div>
          Loading favorites...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[420px] rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center gap-2">
        <HeartIcon className="h-4 w-4 text-pink-600 dark:text-pink-400" />
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Favorite Domains{" "}
          {favoriteDomains.length > 0 && `(${favoriteDomains.length})`}
        </h3>
      </div>

      {!favoriteCategory || favoriteDomains.length === 0 ? (
        <div className="py-6 text-center">
          <HeartIcon className="mx-auto mb-3 h-8 w-8 text-zinc-300 dark:text-zinc-600" />
          <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
            No favorite domains yet
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            Add domains to your favorites from the domain management page to see
            them here
          </p>
        </div>
      ) : (
        <>
          <div className="mb-2 text-xs text-zinc-600 dark:text-zinc-400">
            Click to add/remove domains from your prompt
          </div>

          <div className="space-y-2">
            {favoriteDomains.map((domain: FavoriteDomain) => (
              <FavoriteDomainItem
                key={domain.id}
                domain={domain}
                isSelected={isDomainSelected(domain.name)}
                onToggle={() => handleAddDomain(domain.name)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
