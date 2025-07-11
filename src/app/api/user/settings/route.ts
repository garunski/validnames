export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/app/api/auth/authOperations";
import { prisma } from "@/app/database/client";
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

    // Convert TLD IDs to extensions for frontend
    let selectedTldExtensions: string[] = [];
    if (settings?.selectedTldIds) {
      const selectedTldIds = JSON.parse(settings.selectedTldIds);
      if (selectedTldIds.length > 0) {
        const selectedTlds = await prisma.tLD.findMany({
          where: { id: { in: selectedTldIds } },
          select: { extension: true },
        });
        selectedTldExtensions = selectedTlds.map((tld) => tld.extension);
      }
    }

    const response = {
      selectedTldIds: selectedTldExtensions, // API still uses this name but contains extensions
      preferences: settings?.preferences
        ? JSON.parse(settings.preferences)
        : {},
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

    const { selectedTldIds, preferences } = await request.json();

    // Convert TLD extensions to IDs for database storage
    let tldIds: string[] = [];
    if (
      selectedTldIds &&
      Array.isArray(selectedTldIds) &&
      selectedTldIds.length > 0
    ) {
      const tlds = await prisma.tLD.findMany({
        where: { extension: { in: selectedTldIds } },
        select: { id: true },
      });
      tldIds = tlds.map((tld) => tld.id);
    }

    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        selectedTldIds: selectedTldIds ? JSON.stringify(tldIds) : null,
        preferences: preferences ? JSON.stringify(preferences) : null,
      },
      create: {
        userId: user.id,
        selectedTldIds: selectedTldIds ? JSON.stringify(tldIds) : null,
        preferences: preferences ? JSON.stringify(preferences) : null,
      },
    });

    // Convert TLD IDs back to extensions for response
    let selectedTldExtensions: string[] = [];
    if (settings.selectedTldIds) {
      const storedTldIds = JSON.parse(settings.selectedTldIds);
      if (storedTldIds.length > 0) {
        const selectedTlds = await prisma.tLD.findMany({
          where: { id: { in: storedTldIds } },
          select: { extension: true },
        });
        selectedTldExtensions = selectedTlds.map((tld) => tld.extension);
      }
    }

    const response = {
      selectedTldIds: selectedTldExtensions, // API still uses this name but contains extensions
      preferences: settings.preferences ? JSON.parse(settings.preferences) : {},
    };

    return createSuccessResponse(response);
  } catch (error) {
    return handleError(error);
  }
}
