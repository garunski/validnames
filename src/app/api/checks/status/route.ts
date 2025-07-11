import { getCurrentUser } from "@/app/api/auth/authOperations";
import { prisma } from "@/app/database/client";
import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get("batchId");
    const categoryId = searchParams.get("categoryId");
    const domainId = searchParams.get("domainId");

    if (!batchId && !categoryId && !domainId) {
      return NextResponse.json(
        { error: "batchId, categoryId, or domainId is required" },
        { status: 400 },
      );
    }

    const whereClause: Prisma.CheckFindManyArgs["where"] = {
      domain: {
        category: {
          application: {
            userId: user.id,
          },
        },
      },
    };

    if (batchId) {
      whereClause.batchId = batchId;
    } else if (domainId) {
      whereClause.domainId = domainId;
    } else if (categoryId) {
      whereClause.domain = {
        category: {
          id: categoryId,
          application: {
            userId: user.id,
          },
        },
      };
    }

    // Get recent checks to determine status
    const recentChecks = await prisma.check.findMany({
      where: whereClause,
      include: {
        domain: true,
        tld: true,
      },
      orderBy: {
        checkedAt: "desc",
      },
      take: 100, // Limit to recent checks
    });

    if (recentChecks.length === 0) {
      return NextResponse.json({
        status: "not_started",
        progress: {
          total: 0,
          completed: 0,
          errors: 0,
          available: 0,
          unavailable: 0,
          percentage: 0,
        },
        message: "No checks found",
      });
    }

    // If we have a batchId, only consider checks from that batch
    const relevantChecks = batchId
      ? recentChecks.filter((check) => check.batchId === batchId)
      : recentChecks;

    if (relevantChecks.length === 0) {
      return NextResponse.json({
        status: "not_started",
        progress: {
          total: 0,
          completed: 0,
          errors: 0,
          available: 0,
          unavailable: 0,
          percentage: 0,
        },
        message: "No checks found for this batch",
      });
    }

    // Analyze the status of checks
    const totalChecks = relevantChecks.length;
    const completedChecks = relevantChecks.filter(
      (check) => check.isAvailable !== null || check.error,
    ).length;
    const errorChecks = relevantChecks.filter((check) => check.error).length;
    const availableChecks = relevantChecks.filter(
      (check) => check.isAvailable === true,
    ).length;
    const unavailableChecks = relevantChecks.filter(
      (check) => check.isAvailable === false,
    ).length;

    // Determine overall status
    let status = "processing";
    if (completedChecks === totalChecks) {
      status = "completed";
    } else if (errorChecks > 0 && completedChecks === 0) {
      status = "error";
    }

    // Get the most recent batch ID if available
    const latestBatchId = relevantChecks[0]?.batchId;

    return NextResponse.json({
      status,
      progress: {
        total: totalChecks,
        completed: completedChecks,
        errors: errorChecks,
        available: availableChecks,
        unavailable: unavailableChecks,
        percentage: Math.round((completedChecks / totalChecks) * 100),
      },
      batchId: latestBatchId,
      lastUpdated: relevantChecks[0]?.checkedAt,
    });
  } catch (error) {
    console.error("Error fetching check status:", error);
    return NextResponse.json(
      { error: "Failed to fetch check status" },
      { status: 500 },
    );
  }
}
