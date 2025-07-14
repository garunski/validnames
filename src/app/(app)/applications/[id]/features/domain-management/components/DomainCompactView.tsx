"use client";

import type { DomainWithRelations } from "@/app/api/applications/applicationTypes";
import { useState } from "react";
import { useDomainDeletion } from "../hooks/useDomainDeletion";
import { DomainCompactRow } from "./DomainCompactRow";
import { DomainDeleteConfirmation } from "./DomainDeleteConfirmation";

interface DomainCompactViewProps {
  domains: DomainWithRelations[];
  selectedTlds: string[];
  onRefreshDomain?: (domainId: string) => void;
  onFavoriteMessage?: (message: string, type: "success" | "error") => void;
}

export function DomainCompactView({
  domains,
  selectedTlds,
  onRefreshDomain,
  onFavoriteMessage,
}: DomainCompactViewProps) {
  const [deleteDialogDomain, setDeleteDialogDomain] =
    useState<DomainWithRelations | null>(null);
  const { deleteDomain, isDeleting } = useDomainDeletion();

  const handleDeleteClick = (domain: DomainWithRelations) => {
    setDeleteDialogDomain(domain);
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialogDomain) {
      await deleteDomain(deleteDialogDomain.id);
      setDeleteDialogDomain(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogDomain(null);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <div className="col-span-3">Domain</div>
          <div className="col-span-7">TLD Results</div>
          <div className="col-span-1 text-center">Last Check</div>
          <div className="col-span-1 text-center">Action</div>
        </div>
      </div>

      {/* Domain Rows */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {domains.map((domain) => (
          <DomainCompactRow
            key={domain.id}
            domain={domain}
            selectedTlds={selectedTlds}
            onRefreshDomain={onRefreshDomain}
            onDeleteClick={handleDeleteClick}
            onFavoriteMessage={onFavoriteMessage}
          />
        ))}
      </div>

      {/* Footer Summary */}
      <div className="border-t border-zinc-200 px-4 py-2 dark:border-zinc-700">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Showing {domains.length} domains</span>
          <span>
            {domains.reduce(
              (sum, d) =>
                sum + d.checks.filter((c) => c.isAvailable === true).length,
              0,
            )}{" "}
            available •
            {domains.reduce(
              (sum, d) =>
                sum + d.checks.filter((c) => c.isAvailable === false).length,
              0,
            )}{" "}
            unavailable
          </span>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogDomain && (
        <DomainDeleteConfirmation
          isOpen={!!deleteDialogDomain}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          domainName={deleteDialogDomain.name}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
