import { prisma } from "@/app/database/client";

export async function validateEmailVerificationToken(token: string) {
  const tokenRecord = await prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    return null;
  }

  return tokenRecord;
}

export async function validatePasswordResetToken(token: string) {
  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    return null;
  }

  return tokenRecord;
}
