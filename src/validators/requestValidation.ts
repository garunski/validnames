import { NextRequest } from "next/server";
import { z } from "zod";
import {
  ERROR_CODES,
  FieldValidationError,
  ValidationResult,
} from "./validationTypes";

// Core validation helper functions
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: FieldValidationError[] = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
        code: ERROR_CODES.VALIDATION_ERROR,
      }));
      return {
        success: false,
        errors,
      };
    }
    return {
      success: false,
      errors: [
        {
          field: "unknown",
          message: "Validation failed",
          code: ERROR_CODES.VALIDATION_ERROR,
        },
      ],
    };
  }
}

export async function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  request: NextRequest,
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();
    return validateSchema(schema, body);
  } catch {
    return {
      success: false,
      errors: [
        {
          field: "body",
          message: "Invalid JSON body",
          code: ERROR_CODES.VALIDATION_ERROR,
        },
      ],
    };
  }
}

export function validateQueryParams<T>(
  schema: z.ZodSchema<T>,
  request: NextRequest,
): ValidationResult<T> {
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  return validateSchema(schema, queryParams);
}

export function validatePathParams<T>(
  schema: z.ZodSchema<T>,
  params: Record<string, string | string[]>,
): ValidationResult<T> {
  return validateSchema(schema, params);
}

// Async validation helper for operations that need to be awaited
export async function validateAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): Promise<ValidationResult<T>> {
  try {
    const validatedData = await schema.parseAsync(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: FieldValidationError[] = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
        code: ERROR_CODES.VALIDATION_ERROR,
      }));
      return {
        success: false,
        errors,
      };
    }
    return {
      success: false,
      errors: [
        {
          field: "unknown",
          message: "Validation failed",
          code: ERROR_CODES.VALIDATION_ERROR,
        },
      ],
    };
  }
}
