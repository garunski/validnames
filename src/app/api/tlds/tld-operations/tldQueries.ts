import { prisma } from "../../../database/client";
import { TLDCategory, TLDData, TLDWithSelection } from "./tldTypes";

/**
 * Get all TLDs from the database
 */
export async function getAllTLDs(): Promise<TLDData[]> {
  return await prisma.tLD.findMany({
    orderBy: [{ sortOrder: "asc" }],
  });
}

/**
 * Get visible TLDs (not hidden)
 */
export async function getVisibleTLDs(): Promise<TLDData[]> {
  return await prisma.tLD.findMany({
    where: {
      hidden: false,
    },
    orderBy: [{ sortOrder: "asc" }],
  });
}

/**
 * Get hidden TLDs
 */
export async function getHiddenTLDs(): Promise<TLDData[]> {
  return await prisma.tLD.findMany({
    where: {
      hidden: true,
    },
    orderBy: [{ sortOrder: "asc" }],
  });
}

/**
 * Get TLDs by category
 */
export async function getTLDsByCategory(
  category: TLDCategory,
): Promise<TLDData[]> {
  return await prisma.tLD.findMany({
    where: {
      category: category,
    },
    orderBy: [{ sortOrder: "asc" }],
  });
}

/**
 * Get popular TLDs (high popularity)
 */
export async function getPopularTLDs(): Promise<TLDData[]> {
  return await prisma.tLD.findMany({
    where: {
      popularity: "high",
    },
    orderBy: [{ sortOrder: "asc" }],
  });
}

/**
 * Get TLDs with user selection status
 */
export async function getTLDsWithSelection(
  selectedTldExtensions: string[],
): Promise<TLDWithSelection[]> {
  const tlds = await getAllTLDs();

  return tlds.map((tld) => ({
    ...tld,
    selected: selectedTldExtensions.includes(tld.extension),
  }));
}

/**
 * Get visible TLDs with user selection status
 */
export async function getVisibleTLDsWithSelection(
  selectedTldExtensions: string[],
): Promise<TLDWithSelection[]> {
  const tlds = await getVisibleTLDs();

  return tlds.map((tld) => ({
    ...tld,
    selected: selectedTldExtensions.includes(tld.extension),
  }));
}

/**
 * Get TLD by extension
 */
export async function getTLDByExtension(
  extension: string,
): Promise<TLDData | null> {
  return await prisma.tLD.findUnique({
    where: {
      extension: extension,
    },
  });
}
