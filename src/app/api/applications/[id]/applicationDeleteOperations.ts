import { prisma } from "@/app/database/client";
import { NotFoundError } from "@/validators/apiErrorTypes";
import { createSuccessResponse } from "@/validators/apiResponseFormatter";

export async function removeApplication(applicationId: string, userId: string) {
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId: userId,
    },
  });

  if (!application) {
    throw new NotFoundError("Application not found");
  }

  // Delete the application (categories, domains, and checks will be deleted automatically via cascade)
  await prisma.application.delete({
    where: {
      id: applicationId,
    },
  });

  return createSuccessResponse(null, "Application deleted successfully");
}
