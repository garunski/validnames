import { prisma } from "@/app/database/client";

export async function getUserSelectedTldExtensions(
  userId: string,
  selectedTldExtensionsParam?: string | null,
) {
  if (selectedTldExtensionsParam) {
    return selectedTldExtensionsParam.split(",");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  const selectedTldExtensions: string[] = [];
  const selectedTldIds = userSettings?.selectedTldIds
    ? JSON.parse(userSettings.selectedTldIds)
    : [];

  if (selectedTldIds.length > 0) {
    const selectedTlds = await prisma.tLD.findMany({
      where: { id: { in: selectedTldIds } },
    });
    selectedTldExtensions.push(...selectedTlds.map((tld) => tld.extension));
  }

  return selectedTldExtensions;
}

export async function saveUserTldSelections(
  userId: string,
  selectedTldExtensions: string[],
) {
  const tldIds: string[] = [];

  if (selectedTldExtensions.length > 0) {
    const tlds = await prisma.tLD.findMany({
      where: { extension: { in: selectedTldExtensions } },
      select: { id: true },
    });
    tldIds.push(...tlds.map((tld) => tld.id));
  }

  await prisma.userSettings.upsert({
    where: { userId },
    update: {
      selectedTldIds: JSON.stringify(tldIds),
    },
    create: {
      userId,
      selectedTldIds: JSON.stringify(tldIds),
      preferences: JSON.stringify({}),
    },
  });

  return tldIds;
}
