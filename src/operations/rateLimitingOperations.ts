import { prisma } from "@/app/database/client";

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

const EMAIL_RATE_LIMITS: Record<string, RateLimitConfig> = {
  verification: { maxAttempts: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
  passwordReset: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
};

export async function checkEmailRateLimit(
  email: string,
  type: "verification" | "passwordReset",
): Promise<{ allowed: boolean; remainingAttempts: number; resetTime: Date }> {
  const config = EMAIL_RATE_LIMITS[type];
  const windowStart = new Date(Date.now() - config.windowMs);

  const attempts = await prisma.emailRateLimit.findMany({
    where: {
      email,
      type,
      createdAt: {
        gte: windowStart,
      },
    },
  });

  const remainingAttempts = Math.max(0, config.maxAttempts - attempts.length);
  const allowed = remainingAttempts > 0;

  if (allowed) {
    await prisma.emailRateLimit.create({
      data: {
        email,
        type,
        ipAddress: "unknown", // Will be set by middleware
      },
    });
  }

  const resetTime = new Date(Date.now() + config.windowMs);

  return {
    allowed,
    remainingAttempts,
    resetTime,
  };
}

export async function cleanupExpiredRateLimits(): Promise<void> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  await prisma.emailRateLimit.deleteMany({
    where: {
      createdAt: {
        lt: oneDayAgo,
      },
    },
  });
}
