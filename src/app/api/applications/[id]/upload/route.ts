import { getCurrentUser } from "@/app/api/auth/authOperations";
import { prisma } from "@/app/database/client";
import { NextRequest, NextResponse } from "next/server";

// Simple inline types for upload data - TypeScript can infer these
type UploadData = {
  categories: {
    id: string;
    name: string;
    description?: string;
    domains: string[];
  }[];
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify application belongs to user
    const application = await prisma.application.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileContent = await file.text();
    let uploadData: UploadData;

    try {
      uploadData = JSON.parse(fileContent);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 },
      );
    }

    if (!uploadData.categories || !Array.isArray(uploadData.categories)) {
      return NextResponse.json(
        { error: "Invalid file format: categories array required" },
        { status: 400 },
      );
    }

    let categoriesProcessed = 0;
    let domainsProcessed = 0;

    // Process each category
    for (const categoryData of uploadData.categories) {
      if (
        !categoryData.name ||
        !categoryData.domains ||
        !Array.isArray(categoryData.domains)
      ) {
        continue; // Skip invalid categories
      }

      // Create or update category
      await prisma.category.upsert({
        where: {
          applicationId_name: {
            applicationId: id,
            name: categoryData.name,
          },
        },
        update: {
          description: categoryData.description,
        },
        create: {
          name: categoryData.name,
          description: categoryData.description,
          applicationId: id,
        },
      });

      categoriesProcessed++;

      // Process domains for this category
      for (const domainName of categoryData.domains) {
        if (typeof domainName !== "string" || !domainName.trim()) {
          continue; // Skip invalid domain names
        }

        await prisma.domain.upsert({
          where: {
            name_categoryId: {
              name: domainName.trim(),
              categoryId:
                (
                  await prisma.category.findUnique({
                    where: {
                      applicationId_name: {
                        applicationId: id,
                        name: categoryData.name,
                      },
                    },
                  })
                )?.id || "",
            },
          },
          update: {},
          create: {
            name: domainName.trim(),
            categoryId:
              (
                await prisma.category.findUnique({
                  where: {
                    applicationId_name: {
                      applicationId: id,
                      name: categoryData.name,
                    },
                  },
                })
              )?.id || "",
          },
        });

        domainsProcessed++;
      }
    }

    return NextResponse.json({
      message: "File processed successfully",
      stats: {
        categoriesProcessed,
        domainsProcessed,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 },
    );
  }
}
