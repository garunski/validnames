export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/app/api/auth/authOperations";
import { prisma } from "@/app/database/client";
import {
  processTldDataForResponse,
  processTldDataForStorage,
} from "@/operations/tldConversionOperations";
import { handleError } from "@/validators/apiErrorResponse";
import { createSuccessResponse } from "@/validators/apiResponseFormatter";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return createSuccessResponse(null, "Unauthorized", 401);
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    // Convert TLD IDs to extensions for frontend using shared operation
    const { selectedTldExtensions } = await processTldDataForResponse(
      settings?.selectedTldIds || null,
    );

    const response = {
      selectedTldIds: selectedTldExtensions, // API still uses this name but contains extensions
    };

    return createSuccessResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return createSuccessResponse(null, "Unauthorized", 401);
    }

    const { selectedTldIds } = await request.json();

    // Convert TLD extensions to IDs for database storage using shared operation
    const { selectedTldIds: tldIdsJson } =
      await processTldDataForStorage(selectedTldIds);

    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        selectedTldIds: tldIdsJson,
      },
      create: {
        userId: user.id,
        selectedTldIds: tldIdsJson,
      },
    });

    // Convert TLD IDs back to extensions for response using shared operation
    const { selectedTldExtensions } = await processTldDataForResponse(
      settings.selectedTldIds,
    );

    const response = {
      selectedTldIds: selectedTldExtensions, // API still uses this name but contains extensions
    };

    return createSuccessResponse(response);
  } catch (error) {
    return handleError(error);
  }
}
