-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Note_itemId_idx" ON "Note"("itemId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DataMigration: carry any existing Item.note text over into its own Note row
INSERT INTO "Note" ("id", "itemId", "text", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "id", "note", "updatedAt", "updatedAt"
FROM "Item"
WHERE "note" IS NOT NULL AND length(trim("note")) > 0;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "note";
