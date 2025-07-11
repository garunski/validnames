import { BaseHeader } from "@/components/layout/BaseHeader";
import { TLDDisplay } from "@/components/tldDisplay";
import { Badge } from "@/primitives/badge";
import { GlobeAltIcon } from "@heroicons/react/20/solid";

interface TLDManagementHeaderProps {
  selectedTlds: string[];
}

export function TLDManagementHeader({
  selectedTlds,
}: TLDManagementHeaderProps) {
  return (
    <BaseHeader
      icon={<GlobeAltIcon className="size-5" />}
      title="TLD Management"
      description="Select the top-level domains (TLDs) you want to use for domain availability checking across all your applications."
      actions={<Badge color="blue">{selectedTlds.length} selected</Badge>}
      secondaryContent={
        <>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Active TLDs:
          </span>
          <div className="min-w-0 flex-1">
            <TLDDisplay selectedTldExtensions={selectedTlds} />
          </div>
        </>
      }
    />
  );
}
