import type { Check, TLD } from "@prisma/client";

type CheckWithTld = Check & {
  tld: TLD;
};

interface TLDCompactViewProps {
  check: CheckWithTld;
  styling: {
    border: string;
    bg: string;
    indicator: string;
    icon: string;
    iconColor: string;
  };
}

export function TLDCompactView({ check, styling }: TLDCompactViewProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border transition-all duration-200 hover:scale-105 hover:shadow-md ${styling.border} ${styling.bg}`}
    >
      {/* Status indicator */}
      <div
        className={`absolute top-0 right-0 left-0 h-0.5 ${styling.indicator}`}
      />

      <div className="p-2">
        <div className="flex items-center justify-between">
          <span className="truncate font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">
            {check.tld.extension}
          </span>
          <span className={`text-sm ${styling.iconColor}`}>{styling.icon}</span>
        </div>

        {/* Quick info for registered domains */}
        {check.isAvailable === false &&
          (check.domainAge !== null || check.trustScore !== null) && (
            <div className="mt-1 flex gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              {check.domainAge !== null && <span>{check.domainAge}y</span>}
              {check.trustScore !== null && <span>⭐{check.trustScore}</span>}
            </div>
          )}
      </div>
    </div>
  );
}
