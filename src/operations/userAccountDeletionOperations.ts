/**
 * Performs the actual user deletion
 * @param userId - The user ID to delete
 */
export async function performUserDeletion(userId: string): Promise<void> {
  const { prisma } = await import("@/app/database/client");

  // Delete all user data in the correct order to respect foreign key constraints
  await prisma.$transaction(async (tx) => {
    // Delete checks (domain availability results)
    await tx.check.deleteMany({
      where: {
        domain: {
          category: {
            application: {
              userId,
            },
          },
        },
      },
    });

    // Delete domains
    await tx.domain.deleteMany({
      where: {
        category: {
          application: {
            userId,
          },
        },
      },
    });

    // Delete categories
    await tx.category.deleteMany({
      where: {
        application: {
          userId,
        },
      },
    });

    // Delete applications
    await tx.application.deleteMany({
      where: { userId },
    });

    // Delete user settings
    await tx.userSettings.deleteMany({
      where: { userId },
    });

    // Delete email verification tokens
    await tx.emailVerificationToken.deleteMany({
      where: { userId },
    });

    // Delete password reset tokens
    await tx.passwordResetToken.deleteMany({
      where: { userId },
    });

    // Delete email rate limits
    await tx.emailRateLimit.deleteMany({
      where: { email: { startsWith: userId } }, // This might need adjustment based on your email format
    });

    // Finally, delete the user
    await tx.user.delete({
      where: { id: userId },
    });
  });
}
