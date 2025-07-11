import { getCurrentUser } from "@/app/api/auth/authOperations";
import { handleError } from "@/validators/apiErrorResponse";
import { createSuccessResponse } from "@/validators/apiResponseFormatter";
import { NextRequest } from "next/server";
import { startBackgroundDomainCheck } from "./backgroundJobOperations";
import { BatchCheckRequest } from "./domainCheckingTypes";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return createSuccessResponse(null, "Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get("domainId");
    const tldId = searchParams.get("tldId");

    if (!domainId || !tldId) {
      return createSuccessResponse(
        null,
        "domainId and tldId are required",
        400,
      );
    }

    // This endpoint is not implemented yet
    return createSuccessResponse(null, "GET endpoint not implemented", 501);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return createSuccessResponse(null, "Unauthorized", 401);
    }

    const requestData: BatchCheckRequest = await request.json();

    // Process domain checks and get the batch ID
    const result = await startBackgroundDomainCheck(user.id, requestData);

    // Return success response with batch ID
    return createSuccessResponse(
      {
        message: "Domain check completed",
        status: "completed",
        batchId: result.batchId,
        errorCount: result.errorCount,
      },
      "Domain check completed",
      200,
    );
  } catch (error) {
    return handleError(error);
  }
}
