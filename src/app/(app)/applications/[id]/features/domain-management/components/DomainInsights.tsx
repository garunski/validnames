import type { Check } from "@prisma/client";

interface DomainInsightsProps {
  check: Check;
}

export function DomainInsights({ check }: DomainInsightsProps) {
  if (
    check.isAvailable !== false ||
    (!check.domainAge && !check.trustScore && !check.registrar)
  ) {
    return null;
  }

  return (
    <div className="mb-3 space-y-2">
      {(check.domainAge !== null || check.trustScore !== null) && (
        <div className="flex gap-2">
          {check.domainAge !== null && (
            <div className="flex items-center gap-1 rounded-md border border-blue-200 bg-white/70 px-2 py-1 dark:border-blue-800 dark:bg-zinc-800/70">
              <span className="text-xs text-blue-600 dark:text-blue-400">
                📅
              </span>
              <span className="text-xs font-medium">{check.domainAge}y</span>
            </div>
          )}
          {check.trustScore !== null && (
            <div className="flex items-center gap-1 rounded-md border border-amber-200 bg-white/70 px-2 py-1 dark:border-amber-800 dark:bg-zinc-800/70">
              <span className="text-xs text-amber-600 dark:text-amber-400">
                ⭐
              </span>
              <span className="text-xs font-medium">{check.trustScore}/10</span>
            </div>
          )}
        </div>
      )}
      {check.registrar && (
        <div className="flex items-center gap-1 rounded-md border border-purple-200 bg-white/70 px-2 py-1 dark:border-purple-800 dark:bg-zinc-800/70">
          <span className="text-xs text-purple-600 dark:text-purple-400">
            🏢
          </span>
          <span className="truncate text-xs text-zinc-600 dark:text-zinc-400">
            {check.registrar}
          </span>
        </div>
      )}
    </div>
  );
}
