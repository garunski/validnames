// Types for TLD data
export interface TLDData {
  id: string;
  extension: string;
  name: string;
  category: string;
  description: string;
  popularity: string | null;
  hidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TLDWithSelection extends TLDData {
  selected: boolean;
}

// Category constants
export const TLD_CATEGORIES = [
  "Popular Generic",
  "Modern Generic",
  "Industry Specific",
  "Special",
  "Country Code",
  "Sponsored",
  "Infrastructure",
] as const;

export const HIDDEN_CATEGORIES = [
  "Country Code",
  "Sponsored",
  "Infrastructure",
] as const;

export type TLDCategory = (typeof TLD_CATEGORIES)[number];
export type HiddenCategory = (typeof HIDDEN_CATEGORIES)[number];
