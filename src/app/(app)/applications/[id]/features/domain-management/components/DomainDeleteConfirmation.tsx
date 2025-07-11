"use client";

import { Button } from "@/primitives/button";
import { Dialog } from "@/primitives/dialog";
import { TrashIcon } from "@heroicons/react/20/solid";

interface DomainDeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  domainName: string;
  isDeleting: boolean;
}

export function DomainDeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  domainName,
  isDeleting,
}: DomainDeleteConfirmationProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <TrashIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Delete Domain
          </h3>
        </div>

        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Are you sure you want to delete the domain{" "}
          <strong>&ldquo;{domainName}&rdquo;</strong>?
        </p>

        <div className="mb-6 space-y-2">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This action will permanently delete:
          </p>
          <ul className="ml-4 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <li>• The domain itself</li>
            <li>• All availability check results for this domain</li>
            <li>• All associated TLD checking data</li>
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
            {isDeleting ? "Deleting..." : "Delete Domain"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
