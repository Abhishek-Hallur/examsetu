-- CreateTable
CREATE TABLE "UserDownload" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDownload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserView" (
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserView_pkey" PRIMARY KEY ("userId","resourceId")
);

-- CreateIndex
CREATE INDEX "UserDownload_userId_idx" ON "UserDownload"("userId");

-- CreateIndex
CREATE INDEX "UserDownload_resourceId_idx" ON "UserDownload"("resourceId");

-- CreateIndex
CREATE INDEX "UserView_userId_idx" ON "UserView"("userId");

-- AddForeignKey
ALTER TABLE "UserDownload" ADD CONSTRAINT "UserDownload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDownload" ADD CONSTRAINT "UserDownload_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserView" ADD CONSTRAINT "UserView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserView" ADD CONSTRAINT "UserView_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
