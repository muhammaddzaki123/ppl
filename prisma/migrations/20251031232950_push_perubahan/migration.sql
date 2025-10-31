-- AlterTable
ALTER TABLE "public"."bahan_keluar" ALTER COLUMN "jumlah" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."bahan_makanan" ALTER COLUMN "stok" SET DEFAULT 0,
ALTER COLUMN "stok" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."bahan_masuk" ALTER COLUMN "jumlah" SET DATA TYPE DOUBLE PRECISION;
