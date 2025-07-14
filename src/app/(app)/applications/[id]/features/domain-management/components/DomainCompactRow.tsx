"use client";

import type { DomainWithRelations } from "@/app/api/applications/applicationTypes";
import { Button } from "@/primitives/button";
import { ArrowPathIcon, HeartIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useDomainFavoriting } from "../hooks/useDomainFavoriting";

interface DomainCompactRowProps {
  domain: DomainWithRelations;
  selectedTlds: string[];
  onRefreshDomain?: (domainId: string) => void;
  onDeleteClick: (domain: DomainWithRelations) => void;
  onFavoriteMessage?: (message: string, type: "success" | "error") => void;
}

export function DomainCompactRow({
  domain,
  selectedTlds,
  onRefreshDomain,
  onDeleteClick,
  onFavoriteMessage,
}: DomainCompactRowProps) {
  const { addToFavorites, isFavoriting } =
    useDomainFavoriting(onFavoriteMessage);
  const getStatusIcon = (isAvailable: boolean | null) => {
    if (isAvailable === true) return "✅";
    if (isAvailable === false) return "❌";
    return "❓";
  };

  const formatTLDResults = (checks: DomainWithRelations["checks"]) => {
    const results: { [key: string]: boolean | null } = {};
    checks.forEach((check) => {
      results[check.tld.extension] = check.isAvailable;
    });
    return results;
  };

  const formatLastChecked = (checkedAt: Date | string | null) => {
    if (!checkedAt) return "Never";

    const checkDate =
      typeof checkedAt === "string" ? new Date(checkedAt) : checkedAt;
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - checkDate.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Now";
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return checkDate.toLocaleDateString();
  };

  const tldResults = formatTLDResults(domain.checks);
  const lastCheck =
    domain.checks.length > 0
      ? domain.checks.sort(
          (a, b) =>
            new Date(b.checkedAt || 0).getTime() -
            new Date(a.checkedAt || 0).getTime(),
        )[0]
      : null;

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

  return (
    <div className="grid grid-cols-12 items-center gap-2 px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      {/* Domain Name */}
      <div className="col-span-3">
        <div className="truncate font-medium text-zinc-900 dark:text-zinc-100">
          {domain.name}
        </div>
      </div>

      {/* TLD Results */}
      <div className="col-span-7">
        <div className="flex flex-wrap gap-1">
          {selectedTlds.slice(0, 8).map((tld) => (
            <span
              key={tld}
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium ${
                tldResults[tld] === true
                  ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : tldResults[tld] === false
                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                    : "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400"
              }`}
              title={`.${tld} - ${tldResults[tld] === true ? "Available" : tldResults[tld] === false ? "Unavailable" : "Unknown"}`}
            >
              <span className="text-xs">{getStatusIcon(tldResults[tld])}</span>
              <span className="text-xs">{tld}</span>
            </span>
          ))}
          {selectedTlds.length > 8 && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              +{selectedTlds.length - 8}
            </span>
          )}
        </div>
      </div>

      {/* Last Check */}
      <div className="col-span-1 text-center">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {lastCheck ? formatLastChecked(lastCheck.checkedAt) : "Never"}
        </span>
      </div>

      {/* Action */}
      <div className="col-span-1 text-center">
        <div className="flex items-center justify-center gap-1">
          {onRefreshDomain && (
            <Button
              onClick={() => onRefreshDomain(domain.id)}
              plain
              className="p-1 text-xs"
              title="Refresh checks"
            >
              <ArrowPathIcon className="size-3" />
            </Button>
          )}
          {/* Favorite Button - Always show since we're adding a copy */}
          <Button
            onClick={handleFavoriteClick}
            disabled={isFavoriting}
            plain
            className="!hover:text-pink-700 !hover:bg-pink-50 !dark:text-pink-400 !dark:hover:text-pink-300 !dark:hover:bg-pink-950/20 p-1 text-xs !text-pink-600"
            title="Add to favorites"
          >
            <HeartIcon className="!dark:text-pink-400 size-3 !text-pink-600" />
          </Button>
          <Button
            onClick={() => onDeleteClick(domain)}
            plain
            className="!hover:text-red-700 !hover:bg-red-50 !dark:text-red-400 !dark:hover:text-red-300 !dark:hover:bg-red-950/20 p-1 text-xs !text-red-600"
            title="Delete domain"
          >
            <TrashIcon className="!dark:text-red-400 size-3 !text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
