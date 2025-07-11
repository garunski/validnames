"use client";

import { ProfileStatsData } from "./ProfileStatsData";

interface ProfileStatsDisplayProps {
  stats: ProfileStatsData;
  hideActivityAndTips?: boolean;
}

export function ProfileStatsDisplay({
  stats,
  hideActivityAndTips = false,
}: ProfileStatsDisplayProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatPercentage = (num: number) => {
    return (num * 100).toFixed(1) + "%";
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return ms + "ms";
    return (ms / 1000).toFixed(2) + "s";
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Core Stats */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Applications
        </h3>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {formatNumber(stats.totalApplications)}
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Categories
        </h3>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {formatNumber(stats.totalCategories)}
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Domains
        </h3>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {formatNumber(stats.totalDomains)}
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Total Checks
        </h3>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {formatNumber(stats.totalChecks)}
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Available
        </h3>
        <p className="text-2xl font-bold text-green-600">
          {formatNumber(stats.availableDomains)}
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Unavailable
        </h3>
        <p className="text-2xl font-bold text-red-600">
          {formatNumber(stats.unavailableDomains)}
        </p>
      </div>

      {!hideActivityAndTips && (
        <>
          {/* Performance Stats */}
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Avg Checks/Domain
            </h3>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {stats.averageChecksPerDomain.toFixed(1)}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Success Rate
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {formatPercentage(stats.successRate)}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Avg Response Time
            </h3>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {formatTime(stats.averageResponseTime)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
