"use client";

import { useDomainSorting } from "@/app/(app)/applications/[id]/features/domain-management/hooks/useDomainSorting";
import type { DomainWithRelations } from "@/app/api/applications/applicationTypes";
import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import { DomainCard } from "./DomainCard";
import { DomainCompactView } from "./DomainCompactView";
import { DomainListEmpty } from "./DomainListEmpty";
import { DomainListHeader } from "./DomainListHeader";

interface DomainListProps {
  domains: DomainWithRelations[];
  selectedTlds: string[];
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
  sortBy: "name" | "availability" | "recent";
  setSortBy: (sort: "name" | "availability" | "recent") => void;
  onAddDomain: () => void;
  onRefreshDomain?: (domainId: string) => void;
  statusFilter: "available" | "unavailable" | "unknown" | null;
  setStatusFilter: (
    filter: "available" | "unavailable" | "unknown" | null,
  ) => void;
  onFavoriteMessage?: (message: string, type: "success" | "error") => void;
}

export function DomainList({
  domains,
  selectedTlds,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  onAddDomain,
  onRefreshDomain,
  statusFilter,
  setStatusFilter,
  onFavoriteMessage,
}: DomainListProps) {
  const { totalChecks, totalAvailable, totalUnavailable } = useDomainSorting(
    domains,
    sortBy,
  );

  // Filter domains by statusFilter
  const filteredDomains = statusFilter
    ? domains.filter((domain) => {
        if (!domain.checks || domain.checks.length === 0)
          return statusFilter === "unknown";
        if (statusFilter === "available") {
          return domain.checks.some((c) => c.isAvailable === true);
        }
        if (statusFilter === "unavailable") {
          return (
            domain.checks.length > 0 &&
            domain.checks.every((c) => c.isAvailable === false)
          );
        }
        if (statusFilter === "unknown") {
          return (
            domain.checks.length === 0 ||
            domain.checks.every((c) => c.isAvailable === null)
          );
        }
        return true;
      })
    : domains;

  const isFiltered = statusFilter !== null;
  const hasOtherDomains = domains.length > filteredDomains.length;

  return (
    <FeatureErrorBoundary>
      <div className="space-y-6">
        <DomainListHeader
          allDomains={domains}
          domains={filteredDomains}
          totalChecks={totalChecks}
          totalAvailable={totalAvailable}
          totalUnavailable={totalUnavailable}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {filteredDomains.length === 0 ? (
          <DomainListEmpty
            onAddDomain={onAddDomain}
            filtered={isFiltered}
            hasOtherDomains={hasOtherDomains}
          />
        ) : viewMode === "list" ? (
          <DomainCompactView
            domains={filteredDomains}
            selectedTlds={selectedTlds}
            onRefreshDomain={onRefreshDomain}
            onFavoriteMessage={onFavoriteMessage}
          />
        ) : (
          <div className="space-y-6">
            {filteredDomains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                selectedTlds={selectedTlds}
                onRefreshDomain={onRefreshDomain}
                onFavoriteMessage={onFavoriteMessage}
              />
            ))}
          </div>
        )}
      </div>
    </FeatureErrorBoundary>
  );
}
