"use client";

import type { CategoryWithRelations } from "@/app/api/applications/applicationTypes";
import { useEffect, useRef, useState } from "react";

interface UseAutoDomainCheckingProps {
  categories: CategoryWithRelations[];
  selectedCategory: string | null;
  selectedTlds: string[];
  onRefreshChecks: () => void;
  onAutoCheckStart?: (categoryName: string, unknownDomainCount: number) => void;
  onAutoCheckComplete?: (categoryName: string, success: boolean) => void;
}

export function useAutoDomainChecking({
  categories,
  selectedCategory,
  // selectedTlds, // No longer used
  onRefreshChecks,
  onAutoCheckStart,
  onAutoCheckComplete,
}: UseAutoDomainCheckingProps) {
  const lastSelectedCategory = useRef<string | null>(null);
  const hasTriggeredForCategory = useRef<Set<string>>(new Set());
  const [isAutoChecking, setIsAutoChecking] = useState(false);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== lastSelectedCategory.current) {
      const category = categories.find((c) => c.id === selectedCategory);
      if (category && category.domains) {
        if (hasTriggeredForCategory.current.has(selectedCategory)) {
          lastSelectedCategory.current = selectedCategory;
          return;
        }

        // New logic: unknown = no checks, known = any checks
        // let knownCount = 0;
        // let unknownCount = 0;
        // category.domains.forEach((domain) => {
        //   if (domain.checks && domain.checks.length > 0) {
        //     knownCount++;
        //   } else {
        //     unknownCount++;
        //   }
        // });

        const unknownDomains = category.domains.filter(
          (domain) => !domain.checks || domain.checks.length === 0,
        );

        if (unknownDomains.length > 0) {
          hasTriggeredForCategory.current.add(selectedCategory);
          onAutoCheckStart?.(category.name, unknownDomains.length);
          setIsAutoChecking(true);
          onRefreshChecks();
          setTimeout(() => {
            setIsAutoChecking(false);
            onAutoCheckComplete?.(category.name, true);
          }, 1000);
        }
      }
      lastSelectedCategory.current = selectedCategory;
    }
  }, [
    selectedCategory,
    categories,
    onRefreshChecks,
    onAutoCheckStart,
    onAutoCheckComplete,
  ]);

  return {
    isAutoChecking,
  };
}
