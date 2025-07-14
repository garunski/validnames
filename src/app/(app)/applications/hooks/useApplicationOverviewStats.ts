"use client";

import type { CategoryWithRelations } from "@/app/api/applications/applicationTypes";
import { useMemo } from "react";

interface OverviewStats {
  totalDomains: number;
  totalChecks: number;
  availableCount: number;
  unavailableCount: number;
  unknownCount: number;
  lastCheckTime: Date | null;
}

export function useApplicationOverviewStats(
  categories: CategoryWithRelations[],
): OverviewStats {
  return useMemo(() => {
    let totalDomains = 0;
    let totalChecks = 0;
    let availableCount = 0;
    let unavailableCount = 0;
    let unknownCount = 0;
    let lastCheckTime: Date | null = null;

    categories.forEach((category) => {
      category.domains?.forEach((domain) => {
        totalDomains++;
        const checks = domain.checks || [];
        totalChecks += checks.length;
        if (checks.length === 0) {
          unknownCount++;
          return;
        }
        let hasUnknown = false;
        let allAvailable = true;
        let allUnavailable = true;
        checks.forEach((check) => {
          if (check.checkedAt) {
            const checkTime = new Date(check.checkedAt);
            if (!lastCheckTime || checkTime > lastCheckTime) {
              lastCheckTime = checkTime;
            }
          }
          if (
            check.isAvailable === null ||
            typeof check.isAvailable === "undefined"
          ) {
            hasUnknown = true;
          }
          if (check.isAvailable !== true) {
            allAvailable = false;
          }
          if (check.isAvailable !== false) {
            allUnavailable = false;
          }
        });
        if (hasUnknown) {
          unknownCount++;
        } else if (allAvailable) {
          availableCount++;
        } else if (allUnavailable) {
          unavailableCount++;
        } else {
          // Mixed results (some true, some false): treat as unavailable
          unavailableCount++;
        }
      });
    });

    return {
      totalDomains,
      totalChecks,
      availableCount,
      unavailableCount,
      unknownCount,
      lastCheckTime,
    };
  }, [categories]);
}
