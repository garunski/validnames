"use client";

import type { CategoryWithRelations } from "@/app/api/applications/applicationTypes";
import { Badge } from "@/primitives/badge";
import { Button } from "@/primitives/button";
import { Subheading } from "@/primitives/heading";
import { PlusIcon } from "@heroicons/react/20/solid";

import { AddCategoryForm } from "./AddCategoryForm";

interface CategoryNavigationProps {
  categories: CategoryWithRelations[];
  selectedCategory: string | null;
  showNewCategoryForm: boolean;
  showOverview: boolean;
  onCategorySelect: (categoryId: string) => void;
  onShowOverview: () => void;
  onToggleNewCategoryForm: () => void;
  onCategoryAdded: (category?: unknown) => void;
  applicationId: string;
}

export function CategoryNavigation({
  categories,
  selectedCategory,
  showNewCategoryForm,
  showOverview,
  onCategorySelect,
  onShowOverview,
  onToggleNewCategoryForm,
  onCategoryAdded,
  applicationId,
}: CategoryNavigationProps) {
  // Sort categories to ensure Favorite comes after Overview
  const sortedCategories = [...categories].sort((a, b) => {
    // If one is Favorite, it should come first (after Overview)
    if (a.name === "Favorite" && b.name !== "Favorite") return -1;
    if (b.name === "Favorite" && a.name !== "Favorite") return 1;
    // Otherwise, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="px-0">
        <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Subheading>Categories</Subheading>
          <Button
            onClick={onToggleNewCategoryForm}
            outline
            className="shrink-0"
          >
            <PlusIcon className="size-4" />
            {showNewCategoryForm ? "Cancel" : "Add Category"}
          </Button>
        </div>
        <div className="border-b border-zinc-200 dark:border-zinc-700" />

        {showNewCategoryForm && (
          <div className="p-6">
            <AddCategoryForm
              applicationId={applicationId}
              onSuccess={(category) => onCategoryAdded(category)}
              onCancel={onToggleNewCategoryForm}
            />
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-700">
          {/* Overview Tab */}
          {categories.length > 0 && (
            <button
              onClick={onShowOverview}
              className={`flex !cursor-pointer items-center gap-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                showOverview
                  ? "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                  : "border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <span className="text-base">📊</span>
              <span>Overview</span>
            </button>
          )}
          {/* Category Tabs */}
          {sortedCategories.map((category) => {
            const isSelected = selectedCategory === category.id;
            const domainCount = category.domains?.length || 0;
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`flex !cursor-pointer items-center gap-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    : "border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                <span>{category.name}</span>
                <Badge color={isSelected ? "blue" : "zinc"}>
                  {domainCount}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
