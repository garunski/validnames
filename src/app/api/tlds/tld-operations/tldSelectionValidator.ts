import { errorResponses } from "@/validators/apiResponseFormatter";
import { validateRequestBody } from "@/validators/requestValidation";
import { tldSelectionSchema } from "@/validators/schemas";
import { NextRequest } from "next/server";
import { validateTLDExtensions } from "./tldValidation";

export async function validateTldSelectionRequest(request: NextRequest) {
  const validation = await validateRequestBody(tldSelectionSchema, request);

  if (!validation.success) {
    return {
      success: false,
      error: errorResponses.validationError(validation.errors!),
    };
  }

  const { selectedTlds } = validation.data ?? {};

  if (!selectedTlds) {
    return {
      success: false,
      error: errorResponses.validationError([
        {
          field: "selectedTlds",
          message: "TLD selection is required",
          code: "VALIDATION_ERROR",
        },
      ]),
    };
  }

  return { success: true, data: { selectedTlds } };
}

export async function validateTldExtensions(selectedTlds: string[]) {
  const validExtensions = await validateTLDExtensions(selectedTlds);
  const invalidTlds = selectedTlds.filter(
    (ext) => !validExtensions.includes(ext),
  );

  if (invalidTlds.length > 0) {
    return {
      success: false,
      error: errorResponses.validationError([
        {
          field: "selectedTlds",
          message: `Invalid TLD extensions: ${invalidTlds.join(", ")}`,
          code: "INVALID_TLD_EXTENSIONS",
        },
      ]),
    };
  }

  return { success: true };
}
