"use client";

import { Button } from "@/primitives/button";
import { Dialog } from "@/primitives/dialog";
import type { Category } from "@prisma/client";

interface CategoryDeleteDialogProps {
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  selectedCategory: Category;
  domainCount: number;
  isDeleting: boolean;
  onDeleteConfirm: () => void;
}

export function CategoryDeleteDialog({
  showDeleteDialog,
  setShowDeleteDialog,
  selectedCategory,
  domainCount,
  isDeleting,
  onDeleteConfirm,
}: CategoryDeleteDialogProps) {
  return (
    <Dialog
      open={showDeleteDialog}
      onClose={setShowDeleteDialog}
      className="sm:max-w-md"
    >
      <div className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Delete Category
        </h3>
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          Are you sure you want to delete the category{" "}
          <strong>&ldquo;{selectedCategory.name}&rdquo;</strong>? This action
          will permanently delete:
        </p>
        <ul className="mb-6 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          <li>• The category itself</li>
          <li>• All {domainCount} domains in this category</li>
          <li>• All availability check results for these domains</li>
        </ul>
        <p className="mb-6 text-sm font-medium text-red-600 dark:text-red-400">
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => setShowDeleteDialog(false)}
            outline
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button onClick={onDeleteConfirm} color="red" disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Category"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
