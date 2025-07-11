import { prisma } from "@/app/database/client";

/**
 * Converts TLD IDs to extensions for frontend consumption
 */
export async function convertTldIdsToExtensions(
  selectedTldIds: string | null,
): Promise<string[]> {
  if (!selectedTldIds) {
    return [];
  }

  try {
    const tldIds = JSON.parse(selectedTldIds);
    if (!Array.isArray(tldIds) || tldIds.length === 0) {
      return [];
    }

    const selectedTlds = await prisma.tLD.findMany({
      where: { id: { in: tldIds } },
      select: { extension: true },
    });

    return selectedTlds.map((tld) => tld.extension);
  } catch (error) {
    console.error("Error parsing selectedTldIds:", error);
    return [];
  }
}

/**
 * Converts TLD extensions to IDs for database storage
 */
export async function convertTldExtensionsToIds(
  selectedTldExtensions: string[] | null | undefined,
): Promise<string[]> {
  if (
    !selectedTldExtensions ||
    !Array.isArray(selectedTldExtensions) ||
    selectedTldExtensions.length === 0
  ) {
    return [];
  }

  const tlds = await prisma.tLD.findMany({
    where: { extension: { in: selectedTldExtensions } },
    select: { id: true },
  });

  return tlds.map((tld) => tld.id);
}

/**
 * Converts TLD extensions to IDs and returns as JSON string for database storage
 */
export async function convertTldExtensionsToIdsJson(
  selectedTldExtensions: string[] | null | undefined,
): Promise<string | null> {
  const tldIds = await convertTldExtensionsToIds(selectedTldExtensions);
  return tldIds.length > 0 ? JSON.stringify(tldIds) : null;
}

/**
 * Processes TLD data for API responses - converts IDs to extensions
 */
export async function processTldDataForResponse(
  selectedTldIds: string | null,
): Promise<{ selectedTldExtensions: string[] }> {
  const selectedTldExtensions = await convertTldIdsToExtensions(selectedTldIds);
  return { selectedTldExtensions };
}

/**
 * Processes TLD data for database storage - converts extensions to IDs
 */
export async function processTldDataForStorage(
  selectedTldExtensions: string[] | null | undefined,
): Promise<{ selectedTldIds: string | null }> {
  const selectedTldIds = await convertTldExtensionsToIdsJson(
    selectedTldExtensions,
  );
  return { selectedTldIds };
}
