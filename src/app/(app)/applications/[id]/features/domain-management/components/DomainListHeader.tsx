import { Bars3Icon, Squares2X2Icon } from "@heroicons/react/24/outline";
import type { Check, Domain, TLD } from "@prisma/client";

type DomainWithChecks = Domain & {
  checks: (Check & {
    tld: TLD;
  })[];
};

interface DomainListHeaderProps {
  allDomains: DomainWithChecks[];
  domains: DomainWithChecks[];
  totalChecks: number;
  totalAvailable: number;
  totalUnavailable: number;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: "name" | "availability" | "recent";
  setSortBy: (sort: "name" | "availability" | "recent") => void;
  statusFilter: "available" | "unavailable" | "unknown" | null;
  setStatusFilter: (
    filter: "available" | "unavailable" | "unknown" | null,
  ) => void;
}

export function DomainListHeader({
  allDomains,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  statusFilter,
  setStatusFilter,
}: DomainListHeaderProps) {
  // Count unknown from allDomains
  const totalUnknown = allDomains.filter((domain) => {
    const checks = domain.checks || [];
    return (
      checks.length === 0 || checks.every((c: Check) => c.isAvailable === null)
    );
  }).length;

  const availableCount = allDomains.filter(
    (domain) =>
      domain.checks && domain.checks.some((c: Check) => c.isAvailable === true),
  ).length;
  const unavailableCount = allDomains.filter(
    (domain) =>
      domain.checks &&
      domain.checks.length > 0 &&
      domain.checks.every((c: Check) => c.isAvailable === false),
  ).length;

  // Add a fallback for setStatusFilter to avoid TypeError
  const safeSetStatusFilter =
    typeof setStatusFilter === "function" ? setStatusFilter : () => {};

  return (
    <div className="my-3 flex w-full items-center gap-3 overflow-x-auto text-sm">
      {/* Sort Dropdown */}
      <select
        value={sortBy}
        onChange={(e) =>
          setSortBy(e.target.value as "name" | "availability" | "recent")
        }
        className="min-w-[120px] rounded border border-zinc-200 bg-transparent px-3 py-2 text-zinc-600 focus:border-blue-400 focus:outline-none"
      >
        <option value="name">Sort by Name</option>
        <option value="availability">Sort by Availability</option>
        <option value="recent">Sort by Recent</option>
      </select>

      {/* Filter Pills */}
      <button
        onClick={() =>
          safeSetStatusFilter(statusFilter === "available" ? null : "available")
        }
        className={`flex !cursor-pointer items-center gap-1 rounded px-3 py-2 font-medium transition-colors ${
          statusFilter === "available"
            ? "bg-green-100 text-green-700"
            : "text-zinc-500 hover:text-green-600"
        }`}
      >
        ✅ {availableCount}
      </button>
      <button
        onClick={() =>
          safeSetStatusFilter(
            statusFilter === "unavailable" ? null : "unavailable",
          )
        }
        className={`flex !cursor-pointer items-center gap-1 rounded px-3 py-2 font-medium transition-colors ${
          statusFilter === "unavailable"
            ? "bg-red-100 text-red-700"
            : "text-zinc-500 hover:text-red-600"
        }`}
      >
        ❌ {unavailableCount}
      </button>
      <button
        onClick={() =>
          safeSetStatusFilter(statusFilter === "unknown" ? null : "unknown")
        }
        className={`flex !cursor-pointer items-center gap-1 rounded px-3 py-2 font-medium transition-colors ${
          statusFilter === "unknown"
            ? "bg-amber-100 text-amber-700"
            : "text-zinc-500 hover:text-amber-600"
        }`}
      >
        ❓ {totalUnknown}
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* View Toggle */}
      <button
        onClick={() => setViewMode("list")}
        className={`!cursor-pointer rounded p-2 transition-colors ${
          viewMode === "list"
            ? "bg-blue-100 text-blue-700"
            : "text-zinc-500 hover:text-blue-600"
        }`}
        aria-label="List view"
      >
        <Bars3Icon className="h-5 w-5" />
      </button>
      <button
        onClick={() => setViewMode("grid")}
        className={`!cursor-pointer rounded p-2 transition-colors ${
          viewMode === "grid"
            ? "bg-blue-100 text-blue-700"
            : "text-zinc-500 hover:text-blue-600"
        }`}
        aria-label="Grid view"
      >
        <Squares2X2Icon className="h-5 w-5" />
      </button>
    </div>
  );
}
