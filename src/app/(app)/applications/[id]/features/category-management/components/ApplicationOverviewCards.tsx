"use client";

import type { CategoryWithRelations } from "@/app/api/applications/applicationTypes";
import { Badge } from "@/primitives/badge";

interface ApplicationOverviewCardsProps {
  availabilityRate: number;
  totalChecks: number;
  categories: CategoryWithRelations[];
}

export function ApplicationOverviewCards({
  availabilityRate,
  totalChecks,
  categories,
}: ApplicationOverviewCardsProps) {
  return (
    <>
      {/* Availability Summary */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Availability Summary
          </h3>
          <Badge
            color={
              availabilityRate >= 50
                ? "green"
                : availabilityRate >= 25
                  ? "amber"
                  : "red"
            }
          >
            {availabilityRate}% Available
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">
              Total Checks
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {totalChecks.toLocaleString()}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className="h-2 rounded-full bg-green-500 transition-all duration-300"
              style={{ width: `${availabilityRate}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Categories
          </h3>
          <Badge color="blue">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </Badge>
        </div>

        <div className="space-y-2">
          {categories.slice(0, 3).map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="truncate text-zinc-600 dark:text-zinc-400">
                {category.name}
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {category.domains?.length || 0} domains
              </span>
            </div>
          ))}

          {categories.length > 3 && (
            <div className="pt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
              +{categories.length - 3} more categories
            </div>
          )}
        </div>
      </div>
    </>
  );
}
