/*
  Warnings:

  - You are about to drop the column `satuan` on the `bahan_makanan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."bahan_makanan" DROP COLUMN "satuan",
ADD COLUMN     "satuan_id" UUID,
ADD COLUMN     "stok" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."satuans" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "satuans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "satuans_nama_key" ON "public"."satuans"("nama");

-- AddForeignKey
ALTER TABLE "public"."bahan_makanan" ADD CONSTRAINT "bahan_makanan_satuan_id_fkey" FOREIGN KEY ("satuan_id") REFERENCES "public"."satuans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
