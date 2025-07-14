"use client";

import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";

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
  const deletionItems = [
    "The application itself",
    "All categories in this application",
    "All domains in all categories",
    "All availability check results",
    "All TLD checking data",
  ];

  return (
    <DeleteConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      itemName={applicationName}
      itemType="Application"
      isDeleting={isDeleting}
      deletionItems={deletionItems}
      confirmButtonText="Delete Application"
    />
  );
}
