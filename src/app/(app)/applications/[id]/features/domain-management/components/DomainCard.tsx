"use client";

import { useDomainStats } from "@/app/(app)/applications/[id]/features/domain-management/hooks/useDomainStats";
import type { DomainWithRelations } from "@/app/api/applications/applicationTypes";
import { Button } from "@/primitives/button";
import { ArrowPathIcon, HeartIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useDomainDeletion } from "../hooks/useDomainDeletion";
import { useDomainFavoriting } from "../hooks/useDomainFavoriting";
import { DomainDeleteConfirmation } from "./DomainDeleteConfirmation";
import { DomainHeader } from "./DomainHeader";
import { DomainStatsDisplay } from "./DomainStatsDisplay";
import { DomainTLDResults } from "./DomainTLDResults";

export function DomainCard({
  domain,
  selectedTlds,
  onRefreshDomain,
  onFavoriteMessage,
}: {
  domain: DomainWithRelations;
  selectedTlds: string[];
  onRefreshDomain?: (domainId: string) => void;
  onFavoriteMessage?: (message: string, type: "success" | "error") => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteDomain, isDeleting } = useDomainDeletion();
  const { addToFavorites, isFavoriting } =
    useDomainFavoriting(onFavoriteMessage);

  const {
    domainStats,
    lastChecked,
    insights,
    availabilityPercentage,
    statusColor,
  } = useDomainStats(domain);

  const handleRefresh = async () => {
    if (!onRefreshDomain || selectedTlds.length === 0) return;
    try {
      await onRefreshDomain(domain.id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to refresh domain");
      }
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteDomain(domain.id);
    setShowDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleFavoriteClick = async () => {
    try {
      await addToFavorites(domain.id);
      // The message will be handled by the hook and passed to the callback
    } catch (error: unknown) {
      if (error instanceof Error) {
        onFavoriteMessage?.(error.message, "error");
      } else {
        onFavoriteMessage?.("Failed to add domain to favorites", "error");
      }
    }
  };

  // We can always show the favorite button since we're adding a copy, not moving
  // The API will handle checking if it already exists in favorites

  if (!domain || !selectedTlds) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-4 flex items-start justify-between">
          <DomainHeader
            domainName={domain.name}
            categoryName={domain.category.name}
            lastChecked={lastChecked}
            availabilityPercentage={availabilityPercentage}
            statusColor={statusColor}
            totalChecks={domainStats.total}
            avgTrustScore={insights.avgTrustScore}
            avgAge={insights.avgAge}
          />

          <div className="flex items-center gap-2">
            {onRefreshDomain && (
              <Button
                onClick={handleRefresh}
                disabled={selectedTlds.length === 0}
                outline
                className="text-xs"
                title="Refresh domain checks"
                aria-label="Refresh"
              >
                <ArrowPathIcon className="size-3" />
                Refresh
              </Button>
            )}
            {/* Favorite Button - Always show since we're adding a copy */}
            <Button
              onClick={handleFavoriteClick}
              disabled={isFavoriting}
              outline
              className="!border-pink-500 text-xs !text-pink-600 hover:border-pink-600 hover:bg-pink-50 dark:border-pink-400 dark:text-pink-400 dark:hover:bg-pink-950/20"
              title="Add to favorites"
              aria-label="Favorite"
            >
              <HeartIcon className="!dark:text-pink-400 mr-1 size-4 !text-pink-600" />
              Favorite
            </Button>
            {/* Delete Button - Outlined Red, Text DELETE */}
            <Button
              onClick={handleDeleteClick}
              outline
              className="!border-red-500 text-xs !text-red-600 hover:border-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950/20"
              title="Delete domain"
              aria-label="Delete"
            >
              <TrashIcon className="!dark:text-red-400 mr-1 size-4 !text-red-600" />
              Delete
            </Button>
            <DomainStatsDisplay
              domainStats={domainStats}
              statusColor={statusColor}
              availabilityPercentage={availabilityPercentage}
            />
          </div>
        </div>

        {/* TLD Results Section */}
        {(domain.checks.length > 0 || selectedTlds.length > 0) && (
          <DomainTLDResults domain={domain} selectedTlds={selectedTlds} />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DomainDeleteConfirmation
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        domainName={domain.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}
