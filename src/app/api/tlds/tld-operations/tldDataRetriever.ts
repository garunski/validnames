import { prisma } from "@/app/database/client";
import { createSuccessResponse } from "@/validators/apiResponseFormatter";
import { getTLDsByCategory, getTLDsWithSelection } from "./tldQueries";
import { TLDCategory } from "./tldTypes";

export async function retrieveTldsByCategory(
  category: TLDCategory,
  selectedTldExtensions: string[],
) {
  const tlds = await getTLDsByCategory(category);
  const tldData = tlds.map((tld) => ({
    ...tld,
    selected: selectedTldExtensions.includes(tld.extension),
  }));
  return createSuccessResponse(tldData);
}

export async function retrieveEnabledTldsOnly(selectedTldExtensions: string[]) {
  if (selectedTldExtensions.length === 0) {
    return createSuccessResponse({ tlds: [], selectedCount: 0 });
  }

  const tlds = await prisma.tLD.findMany({
    where: { extension: { in: selectedTldExtensions } },
    orderBy: [{ sortOrder: "asc" }],
  });
  const tldData = tlds.map((tld) => ({ ...tld, selected: true }));
  return createSuccessResponse({
    tlds: tldData,
    selectedCount: tldData.length,
  });
}

export async function retrieveAllTldsWithSelection(
  selectedTldExtensions: string[],
) {
  const tldData = await getTLDsWithSelection(selectedTldExtensions);
  return createSuccessResponse({
    tlds: tldData,
    selectedCount: selectedTldExtensions.length,
  });
}
