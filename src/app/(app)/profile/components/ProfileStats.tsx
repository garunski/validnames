"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProfileStats, type ProfileStatsData } from "./ProfileStatsData";
import { ProfileStatsDisplay } from "./ProfileStatsDisplay";

interface ProfileStatsProps {
  hideActivityAndTips?: boolean;
}

export function ProfileStats({ hideActivityAndTips }: ProfileStatsProps) {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<ProfileStatsData>({
    queryKey: ["profile-stats"],
    queryFn: fetchProfileStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Statistics
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="mb-2 h-4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
              <div className="h-8 rounded bg-zinc-200 dark:bg-zinc-700"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Statistics
        </h2>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30">
          <p className="text-red-600 dark:text-red-400">
            Failed to load statistics. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Statistics
      </h2>
      <ProfileStatsDisplay
        stats={stats}
        hideActivityAndTips={hideActivityAndTips}
      />
    </div>
  );
}
