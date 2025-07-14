import type { Check, Domain, TLD } from "@prisma/client";
import { useMemo } from "react";

type DomainWithChecks = Domain & {
  checks: (Check & {
    tld: TLD;
  })[];
};

export function useDomainSorting(
  domains: DomainWithChecks[],
  sortBy: "name" | "availability" | "recent",
) {
  const stats = useMemo(() => {
    const totalChecks = domains.reduce(
      (sum, domain) => sum + domain.checks.length,
      0,
    );
    const totalAvailable = domains.reduce(
      (sum, domain) =>
        sum + domain.checks.filter((c: Check) => c.isAvailable === true).length,
      0,
    );
    const totalUnavailable = domains.reduce(
      (sum, domain) =>
        sum +
        domain.checks.filter((c: Check) => c.isAvailable === false).length,
      0,
    );

    return { totalChecks, totalAvailable, totalUnavailable };
  }, [domains]);

  const sortedDomains = useMemo(() => {
    return [...domains].sort((a, b) => {
      switch (sortBy) {
        case "availability":
          const aAvailable = a.checks.filter(
            (c: Check) => c.isAvailable === true,
          ).length;
          const bAvailable = b.checks.filter(
            (c: Check) => c.isAvailable === true,
          ).length;
          return bAvailable - aAvailable;
        case "recent":
          const aLatest =
            a.checks.length > 0
              ? new Date(a.checks[0].checkedAt || 0).getTime()
              : 0;
          const bLatest =
            b.checks.length > 0
              ? new Date(b.checks[0].checkedAt || 0).getTime()
              : 0;
          return bLatest - aLatest;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [domains, sortBy]);

  return {
    sortedDomains,
    ...stats,
  };
}
