"use client";

import {
  HIDDEN_CATEGORIES,
  HiddenCategory,
  TLD_CATEGORIES,
  TLDCategory,
  TLDWithSelection,
} from "@/app/api/tlds/tld-operations/tldTypes";
import { fetchWithAuth } from "@/hooks/fetchWithAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TLDCategoryTabs } from "./TLDCategoryTabs";
import { TLDContentArea } from "./TLDContentArea";
import { TLDSearchBar } from "./TLDSearchBar";
import { useTLDSelector } from "./useTLDSelector";

interface TLDSelectorProps {
  tlds: TLDWithSelection[];
  initialSelectedCount: number;
}

export default function TLDSelector({ tlds: initialTlds }: TLDSelectorProps) {
  const {
    selectedTlds,
    searchTerm,
    selectedCategory,
    isLoading,
    groupedTlds,
    categoryCounts,
    setSearchTerm,
    setSelectedCategory,
    handleTldToggle,
  } = useTLDSelector({ tlds: initialTlds });

  const [categoryError, setCategoryError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Always show all categories as tabs
  const visibleCategories = TLD_CATEGORIES;

  // React Query: fetch TLDs for a category
  const {
    data: categoryTlds,
    isFetching: loadingCategory,
    refetch: refetchCategoryTlds,
  } = useQuery({
    queryKey: ["tlds", selectedCategory],
    queryFn: async () => {
      if (selectedCategory === "All") return [];
      try {
        const response = await fetchWithAuth(
          `/api/tlds?category=${encodeURIComponent(selectedCategory)}`,
        );
        return Array.isArray(response.data?.tlds) ? response.data.tlds : [];
      } catch {
        setCategoryError("Failed to load category. Please try again.");
        return [];
      }
    },
    enabled: HIDDEN_CATEGORIES.includes(selectedCategory as HiddenCategory),
    staleTime: 5 * 60 * 1000,
  });

  // Only show TLDs for the selected category (including hidden ones if selected)
  let shownCategoryGroups = Object.entries({
    ...groupedTlds,
    ...(categoryTlds && selectedCategory !== "All"
      ? { [selectedCategory]: categoryTlds }
      : {}),
  }).filter(
    ([category]) => selectedCategory === "All" || category === selectedCategory,
  );

  // Sort category groups to match the tab order
  shownCategoryGroups = shownCategoryGroups.sort(
    ([a], [b]) =>
      TLD_CATEGORIES.indexOf(a as TLDCategory) -
      TLD_CATEGORIES.indexOf(b as TLDCategory),
  );

  // Tab click handler
  function handleCategoryTabClick(
    category: (typeof TLD_CATEGORIES)[number] | "All",
  ) {
    setCategoryError(null);
    setSelectedCategory(category);
    if (HIDDEN_CATEGORIES.includes(category as HiddenCategory)) {
      queryClient.invalidateQueries({ queryKey: ["tlds", category] });
    }
  }

  return (
    <div className="space-y-8">
      <TLDSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <TLDCategoryTabs
        visibleCategories={visibleCategories}
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryTabClick}
      />

      <TLDContentArea
        loadingCategory={loadingCategory}
        categoryError={categoryError}
        selectedCategory={selectedCategory}
        shownCategoryGroups={shownCategoryGroups}
        selectedTlds={selectedTlds}
        isLoading={isLoading}
        categoryCounts={categoryCounts}
        onRefetch={refetchCategoryTlds}
        onTldToggle={handleTldToggle}
      />
    </div>
  );
}
