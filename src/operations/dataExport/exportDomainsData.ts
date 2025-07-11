export async function exportDomainsData(userId: string) {
  const { prisma } = await import("@/app/database/client");
  const applications = await prisma.application.findMany({
    where: { userId },
    select: { id: true },
  });
  const applicationIds = applications.map((a) => a.id);

  if (applicationIds.length === 0) return [];

  const categories = await prisma.category.findMany({
    where: { applicationId: { in: applicationIds } },
    select: { id: true },
  });
  const categoryIds = categories.map((c) => c.id);

  if (categoryIds.length === 0) return [];

  const domains = await prisma.domain.findMany({
    where: { categoryId: { in: categoryIds } },
  });

  return domains.map((domain) => ({
    name: domain.name,
    createdAt: domain.createdAt,
    updatedAt: domain.updatedAt,
  }));
}
