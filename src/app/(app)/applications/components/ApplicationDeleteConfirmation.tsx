"use client";

import { Button } from "@/primitives/button";
import { Dialog } from "@/primitives/dialog";
import { TrashIcon } from "@heroicons/react/20/solid";

interface ApplicationDeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  applicationName: string;
  isDeleting: boolean;
}

export function ApplicationDeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  applicationName,
  isDeleting,
}: ApplicationDeleteConfirmationProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <TrashIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Delete Application
          </h3>
        </div>

        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Are you sure you want to delete the application{" "}
          <strong>&ldquo;{applicationName}&rdquo;</strong>?
        </p>

        <div className="mb-6 space-y-2">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This action will permanently delete:
          </p>
          <ul className="ml-4 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <li>• The application itself</li>
            <li>• All categories in this application</li>
            <li>• All domains in all categories</li>
            <li>• All availability check results</li>
            <li>• All TLD checking data</li>
          </ul>
        </div>

        <p className="mb-6 text-sm font-medium text-red-600 dark:text-red-400">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} outline disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={onConfirm} color="red" disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Application"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
