"use client";

import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";

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
  const deletionItems = [
    "The domain itself",
    "All availability check results for this domain",
    "All associated TLD checking data",
  ];

  return (
    <DeleteConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      itemName={domainName}
      itemType="Domain"
      isDeleting={isDeleting}
      deletionItems={deletionItems}
      confirmButtonText="Delete Domain"
    />
  );
}
