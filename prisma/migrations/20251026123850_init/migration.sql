/*
  Warnings:

  - You are about to drop the column `role` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deliveries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `partners` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_variants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vouchers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."deliveries" DROP CONSTRAINT "deliveries_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_details" DROP CONSTRAINT "order_details_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_details" DROP CONSTRAINT "order_details_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_voucher_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_images" DROP CONSTRAINT "product_images_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_variants" DROP CONSTRAINT "product_variants_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_partner_id_fkey";

-- AlterTable
ALTER TABLE "public"."admins" DROP COLUMN "role";

-- DropTable
DROP TABLE "public"."categories";

-- DropTable
DROP TABLE "public"."deliveries";

-- DropTable
DROP TABLE "public"."order_details";

-- DropTable
DROP TABLE "public"."orders";

-- DropTable
DROP TABLE "public"."partners";

-- DropTable
DROP TABLE "public"."payments";

-- DropTable
DROP TABLE "public"."product_images";

-- DropTable
DROP TABLE "public"."product_variants";

-- DropTable
DROP TABLE "public"."products";

-- DropTable
DROP TABLE "public"."vouchers";

-- DropEnum
DROP TYPE "public"."DiscountType";

-- DropEnum
DROP TYPE "public"."Role";

-- CreateTable
CREATE TABLE "public"."bahan_makanan" (
    "id" UUID NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bahan_makanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bahan_masuk" (
    "id" UUID NOT NULL,
    "bahan_makanan_id" UUID NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "tanggal_masuk" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bahan_masuk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bahan_keluar" (
    "id" UUID NOT NULL,
    "bahan_makanan_id" UUID NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "tanggal_keluar" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bahan_keluar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bahan_makanan_kode_key" ON "public"."bahan_makanan"("kode");

-- AddForeignKey
ALTER TABLE "public"."bahan_masuk" ADD CONSTRAINT "bahan_masuk_bahan_makanan_id_fkey" FOREIGN KEY ("bahan_makanan_id") REFERENCES "public"."bahan_makanan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bahan_keluar" ADD CONSTRAINT "bahan_keluar_bahan_makanan_id_fkey" FOREIGN KEY ("bahan_makanan_id") REFERENCES "public"."bahan_makanan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
