"use client";

import { TLDCategory } from "@/app/api/tlds/tld-operations/tldTypes";
import clsx from "clsx";

interface TLDCategoryTabsProps {
  visibleCategories: readonly TLDCategory[];
  selectedCategory: string;
  onCategoryClick: (category: TLDCategory | "All") => void;
}

export function TLDCategoryTabs({
  visibleCategories,
  selectedCategory,
  onCategoryClick,
}: TLDCategoryTabsProps) {
  return (
    <div className="overflow-x-auto border-b border-zinc-200 dark:border-zinc-700">
      <div className="flex min-w-max">
        <button
          onClick={() => onCategoryClick("All")}
          className={clsx(
            "flex !cursor-pointer items-center gap-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors",
            selectedCategory === "All"
              ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
              : "border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200",
          )}
        >
          All
        </button>
        {visibleCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryClick(category)}
            className={clsx(
              "flex !cursor-pointer items-center gap-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors",
              selectedCategory === category
                ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                : "border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200",
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
