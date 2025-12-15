import { getCurrentUser } from "@/app/api/auth/authOperations";
import { initiateDeletionSchema } from "@/validators/userDeletionSchemas";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/user/delete
 * Delete user account immediately
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = initiateDeletionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.issues,
        },
        { status: 400 },
      );
    }

    // Import the deletion function
    const { performUserDeletion } = await import(
      "@/operations/userDeletionOperations"
    );

    try {
      await performUserDeletion(user.id);
      return NextResponse.json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      console.error("Error performing deletion:", error);
      return NextResponse.json(
        { error: "Failed to delete account" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
