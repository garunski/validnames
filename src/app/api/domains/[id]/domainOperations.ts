import { prisma } from "@/app/database/client";
import { NotFoundError } from "@/validators/apiErrorTypes";
import { createSuccessResponse } from "@/validators/apiResponseFormatter";
import type { Check, Domain } from "@prisma/client";

// The domain param is a Domain object with category and checks included
interface DomainWithCategoryAndChecks extends Domain {
  category: {
    applicationId: string;
  };
  checks: Check[];
}

export async function handleFavoriteDomainOperation(
  domain: DomainWithCategoryAndChecks,
  categoryId: string,
) {
  // If adding to Favorite category, create it if it doesn't exist
  let targetCategoryId = categoryId;
  if (categoryId === "favorite") {
    const favoriteCategory = await prisma.category.findFirst({
      where: {
        name: "Favorite",
        applicationId: domain.category.applicationId,
      },
    });

    if (!favoriteCategory) {
      const newFavoriteCategory = await prisma.category.create({
        data: {
          name: "Favorite",
          description: "Your favorite domains",
          applicationId: domain.category.applicationId,
        },
      });
      targetCategoryId = newFavoriteCategory.id;
    } else {
      targetCategoryId = favoriteCategory.id;
    }

    // Check if domain already exists in Favorite category
    const existingFavoriteDomain = await prisma.domain.findFirst({
      where: {
        name: domain.name,
        categoryId: targetCategoryId,
      },
    });

    if (existingFavoriteDomain) {
      return createSuccessResponse(
        existingFavoriteDomain,
        "Domain already in favorites",
        200,
      );
    }

    // Create a copy of the domain in the Favorite category
    const favoriteDomain = await prisma.domain.create({
      data: {
        name: domain.name,
        categoryId: targetCategoryId,
      },
      include: {
        checks: {
          include: {
            tld: true,
          },
        },
        category: true,
      },
    });

    // Copy all checks from the original domain to the favorite domain
    if (domain.checks.length > 0) {
      const checkData = domain.checks.map((check: Check) => ({
        domainId: favoriteDomain.id,
        tldId: check.tldId,
        isAvailable: check.isAvailable,
        checkedAt: check.checkedAt,
        batchId: check.batchId,
        error: check.error,
        domainAge: check.domainAge,
        trustScore: check.trustScore,
        registrar: check.registrar,
      }));

      await prisma.check.createMany({
        data: checkData,
      });
    }

    return createSuccessResponse(
      favoriteDomain,
      "Domain added to favorites successfully",
      201,
    );
  }

  return null; // Not a favorite operation
}

export async function moveDomainToCategory(
  domainId: string,
  targetCategoryId: string,
  userId: string,
) {
  // For non-favorite categories, move the domain (original behavior)
  const targetCategory = await prisma.category.findFirst({
    where: {
      id: targetCategoryId,
      application: {
        userId: userId,
      },
    },
  });

  if (!targetCategory) {
    throw new NotFoundError("Category");
  }

  // Update the domain's category
  const updatedDomain = await prisma.domain.update({
    where: {
      id: domainId,
    },
    data: {
      categoryId: targetCategoryId,
    },
    include: {
      checks: {
        include: {
          tld: true,
        },
      },
      category: true,
    },
  });

  return createSuccessResponse(updatedDomain, "Domain moved successfully", 200);
}
