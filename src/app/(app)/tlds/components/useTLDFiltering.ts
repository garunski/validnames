import {
  HiddenCategory,
  TLDCategory,
  TLDWithSelection,
} from "@/app/api/tlds/tld-operations/tldTypes";
import { useMemo } from "react";

interface UseTLDFilteringProps {
  tlds: TLDWithSelection[];
  searchTerm: string;
  selectedCategory: TLDCategory | "All";
  showHiddenCategories: Set<HiddenCategory>;
  selectedTlds: string[];
}

export function useTLDFiltering({
  tlds,
  searchTerm,
  selectedCategory,
  showHiddenCategories,
  selectedTlds,
}: UseTLDFilteringProps) {
  // Filter TLDs based on search, category, and visibility
  const filteredTlds = useMemo(() => {
    return tlds.filter((tld) => {
      const matchesSearch =
        tld.extension.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tld.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tld.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || tld.category === selectedCategory;
      const isVisible =
        !tld.hidden || showHiddenCategories.has(tld.category as HiddenCategory);

      return matchesSearch && matchesCategory && isVisible;
    });
  }, [tlds, searchTerm, selectedCategory, showHiddenCategories]);

  // Group TLDs by category
  const groupedTlds = useMemo(() => {
    const groups: Record<string, TLDWithSelection[]> = {};
    filteredTlds.forEach((tld) => {
      if (!groups[tld.category]) {
        groups[tld.category] = [];
      }
      groups[tld.category].push(tld);
    });
    return groups;
  }, [filteredTlds]);

  // Get counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<
      string,
      { total: number; selected: number; hidden: number }
    > = {};
    tlds.forEach((tld) => {
      if (!counts[tld.category]) {
        counts[tld.category] = { total: 0, selected: 0, hidden: 0 };
      }
      counts[tld.category].total++;
      if (selectedTlds.includes(tld.extension)) {
        counts[tld.category].selected++;
      }
      if (tld.hidden) {
        counts[tld.category].hidden++;
      }
    });
    return counts;
  }, [tlds, selectedTlds]);

  return {
    filteredTlds,
    groupedTlds,
    categoryCounts,
  };
}
