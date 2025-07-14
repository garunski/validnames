export interface DomainInsights {
  domainAge?: number;
  trustScore?: number;
  registrar?: string;
}

export interface TrustScoreParams {
  ageInYears?: number;
  registrar?: string;
  securityFeatures: string[];
  dnssec?: string;
  expiryDate?: Date;
  updatedDate?: Date;
}

export interface ExtractedData {
  createdDate: Date | null;
  expiryDate: Date | null;
  updatedDate: Date | null;
  registrar: string | null;
  securityFeatures: string[];
  dnssec: string | null;
}
