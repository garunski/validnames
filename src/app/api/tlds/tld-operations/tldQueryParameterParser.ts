import { errorResponses } from "@/validators/apiResponseFormatter";
import { validateQueryParams } from "@/validators/requestValidation";
import { tldQuerySchema } from "@/validators/schemas";
import { NextRequest } from "next/server";

const VALID_CATEGORIES = [
  "Popular Generic",
  "Modern Generic",
  "Industry Specific",
  "Special",
  "Country Code",
  "Sponsored",
  "Infrastructure",
] as const;

type ValidCategory = (typeof VALID_CATEGORIES)[number];

export function isValidCategory(category: string): category is ValidCategory {
  return VALID_CATEGORIES.includes(category as ValidCategory);
}

export function parseAndValidateTLDQueryParams(request: NextRequest) {
  const queryValidation = validateQueryParams(tldQuerySchema, request);
  if (!queryValidation.success) {
    return {
      success: false,
      error: errorResponses.validationError(queryValidation.errors!),
    };
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const enabledOnly = searchParams.get("enabledOnly") === "true";
  const selectedTldExtensionsParam = searchParams.get("selectedTldExtensions");

  return {
    success: true,
    data: {
      category,
      enabledOnly,
      selectedTldExtensionsParam,
    },
  };
}
