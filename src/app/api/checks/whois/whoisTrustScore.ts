import { TrustScoreParams } from "./whoisTypes";

export function calculateTrustScore(params: TrustScoreParams): number {
  let score = 0;
  const now = new Date();

  // Age scoring
  if (params.ageInYears) {
    if (params.ageInYears > 5) score += 2;
    if (params.ageInYears > 10) score += 1;
  }

  // Registrar reputation
  if (params.registrar) {
    const highRepRegistrars = [
      "MarkMonitor",
      "CSC Corporate Domains",
      "Amazon Registrar",
    ];
    const mediumRepRegistrars = ["GoDaddy", "Namecheap", "Google Domains"];

    if (highRepRegistrars.some((rep) => params.registrar!.includes(rep))) {
      score += 2;
    } else if (
      mediumRepRegistrars.some((rep) => params.registrar!.includes(rep))
    ) {
      score += 1;
    }
  }

  // Security features
  if (params.securityFeatures.length > 2) score += 2;
  else if (params.securityFeatures.length > 0) score += 1;

  // DNSSEC
  if (params.dnssec && params.dnssec !== "unsigned") score += 1;

  // Well-maintained (updated within last year)
  if (params.updatedDate) {
    const daysSinceUpdate =
      (now.getTime() - params.updatedDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 365) score += 1;
  }

  // Long-term planning (expires more than 1 year out)
  if (params.expiryDate) {
    const daysUntilExpiry =
      (params.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (daysUntilExpiry > 365) score += 1;
  }

  return Math.min(score, 10);
}
