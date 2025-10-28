-- CreateTable
CREATE TABLE "public"."klasifikasis" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "klasifikasis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."spesifikasi_bahans" (
    "id" UUID NOT NULL,
    "bahan" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "spesifikasi" TEXT NOT NULL,
    "klasifikasi_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spesifikasi_bahans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."spesifikasi_bahans" ADD CONSTRAINT "spesifikasi_bahans_klasifikasi_id_fkey" FOREIGN KEY ("klasifikasi_id") REFERENCES "public"."klasifikasis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
