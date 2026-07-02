-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Resource_published_idx" ON "Resource"("published");
