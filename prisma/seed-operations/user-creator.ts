import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function createTestUser(prisma: PrismaClient) {
  const hashedPassword = await bcrypt.hash("password123", 10);
  return await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      passwordHash: hashedPassword,
      name: "Test User",
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });
}
