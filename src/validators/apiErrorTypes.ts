import { ERROR_CODES, HTTP_STATUS } from "./validationTypes";

// Error types
export interface AppError extends Error {
  code: string;
  status: number;
  details?: unknown;
}

export class ValidationError extends Error implements AppError {
  code: string;
  status: number;
  details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "ValidationError";
    this.code = ERROR_CODES.VALIDATION_ERROR;
    this.status = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    this.details = details;
  }
}

export class UnauthorizedError extends Error implements AppError {
  code: string;
  status: number;

  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.code = ERROR_CODES.UNAUTHORIZED;
    this.status = HTTP_STATUS.UNAUTHORIZED;
  }
}

export class NotFoundError extends Error implements AppError {
  code: string;
  status: number;

  constructor(resource: string = "Resource") {
    super(`${resource} not found`);
    this.name = "NotFoundError";
    this.code = ERROR_CODES.NOT_FOUND;
    this.status = HTTP_STATUS.NOT_FOUND;
  }
}

export class ConflictError extends Error implements AppError {
  code: string;
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
    this.code = ERROR_CODES.CONFLICT;
    this.status = HTTP_STATUS.CONFLICT;
  }
}

export class InternalError extends Error implements AppError {
  code: string;
  status: number;

  constructor(message: string = "Internal server error") {
    super(message);
    this.name = "InternalError";
    this.code = ERROR_CODES.INTERNAL_ERROR;
    this.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  }
}
