import type { Check, Domain, TLD } from "@prisma/client";
import { useMemo } from "react";

type DomainWithChecks = Domain & {
  checks: (Check & {
    tld: TLD;
  })[];
};

export function useDomainStats(domain: DomainWithChecks) {
  const domainStats = useMemo(
    () => ({
      available: domain.checks.filter((c: Check) => c.isAvailable === true)
        .length,
      unavailable: domain.checks.filter((c: Check) => c.isAvailable === false)
        .length,
      unknown: domain.checks.filter((c: Check) => c.isAvailable === null)
        .length,
      total: domain.checks.length,
    }),
    [domain.checks],
  );

  const hasAvailable = domainStats.available > 0;
  const hasUnavailable = domainStats.unavailable > 0;

  const lastChecked = useMemo(() => {
    return domain.checks.length > 0 && domain.checks[0].checkedAt
      ? new Date(domain.checks[0].checkedAt)
      : null;
  }, [domain.checks]);

  const insights = useMemo(() => {
    const registeredChecks = domain.checks.filter(
      (c: Check) => c.isAvailable === false,
    );
    const checksWithTrustScore = registeredChecks.filter(
      (c: Check) => c.trustScore !== null,
    );
    const checksWithAge = registeredChecks.filter(
      (c: Check) => c.domainAge !== null,
    );

    const avgTrustScore =
      checksWithTrustScore.length > 0
        ? checksWithTrustScore.reduce(
            (sum: number, c: Check) => sum + (c.trustScore || 0),
            0,
          ) / checksWithTrustScore.length
        : null;

    const avgAge =
      checksWithAge.length > 0
        ? checksWithAge.reduce(
            (sum: number, c: Check) => sum + (c.domainAge || 0),
            0,
          ) / checksWithAge.length
        : null;

    return { avgTrustScore, avgAge };
  }, [domain.checks]);

  const availabilityPercentage = useMemo(() => {
    return domainStats.total > 0
      ? Math.round((domainStats.available / domainStats.total) * 100)
      : 0;
  }, [domainStats.available, domainStats.total]);

  const statusColor = useMemo(() => {
    if (domainStats.total === 0) return "zinc";
    if (hasAvailable && !hasUnavailable) return "green";
    if (hasAvailable && hasUnavailable) return "amber";
    return "red";
  }, [domainStats.total, hasAvailable, hasUnavailable]);

  return {
    domainStats,
    hasAvailable,
    hasUnavailable,
    lastChecked,
    insights,
    availabilityPercentage,
    statusColor,
  };
}
