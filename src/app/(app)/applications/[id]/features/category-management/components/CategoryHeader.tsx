"use client";

import { Button } from "@/primitives/button";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import type { Application, Category } from "@prisma/client";

interface CategoryHeaderProps {
  selectedCategory: Category & { application: Application };
  hasSelectedTlds: boolean;
  domainCount: number;
  showAddDomainForm: boolean;
  onToggleAddDomainForm: () => void;
  onCheckDomains: () => void;
  onDeleteCategory: () => void;
}

export function CategoryHeader({
  selectedCategory,
  hasSelectedTlds,
  domainCount,
  showAddDomainForm,
  onToggleAddDomainForm,
  onCheckDomains,
  onDeleteCategory,
}: CategoryHeaderProps) {
  return (
    <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {selectedCategory.name}
            </h3>
            {selectedCategory.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {selectedCategory.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={onToggleAddDomainForm} outline>
            <PlusIcon className="size-4" />
            {showAddDomainForm ? "Cancel" : "Add Domain"}
          </Button>

          <Button
            onClick={onCheckDomains}
            disabled={!hasSelectedTlds || domainCount === 0}
            color="blue"
          >
            <MagnifyingGlassIcon
              className="size-4 !text-white"
              data-slot="icon"
            />
            Check Domains
          </Button>

          <Button
            onClick={onDeleteCategory}
            outline
            className="!border-red-500 !text-red-600 hover:border-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            <TrashIcon className="size-4 !text-red-600" />
            Delete Category
          </Button>
        </div>
      </div>

      {!hasSelectedTlds && (
        <div className="mt-3 rounded-md bg-amber-50 p-3 dark:bg-amber-900/20">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Select TLDs above to check domain availability
          </p>
        </div>
      )}
    </div>
  );
}
