import { getCurrentUser } from "@/app/api/auth/authOperations";
import { exportUserData } from "@/operations/userDeletionOperations";
import { dataExportSchema } from "@/validators/userDeletionSchemas";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/user/export
 * Export user data for GDPR compliance
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = dataExportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.errors,
        },
        { status: 400 },
      );
    }

    const exportOptions = validation.data;

    // Export user data
    const exportedData = await exportUserData(user.id, exportOptions);

    // Format response for JSON export
    const responseData = JSON.stringify(exportedData, null, 2);
    const contentType = "application/json";
    const filename = `user-data-${user.id}-${new Date().toISOString().split("T")[0]}.json`;

    // Create response with appropriate headers
    const response = new NextResponse(responseData);
    response.headers.set("Content-Type", contentType);
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${filename}"`,
    );

    return response;
  } catch (error) {
    console.error("Error exporting user data:", error);
    return NextResponse.json(
      { error: "Failed to export user data" },
      { status: 500 },
    );
  }
}
