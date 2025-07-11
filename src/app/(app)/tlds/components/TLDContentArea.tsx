"use client";

import { TLDWithSelection } from "@/app/api/tlds/tld-operations/tldTypes";
import { Button } from "@/primitives/button";
import { TLDCategoryGroup } from "./TLDCategoryGroup";

interface TLDContentAreaProps {
  loadingCategory: boolean;
  categoryError: string | null;
  selectedCategory: string;
  shownCategoryGroups: [string, TLDWithSelection[]][];
  selectedTlds: string[];
  isLoading: boolean;
  categoryCounts: Record<
    string,
    { total: number; selected: number; hidden: number }
  >;
  onRefetch: () => void;
  onTldToggle: (tldExtension: string) => void;
}

export function TLDContentArea({
  loadingCategory,
  categoryError,
  selectedCategory,
  shownCategoryGroups,
  selectedTlds,
  isLoading,
  categoryCounts,
  onRefetch,
  onTldToggle,
}: TLDContentAreaProps) {
  return (
    <div className="space-y-8">
      {loadingCategory && selectedCategory !== "All" && (
        <div className="py-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <div className="mt-4 text-zinc-500 dark:text-zinc-400">
            Loading TLDs...
          </div>
        </div>
      )}
      {categoryError && selectedCategory !== "All" && (
        <div className="py-8 text-center">
          <div className="text-lg font-medium text-red-600">
            {categoryError}
          </div>
          <Button onClick={onRefetch} className="mt-4" color="zinc">
            Try Again
          </Button>
        </div>
      )}
      {!loadingCategory &&
        !categoryError &&
        shownCategoryGroups.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">
              No TLDs found matching your search criteria.
            </p>
          </div>
        )}
      {!loadingCategory &&
        !categoryError &&
        shownCategoryGroups.map(([category, categoryTlds]) => (
          <TLDCategoryGroup
            key={category}
            category={category}
            tlds={categoryTlds}
            selectedTlds={selectedTlds}
            isLoading={isLoading}
            categoryCounts={categoryCounts}
            onSelectAll={() => {}}
            onSelectNone={() => {}}
            onTldToggle={onTldToggle}
          />
        ))}
    </div>
  );
}
