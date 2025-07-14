// Domain checking related types
export type DomainCheckResult = {
  domain: string;
  tld: string;
  isAvailable: boolean | null;
  error?: string;
  checkedAt: Date;
  domainAge?: number;
  trustScore?: number;
  registrar?: string;
};

export type BatchCheckRequest = {
  domainIds: string[];
  tldIds: string[];
  batchId?: string;
};

export type RefreshCheckRequest = {
  categoryId?: string;
  domainId?: string;
  tldIds: string[];
};
