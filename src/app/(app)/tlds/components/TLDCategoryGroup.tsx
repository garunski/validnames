"use client";

import {
  HIDDEN_CATEGORIES,
  HiddenCategory,
  TLDWithSelection,
} from "@/app/api/tlds/tld-operations/tldTypes";
import { Badge } from "@/primitives/badge";
import { Button } from "@/primitives/button";
import { Subheading } from "@/primitives/heading";
import { TLDItem } from "./TLDItem";

interface TLDCategoryGroupProps {
  category: string;
  tlds: TLDWithSelection[];
  selectedTlds: string[];
  isLoading: boolean;
  categoryCounts: Record<
    string,
    { total: number; selected: number; hidden: number }
  >;
  onSelectAll: (category: string) => void;
  onSelectNone: (category: string) => void;
  onTldToggle: (extension: string) => void;
}

export function TLDCategoryGroup({
  category,
  tlds,
  selectedTlds,
  isLoading,
  categoryCounts,
  onSelectAll,
  onSelectNone,
  onTldToggle,
}: TLDCategoryGroupProps) {
  const count = categoryCounts[category];
  const isHidden = HIDDEN_CATEGORIES.includes(category as HiddenCategory);

  const sortedTlds = tlds.sort((a, b) => {
    // Sort by popularity first, then alphabetically
    const popularityOrder: Record<string, number> = {
      high: 0,
      medium: 1,
      low: 2,
    };
    const aPopularity = popularityOrder[a.popularity || "low"];
    const bPopularity = popularityOrder[b.popularity || "low"];
    if (aPopularity !== bPopularity) {
      return aPopularity - bPopularity;
    }
    return a.extension.localeCompare(b.extension);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Subheading>{category}</Subheading>
          <div className="flex items-center gap-2">
            <Badge color="blue">{count?.selected || 0} selected</Badge>
            <Badge color="zinc">{tlds.length} shown</Badge>
            {count && count.total > tlds.length && (
              <Badge color="zinc">{count.total - tlds.length} hidden</Badge>
            )}
            {isHidden && <Badge color="amber">Optional</Badge>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            outline
            onClick={() => onSelectAll(category)}
            disabled={isLoading || tlds.length === 0}
          >
            Select All
          </Button>
          <Button
            outline
            onClick={() => onSelectNone(category)}
            disabled={isLoading || tlds.length === 0}
          >
            Select None
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedTlds.map((tld) => (
          <TLDItem
            key={tld.extension}
            tld={tld}
            isSelected={selectedTlds.includes(tld.extension)}
            isLoading={isLoading}
            onToggle={onTldToggle}
          />
        ))}
      </div>
    </div>
  );
}
