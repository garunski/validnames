import { getCurrentUser } from "@/app/api/auth/authOperations";
import { prisma } from "@/app/database/client";
import { handleError } from "@/validators/apiErrorResponse";
import { createSuccessResponse } from "@/validators/apiResponseFormatter";
import { NextRequest } from "next/server";
import { startBackgroundDomainCheck } from "../backgroundJobOperations";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return createSuccessResponse(null, "Unauthorized", 401);
    }

    const { domainId, categoryId, tldExtensions } = await request.json();

    if (!tldExtensions || tldExtensions.length === 0) {
      return createSuccessResponse(null, "TLD extensions are required", 400);
    }

    // Convert TLD extensions to IDs
    const tlds = await prisma.tLD.findMany({
      where: { extension: { in: tldExtensions } },
      select: { id: true },
    });

    if (tlds.length === 0) {
      return createSuccessResponse(null, "No valid TLDs found", 400);
    }

    const finalTldIds = tlds.map((tld) => tld.id);

    // Get domains to refresh
    let domains: { id: string; name: string }[] = [];

    if (domainId) {
      // Refresh specific domain
      const domain = await prisma.domain.findFirst({
        where: {
          id: domainId,
          category: {
            application: {
              userId: user.id,
            },
          },
        },
      });

      if (!domain) {
        return createSuccessResponse(null, "Domain not found", 404);
      }

      domains = [domain];
    } else if (categoryId) {
      // Refresh all domains in category
      domains = await prisma.domain.findMany({
        where: {
          category: {
            id: categoryId,
            application: {
              userId: user.id,
            },
          },
        },
      });
    } else {
      return createSuccessResponse(
        null,
        "domainId or categoryId is required",
        400,
      );
    }

    if (!domains.length) {
      return createSuccessResponse(null, "No domains found", 404);
    }

    // Process domain refresh and get the batch ID
    const result = await startBackgroundDomainCheck(user.id, {
      domainIds: domains.map((d) => d.id),
      tldIds: finalTldIds,
      tldExtensions,
    });

    // Return success response with batch ID
    return createSuccessResponse(
      {
        message: "Domain refresh completed",
        status: "completed",
        domainCount: domains.length,
        batchId: result.batchId,
        errorCount: result.errorCount,
      },
      "Domain refresh completed",
      200,
    );
  } catch (error) {
    return handleError(error);
  }
}
