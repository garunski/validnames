import { NextResponse } from "next/server";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./apiErrorTypes";

export function handleError(error: unknown): NextResponse {
  console.error("API Error:", error);

  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.details,
      },
      { status: 400 },
    );
  }

  if (error instanceof UnauthorizedError) {
    // Return the actual error message, not just 'Unauthorized'
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof ConflictError) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  // Handle Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string };

    switch (prismaError.code) {
      case "P2002":
        return NextResponse.json(
          { error: "Resource already exists" },
          { status: 409 },
        );
      case "P2025":
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 },
        );
      case "P2003":
        return NextResponse.json(
          { error: "Referenced resource not found" },
          { status: 400 },
        );
    }
  }

  // Default error response
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
