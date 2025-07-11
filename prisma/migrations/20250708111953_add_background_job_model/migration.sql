-- CreateTable
CREATE TABLE "BackgroundJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "categoryId" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "progress" INTEGER NOT NULL,
    "message" TEXT,
    "error" TEXT,
    "batchId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "BackgroundJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BackgroundJob_userId_idx" ON "BackgroundJob"("userId");

-- CreateIndex
CREATE INDEX "BackgroundJob_applicationId_idx" ON "BackgroundJob"("applicationId");

-- CreateIndex
CREATE INDEX "BackgroundJob_categoryId_idx" ON "BackgroundJob"("categoryId");
