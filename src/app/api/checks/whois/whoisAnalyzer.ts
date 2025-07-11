import { extractWhoisData } from "./whoisDataExtractor";
import { calculateTrustScore } from "./whoisTrustScore";
import { DomainInsights } from "./whoisTypes";

export class WhoisAnalyzer {
  extractDomainInsights(whoisData: Record<string, unknown>): DomainInsights {
    const insights: DomainInsights = {};

    if (!whoisData || Object.keys(whoisData).length === 0) {
      return insights;
    }

    const extractedData = extractWhoisData(whoisData);

    // Calculate domain age
    if (extractedData.createdDate) {
      const now = new Date();
      insights.domainAge = Math.floor(
        (now.getTime() - extractedData.createdDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365),
      );
    }

    // Set registrar
    if (extractedData.registrar) {
      insights.registrar = extractedData.registrar;
    }

    // Calculate trust score
    insights.trustScore = calculateTrustScore({
      ageInYears: insights.domainAge,
      registrar: extractedData.registrar || undefined,
      securityFeatures: extractedData.securityFeatures,
      dnssec: extractedData.dnssec || undefined,
      expiryDate: extractedData.expiryDate || undefined,
      updatedDate: extractedData.updatedDate || undefined,
    });

    return insights;
  }
}

export const whoisAnalyzer = new WhoisAnalyzer();
