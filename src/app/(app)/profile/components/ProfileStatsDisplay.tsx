"use client";

import { ProfileStatsData } from "./ProfileStatsData";

interface ProfileStatsDisplayProps {
  stats: ProfileStatsData;
}

export function ProfileStatsDisplay({ stats }: ProfileStatsDisplayProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Applications
        </h3>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {formatNumber(stats.totalApplications)}
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Categories
        </h3>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {formatNumber(stats.totalCategories)}
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Domains
        </h3>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {formatNumber(stats.totalDomains)}
        </p>
      </div>
    </div>
  );
}
