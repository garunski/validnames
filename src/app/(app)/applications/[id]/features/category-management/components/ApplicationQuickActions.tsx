"use client";

import { Button } from "@/primitives/button";
import {
  ClockIcon,
  CloudArrowUpIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";

interface ApplicationQuickActionsProps {
  applicationId: string;
  onAddCategory?: () => void;
  lastCheckTime: Date | null;
}

export function ApplicationQuickActions({
  applicationId,
  onAddCategory,
  lastCheckTime,
}: ApplicationQuickActionsProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Quick Actions
      </h3>

      <div className="space-y-3">
        <Button
          href={`/applications/${applicationId}/upload`}
          color="blue"
          className="w-full justify-center"
        >
          <CloudArrowUpIcon className="size-4 !text-white" />
          Upload Domains
        </Button>

        <Button
          outline
          className="w-full justify-center"
          onClick={onAddCategory}
        >
          <PlusIcon className="size-4" />
          Add Category
        </Button>
      </div>

      {lastCheckTime && (
        <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <ClockIcon className="size-3" />
            <span>Last checked {lastCheckTime.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
