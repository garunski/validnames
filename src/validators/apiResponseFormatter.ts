import { NextResponse } from "next/server";
import {
  ERROR_CODES,
  FieldValidationError,
  HTTP_STATUS,
} from "./validationTypes";

// Response helper functions
export function createErrorResponse(
  message: string,
  status: number = HTTP_STATUS.BAD_REQUEST,
  code: string = ERROR_CODES.VALIDATION_ERROR,
  details?: unknown,
) {
  return NextResponse.json(
    {
      error: message,
      code,
      details,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = HTTP_STATUS.OK,
) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

// Common error responses
export const errorResponses = {
  unauthorized: () =>
    createErrorResponse(
      "Unauthorized",
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
    ),
  notFound: (resource: string = "Resource") =>
    createErrorResponse(
      `${resource} not found`,
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.NOT_FOUND,
    ),
  conflict: (message: string) =>
    createErrorResponse(message, HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT),
  internalError: (message: string = "Internal server error") =>
    createErrorResponse(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_ERROR,
    ),
  validationError: (errors: FieldValidationError[]) =>
    createErrorResponse(
      "Validation failed",
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      ERROR_CODES.VALIDATION_ERROR,
      { errors },
    ),
};
