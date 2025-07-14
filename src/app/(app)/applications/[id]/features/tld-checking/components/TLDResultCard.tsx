"use client";

import { DomainInsights } from "@/app/(app)/applications/[id]/features/domain-management/components/DomainInsights";
import { RegistrarActions } from "@/app/(app)/applications/[id]/features/tld-checking/components/RegistrarActions";
import { TLDCompactView } from "@/app/(app)/applications/[id]/features/tld-checking/components/TLDCompactView";
import { formatAvailabilityStatus } from "@/app/(app)/applications/[id]/features/tld-checking/formatters/availabilityStatusFormatter";
import { generateRegistrarLinks } from "@/app/(app)/applications/[id]/features/tld-checking/generators/registrarLinkGenerator";
import { FeatureErrorBoundary } from "@/components/FeatureErrorBoundary";
import type { Check, TLD } from "@prisma/client";

type CheckWithTld = Check & {
  tld: TLD;
};

interface TLDResultCardProps {
  check: CheckWithTld | null;
  domainName: string;
  compact?: boolean;
  tldExtension?: string; // For placeholder cards without check data
}

export function TLDResultCard({
  check,
  domainName,
  compact = false,
  tldExtension,
}: TLDResultCardProps) {
  // Handle placeholder cards (no check data yet)
  if (!check && tldExtension) {
    const placeholderStyling = {
      border: "border-zinc-200 dark:border-zinc-700",
      bg: "bg-zinc-50 dark:bg-zinc-800/50",
      indicator: "bg-zinc-300 dark:bg-zinc-600",
      icon: "⏳",
      iconColor: "text-zinc-500",
    };

    if (compact) {
      return (
        <FeatureErrorBoundary>
          <div
            className={`rounded-lg border p-2 text-center ${placeholderStyling.border} ${placeholderStyling.bg}`}
          >
            <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
              {tldExtension}
            </div>
            <div className="text-xs text-zinc-500">Not checked</div>
          </div>
        </FeatureErrorBoundary>
      );
    }

    return (
      <FeatureErrorBoundary>
        <div
          className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${placeholderStyling.border} ${placeholderStyling.bg}`}
        >
          <div
            className={`absolute top-0 right-0 left-0 h-1 ${placeholderStyling.indicator}`}
          />
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-zinc-600 dark:text-zinc-400">
                {domainName}
                {tldExtension}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <span className={`text-lg ${placeholderStyling.iconColor}`}>
                  {placeholderStyling.icon}
                </span>
              </div>
            </div>
            <div className="py-4 text-center text-sm text-zinc-500">
              Not checked yet
            </div>
          </div>
        </div>
      </FeatureErrorBoundary>
    );
  }

  // Handle normal cards with check data
  if (!check) return null;
  const links = generateRegistrarLinks(domainName, check.tld.extension);
  const styling = formatAvailabilityStatus(check.isAvailable);

  if (compact) {
    return (
      <FeatureErrorBoundary>
        <TLDCompactView check={check} styling={styling} />
      </FeatureErrorBoundary>
    );
  }

  return (
    <FeatureErrorBoundary>
      <div
        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${styling.border} ${styling.bg}`}
      >
        {/* Status indicator bar */}
        <div
          className={`absolute top-0 right-0 left-0 h-1 ${styling.indicator}`}
        />

        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {domainName}
              {check.tld.extension}
            </span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                check.isAvailable === true
                  ? "bg-green-100 dark:bg-green-900/40"
                  : check.isAvailable === false
                    ? "bg-red-100 dark:bg-red-900/40"
                    : "bg-zinc-100 dark:bg-zinc-800"
              }`}
            >
              <span className={`text-lg ${styling.iconColor}`}>
                {styling.icon}
              </span>
            </div>
          </div>

          <DomainInsights check={check} />
          <RegistrarActions check={check} links={links} />
        </div>
      </div>
    </FeatureErrorBoundary>
  );
}
