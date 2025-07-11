"use client";

interface DomainHeaderProps {
  domainName: string;
  categoryName: string;
  lastChecked: Date | null;
  availabilityPercentage: number;
  statusColor: string;
  totalChecks: number;
  avgTrustScore: number | null;
  avgAge: number | null;
}

export function DomainHeader({
  domainName,
  categoryName,
  lastChecked,
  availabilityPercentage,
  statusColor,
  totalChecks,
  avgTrustScore,
  avgAge,
}: DomainHeaderProps) {
  return (
    <div className="flex-1">
      <div className="mb-2 flex items-center gap-3">
        <h3 className="font-mono text-xl font-bold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
          {domainName}
        </h3>
        {totalChecks > 0 && (
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              statusColor === "green"
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                : statusColor === "amber"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  : statusColor === "red"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {availabilityPercentage}% available
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <span className="text-purple-500">📁</span>
          {categoryName}
        </span>
        {lastChecked && (
          <span className="flex items-center gap-1">
            <span className="text-blue-500">🕒</span>
            {lastChecked.toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Domain insights */}
      {(avgTrustScore !== null || avgAge !== null) && (
        <div className="mt-3 flex gap-4">
          {avgAge !== null && (
            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white/50 px-3 py-1 dark:border-blue-800 dark:bg-zinc-800/50">
              <span className="text-blue-600 dark:text-blue-400">📅</span>
              <span className="text-sm font-medium">
                Avg: {avgAge.toFixed(1)}y
              </span>
            </div>
          )}
          {avgTrustScore !== null && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-white/50 px-3 py-1 dark:border-amber-800 dark:bg-zinc-800/50">
              <span className="text-amber-600 dark:text-amber-400">⭐</span>
              <span className="text-sm font-medium">
                Avg: {avgTrustScore.toFixed(1)}/10
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
