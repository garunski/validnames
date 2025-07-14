"use client";

import { Button } from "@/primitives/button";

interface TLD {
  id: string;
  extension: string;
}

interface TLDActionsProps {
  tlds: TLD[];
  selectedTldExtensions: string[];
  searchTerm: string;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function TLDActions({
  tlds,
  selectedTldExtensions,
  searchTerm,
  onSelectAll,
  onClearAll,
}: TLDActionsProps) {
  const filteredTlds = tlds.filter((tld) =>
    tld.extension.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex gap-2">
      <Button onClick={onSelectAll} plain>
        Select All ({filteredTlds.length})
      </Button>
      <Button onClick={onClearAll} plain>
        Clear All
      </Button>
      <div className="ml-auto text-sm text-zinc-500">
        {selectedTldExtensions.length} selected
      </div>
    </div>
  );
}
