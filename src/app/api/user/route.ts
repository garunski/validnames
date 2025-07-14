export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/app/api/auth/authOperations";
import { handleError } from "@/validators/apiErrorResponse";
import { createSuccessResponse } from "@/validators/apiResponseFormatter";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return createSuccessResponse(null, "Unauthorized", 401);
    }

    return createSuccessResponse({ user });
  } catch (error) {
    return handleError(error);
  }
}
