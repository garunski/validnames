import { getCurrentUser } from "@/app/api/auth/authOperations";
import { handleError } from "@/validators/apiErrorResponse";
import { UnauthorizedError } from "@/validators/apiErrorTypes";
import { NextRequest } from "next/server";
import {
  fetchApplicationWithDetails,
  removeApplication,
  updateApplicationDetails,
} from "./applicationCrudOperations";

function extractIdFromRequest(request: NextRequest): string {
  // /api/applications/[id] => extract id
  const segments = request.nextUrl.pathname.split("/");
  return segments[segments.length - 1];
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new UnauthorizedError();
    }
    const id = extractIdFromRequest(request);
    return await fetchApplicationWithDetails(id, user.id);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new UnauthorizedError();
    }
    const id = extractIdFromRequest(request);
    return await updateApplicationDetails(request, id, user.id);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new UnauthorizedError();
    }
    const id = extractIdFromRequest(request);
    return await removeApplication(id, user.id);
  } catch (error) {
    return handleError(error);
  }
}
