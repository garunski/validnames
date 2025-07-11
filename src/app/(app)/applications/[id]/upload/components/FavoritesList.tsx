"use client";

import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { Button } from "@/primitives/button";
import {
  CheckIcon,
  HeartIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";

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

  if (!favoriteCategory || favoriteDomains.length === 0) {
    return null;
  }

  const handleAddDomain = (domainName: string) => {
    const currentValue = currentInputValue || "";
    const domains = currentValue
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d);

    if (domains.includes(domainName)) {
      // Domain already exists, remove it
      const newDomains = domains.filter((d) => d !== domainName);
      onAddToInput(newDomains.join(", "));
    } else {
      // Add new domain
      const newDomains = [...domains, domainName];
      onAddToInput(newDomains.join(", "));
    }

    onSelectVariationsPrompt?.();
  };

  const isDomainSelected = (domainName: string) => {
    const currentValue = currentInputValue || "";
    const domains = currentValue
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d);
    return domains.includes(domainName);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center gap-2">
        <HeartIcon className="h-4 w-4 text-pink-600 dark:text-pink-400" />
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Favorite Domains ({favoriteDomains.length})
        </h3>
      </div>

      <div className="mb-2 text-xs text-zinc-600 dark:text-zinc-400">
        Click to add/remove domains from your prompt
      </div>

      <div className="space-y-2">
        {favoriteDomains.map((domain: FavoriteDomain) => {
          const isSelected = isDomainSelected(domain.name);
          return (
            <div
              key={domain.id}
              className={`flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 transition-colors ${
                isSelected
                  ? "border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20"
                  : "border-zinc-100 bg-zinc-50 hover:border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
              }`}
              onClick={() => handleAddDomain(domain.name)}
            >
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {domain.name}
              </span>
              <div className="flex items-center gap-1">
                {isSelected ? (
                  <div className="group flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded transition-colors">
                      {/* Checkmark: visible unless hovered */}
                      <span className="flex items-center group-hover:hidden">
                        <CheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </span>
                      {/* Red X: only visible on hover */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddDomain(domain.name);
                        }}
                        className="hidden h-8 w-8 cursor-pointer items-center justify-center rounded bg-red-50 text-red-600 group-hover:flex hover:bg-red-100 hover:text-red-700 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                        title="Remove from input"
                        tabIndex={0}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleAddDomain(domain.name);
                    }}
                    plain
                    className="!hover:text-blue-700 !hover:bg-blue-50 flex h-8 w-8 items-center justify-center text-xs !text-zinc-600 dark:text-zinc-400 dark:hover:bg-blue-950/20 dark:hover:text-blue-400"
                    title="Add to input"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
