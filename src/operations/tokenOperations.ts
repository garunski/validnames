import { prisma } from "@/app/database/client";
import { randomBytes } from "crypto";

export async function generateEmailVerificationToken(
  userId: string,
): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.emailVerificationToken.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

export async function generatePasswordResetToken(
  userId: string,
): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.passwordResetToken.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

/**
 * Cleans up expired tokens from the database
 * This should be called periodically (e.g., via cron job)
 */
export async function cleanupExpiredTokens(): Promise<void> {
  const now = new Date();

  await Promise.all([
    prisma.emailVerificationToken.deleteMany({
      where: { expiresAt: { lt: now } },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: now } },
    }),
  ]);
}
