"use client";

import { TLDWithSelection } from "@/app/api/tlds/tld-operations/tldTypes";
import { Badge } from "@/primitives/badge";
import { Checkbox } from "@/primitives/checkbox";

interface TLDItemProps {
  tld: TLDWithSelection;
  isSelected: boolean;
  isLoading: boolean;
  onToggle: (extension: string) => void;
}

export function TLDItem({
  tld,
  isSelected,
  isLoading,
  onToggle,
}: TLDItemProps) {
  return (
    <div
      className={`cursor-pointer rounded-lg border p-4 transition-colors ${
        isSelected
          ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
      }`}
      onClick={() => onToggle(tld.extension)}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onChange={() => onToggle(tld.extension)}
          disabled={isLoading}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-medium">
              {tld.extension}
            </span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {tld.name}
            </span>
            {tld.popularity === "high" && (
              <Badge color="green" className="text-xs">
                Popular
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {tld.description}
          </p>
        </div>
      </div>
    </div>
  );
}
