import whoiser from "whoiser";
import { DomainCheckResult } from "./domainCheckingTypes";
import { whoisAnalyzer } from "./whois/whoisAnalyzer";
import type { DomainInsights } from "./whois/whoisTypes";

export class DomainAvailabilityChecker {
  private async checkDomainAvailability(
    domain: string,
    tld: string,
  ): Promise<{ isAvailable: boolean | null; insights?: DomainInsights }> {
    try {
      // Handle TLD that may or may not include the dot prefix
      const cleanTld = tld.startsWith(".") ? tld.substring(1) : tld;
      const fullDomain = `${domain}.${cleanTld}`;

      // Use whoiser to check domain availability via WHOIS
      const whoisData = await whoiser(fullDomain, {
        timeout: 10000, // 10 second timeout
        follow: 1, // Only query registry server for speed
        ignorePrivacy: true, // Ignore privacy protection for availability check
      });

      // If no WHOIS data is returned or it's empty, domain is likely available
      if (!whoisData || Object.keys(whoisData).length === 0) {
        return { isAvailable: true }; // Domain appears to be available
      }

      // Check if any server returned data indicating the domain is registered
      let isRegistered = false;
      for (const serverData of Object.values(whoisData)) {
        if (serverData && typeof serverData === "object") {
          // Cast to any to safely access WHOIS fields
          const data = serverData as Record<string, unknown>;

          // If we have meaningful registration data, domain is taken
          if (
            data["Domain Name"] ||
            data["Creation Date"] ||
            data["Expiry Date"] ||
            data["Registrar"] ||
            data["domain name"] ||
            data["creation date"] ||
            data["expiry date"] ||
            data["registrar"]
          ) {
            isRegistered = true;
            break;
          }
        }
      }

      if (isRegistered) {
        // Extract insights for registered domains
        const insights = whoisAnalyzer.extractDomainInsights(whoisData);
        return { isAvailable: false, insights };
      }

      // If we get here, domain status is unclear - default to available
      return { isAvailable: true };
    } catch (error) {
      console.error(`WHOIS error for ${domain}.${tld}:`, error);

      // Handle specific error cases
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        // Common "domain not found" indicators suggest availability
        if (
          errorMessage.includes("no match") ||
          errorMessage.includes("not found") ||
          errorMessage.includes("no data found") ||
          errorMessage.includes("object does not exist")
        ) {
          return { isAvailable: true }; // Domain appears to be available
        }

        // Rate limiting or server errors
        if (
          errorMessage.includes("rate limit") ||
          errorMessage.includes("too many requests") ||
          errorMessage.includes("timeout")
        ) {
          return { isAvailable: null }; // Cannot determine availability
        }
      }

      return { isAvailable: null }; // Error occurred, cannot determine availability
    }
  }

  async checkDomain(domain: string, tld: string): Promise<DomainCheckResult> {
    const checkedAt = new Date();

    try {
      const result = await this.checkDomainAvailability(domain, tld);

      return {
        domain,
        tld,
        isAvailable: result.isAvailable,
        checkedAt,
        // Add insights if domain is registered
        ...(result.insights && {
          domainAge: result.insights.domainAge,
          trustScore: result.insights.trustScore,
          registrar: result.insights.registrar,
        }),
      };
    } catch (error) {
      return {
        domain,
        tld,
        isAvailable: null,
        error: error instanceof Error ? error.message : "Unknown error",
        checkedAt,
      };
    }
  }

  async checkMultipleDomains(
    domains: string[],
    tlds: string[],
  ): Promise<DomainCheckResult[]> {
    const results: DomainCheckResult[] = [];

    for (const domain of domains) {
      for (const tld of tlds) {
        const result = await this.checkDomain(domain, tld);
        results.push(result);

        // Add delay to avoid overwhelming WHOIS servers and rate limits
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return results;
  }
}

export const domainAvailabilityChecker = new DomainAvailabilityChecker();
