import { getCurrentUser } from "@/app/api/auth/authOperations";
import { handleError } from "@/validators/apiErrorResponse";
import { UnauthorizedError } from "@/validators/apiErrorTypes";
import { createSuccessResponse } from "@/validators/apiResponseFormatter";
import { NextRequest } from "next/server";
import {
  retrieveAllTldsWithSelection,
  retrieveEnabledTldsOnly,
  retrieveTldsByCategory,
} from "./tld-operations/tldDataRetriever";
import {
  isValidCategory,
  parseAndValidateTLDQueryParams,
} from "./tld-operations/tldQueryParameterParser";
import {
  validateTldExtensions,
  validateTldSelectionRequest,
} from "./tld-operations/tldSelectionValidator";
import {
  getUserSelectedTldExtensions,
  saveUserTldSelections,
} from "./tld-operations/userTldSelectionManager";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new UnauthorizedError();
    }

    const queryResult = parseAndValidateTLDQueryParams(request);
    if (!queryResult.success) {
      return queryResult.error;
    }

    const { category, enabledOnly, selectedTldExtensionsParam } =
      queryResult.data!;
    const selectedTldExtensions = await getUserSelectedTldExtensions(
      user.id,
      selectedTldExtensionsParam,
    );

    // If category is provided, only return TLDs for that category
    if (category && isValidCategory(category)) {
      return await retrieveTldsByCategory(category, selectedTldExtensions);
    }

    // If enabledOnly is set, return only enabled TLDs for the user
    if (enabledOnly) {
      return await retrieveEnabledTldsOnly(selectedTldExtensions);
    }

    // Return all TLDs from database with selection status (default)
    return await retrieveAllTldsWithSelection(selectedTldExtensions);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new UnauthorizedError();
    }

    const validationResult = await validateTldSelectionRequest(request);
    if (!validationResult.success) {
      return validationResult.error;
    }

    const { selectedTlds } = validationResult.data!;

    const extensionValidation = await validateTldExtensions(selectedTlds);
    if (!extensionValidation.success) {
      return extensionValidation.error;
    }

    await saveUserTldSelections(user.id, selectedTlds);

    return createSuccessResponse(
      { selectedCount: selectedTlds.length },
      "TLD selections saved successfully",
    );
  } catch (error) {
    return handleError(error);
  }
}
