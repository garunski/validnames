"use client";

import type {
  ApplicationWithCategoriesAndTlds,
  CategoryWithRelations,
} from "@/app/api/applications/applicationTypes";
import {
  ChartBarIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { ApplicationOverviewCards } from "./ApplicationOverviewCards";
import { ApplicationQuickActions } from "./ApplicationQuickActions";
import { ApplicationStatsCards } from "./ApplicationStatsCards";

interface ApplicationOverviewProps {
  application: ApplicationWithCategoriesAndTlds;
  categories: CategoryWithRelations[];
  totalDomains: number;
  totalChecks: number;
  availableCount: number;
  unavailableCount: number;
  unknownCount: number;
  lastCheckTime: Date | null;
  applicationId: string;
  onAddCategory?: () => void;
}

export function ApplicationOverview({
  categories,
  totalDomains,
  totalChecks,
  availableCount,
  unavailableCount,
  unknownCount,
  lastCheckTime,
  applicationId,
  onAddCategory,
}: ApplicationOverviewProps) {
  const availabilityRate =
    totalChecks > 0 ? Math.round((availableCount / totalChecks) * 100) : 0;

  const stats = [
    {
      label: "Total Domains",
      value: totalDomains,
      icon: ChartBarIcon,
      color: "blue",
    },
    {
      label: "Available",
      value: availableCount,
      icon: CheckCircleIcon,
      color: "green",
    },
    {
      label: "Unavailable",
      value: unavailableCount,
      icon: XCircleIcon,
      color: "red",
    },
    {
      label: "Unknown",
      value: unknownCount,
      icon: QuestionMarkCircleIcon,
      color: "amber",
    },
  ];

  return (
    <div className="space-y-6 rounded-b-lg border-x border-b border-zinc-200 p-6 dark:border-zinc-800">
      <ApplicationStatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ApplicationOverviewCards
          availabilityRate={availabilityRate}
          totalChecks={totalChecks}
          categories={categories}
        />

        <ApplicationQuickActions
          applicationId={applicationId}
          onAddCategory={onAddCategory}
          lastCheckTime={lastCheckTime}
        />
      </div>
    </div>
  );
}
