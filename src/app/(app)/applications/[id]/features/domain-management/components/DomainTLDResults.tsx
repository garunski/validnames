"use client";

import { TLDResultCard } from "@/app/(app)/applications/[id]/features/tld-checking/components/TLDResultCard";
import type { DomainWithRelations } from "@/app/api/applications/applicationTypes";
import { GlobeAltIcon } from "@heroicons/react/20/solid";
import type { Check, TLD } from "@prisma/client";

interface DomainTLDResultsProps {
  domain: DomainWithRelations;
  selectedTlds: string[];
}

export function DomainTLDResults({
  domain,
  selectedTlds,
}: DomainTLDResultsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <GlobeAltIcon className="h-5 w-5 text-blue-500" />
          TLD Availability Results
        </h4>
      </div>

      {/* TLD Results Grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(() => {
          // Create a combined list of check results and placeholder cards
          const displayCards: Array<{
            type: "check" | "placeholder";
            check?: Check & { tld: TLD };
            tldExtension?: string;
          }> = [];

          // Add existing check results
          domain.checks.forEach((check: Check & { tld: TLD }) => {
            displayCards.push({ type: "check", check });
          });

          // Add placeholder cards for selected TLDs without checks
          selectedTlds.forEach((tldExtension) => {
            const hasCheck = domain.checks.some(
              (c: Check & { tld: TLD }) => c.tld.extension === tldExtension,
            );
            if (!hasCheck) {
              displayCards.push({ type: "placeholder", tldExtension });
            }
          });

          // Sort by TLD extension for consistent display
          displayCards.sort((a, b) => {
            const aExt =
              a.type === "check" && a.check
                ? a.check.tld.extension
                : (a.tldExtension ?? "");
            const bExt =
              b.type === "check" && b.check
                ? b.check.tld.extension
                : (b.tldExtension ?? "");
            return aExt.localeCompare(bExt);
          });

          // Show all cards (no limiting)
          return displayCards.map((item) => (
            <TLDResultCard
              key={
                item.type === "check" && item.check
                  ? item.check.id
                  : `placeholder-${item.tldExtension}`
              }
              check={item.check ?? null}
              domainName={domain.name}
              compact={false}
              tldExtension={
                item.type === "placeholder" ? item.tldExtension : undefined
              }
            />
          ));
        })()}
      </div>
    </div>
  );
}
