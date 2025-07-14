"use client";

import { Badge } from "@/primitives/badge";

interface DomainStatsDisplayProps {
  domainStats: {
    available: number;
    unavailable: number;
    unknown: number;
    total: number;
  };
  statusColor: string;
  availabilityPercentage: number;
}

export function DomainStatsDisplay({
  domainStats,
  statusColor,
  availabilityPercentage,
}: DomainStatsDisplayProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      {domainStats.total > 0 ? (
        <div className="flex gap-2">
          {domainStats.available > 0 && (
            <div className="flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-green-700 dark:bg-green-900/40 dark:text-green-300">
              <span className="text-lg">✅</span>
              <span className="font-bold">{domainStats.available}</span>
            </div>
          )}
          {domainStats.unavailable > 0 && (
            <div className="flex items-center gap-1 rounded-lg bg-red-100 px-2 py-1 text-red-700 dark:bg-red-900/40 dark:text-red-300">
              <span className="text-lg">❌</span>
              <span className="font-bold">{domainStats.unavailable}</span>
            </div>
          )}
          {domainStats.unknown > 0 && (
            <div className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <span className="text-lg">❓</span>
              <span className="font-bold">{domainStats.unknown}</span>
            </div>
          )}
        </div>
      ) : (
        <Badge color="zinc" className="text-xs">
          Unchecked
        </Badge>
      )}

      {/* Availability progress bar */}
      {domainStats.total > 0 && (
        <div className="h-2 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className={`h-full transition-all duration-500 ${
              statusColor === "green"
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : statusColor === "amber"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gradient-to-r from-red-500 to-rose-500"
            }`}
            style={{ width: `${availabilityPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
