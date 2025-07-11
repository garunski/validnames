/*
  Warnings:

  - You are about to drop the column `userId` on the `email_rate_limits` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "email_rate_limits" DROP CONSTRAINT "email_rate_limits_userId_fkey";

-- AlterTable
ALTER TABLE "email_rate_limits" DROP COLUMN "userId";
