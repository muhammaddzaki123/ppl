"use server";

import { z } from "zod";
import { PrismaClient, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

const BahanMakananSchema = z.object({
  kode: z.string().min(1, "Kode tidak boleh kosong"),
  nama: z.string().min(1, "Nama tidak boleh kosong"),
  satuanId: z.string().min(1, "Satuan tidak boleh kosong"),
  stok: z.coerce.number().int().min(0, "Stok tidak boleh negatif"),
});

const UpdateBahanMakananSchema = BahanMakananSchema.omit({ stok: true });

export async function getBahanMakanan() {
  return await prisma.bahanMakanan.findMany({
    include: {
      satuan: true,
    },
  });
}

export async function addBahanMakanan(formData: FormData) {
  const validatedFields = BahanMakananSchema.safeParse({
    kode: formData.get("kode"),
    nama: formData.get("nama"),
    satuanId: formData.get("satuanId"),
    stok: formData.get("stok"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.bahanMakanan.create({
      data: validatedFields.data,
    });
    revalidatePath("/admin/databarang");
    return { message: "Data berhasil ditambahkan" };
  } catch (error) {
    return { message: "Gagal menambahkan data" };
  }
}

export async function updateBahanMakanan(id: string, formData: FormData) {
  const validatedFields = UpdateBahanMakananSchema.safeParse({
    kode: formData.get("kode"),
    nama: formData.get("nama"),
    satuanId: formData.get("satuanId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.bahanMakanan.update({
      where: { id },
      data: validatedFields.data,
    });
    revalidatePath("/admin/databarang");
    return { message: "Data berhasil diubah" };
  } catch (error) {
    return { message: "Gagal mengubah data" };
  }
}

export async function deleteBahanMakanan(id: string) {
  try {
    await prisma.bahanMakanan.delete({
      where: { id },
    });
    revalidatePath("/admin/databarang");
    return { message: "Data berhasil dihapus" };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        message:
          "Gagal menghapus data karena masih digunakan di data barang masuk/keluar",
      };
    }
    return { message: "Gagal menghapus data" };
  }
}

export async function getBahanMakananWithStockHistory(
  month: number,
  year: number
) {
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const bahanMakanans = await prisma.bahanMakanan.findMany({
    include: {
      satuan: true,
    },
  });

  const bahanMasukAfter = await prisma.bahanMasuk.findMany({
    where: {
      tanggalMasuk: {
        gt: endDate,
      },
    },
  });

  const bahanKeluarAfter = await prisma.bahanKeluar.findMany({
    where: {
      tanggalKeluar: {
        gt: endDate,
      },
    },
  });

  const stockHistory = bahanMakanans.map((bahan) => {
    let stokAkhir = bahan.stok;

    bahanMasukAfter.forEach((masuk) => {
      if (masuk.bahanMakananId === bahan.id) {
        stokAkhir -= masuk.jumlah;
      }
    });

    bahanKeluarAfter.forEach((keluar) => {
      if (keluar.bahanMakananId === bahan.id) {
        stokAkhir += keluar.jumlah;
      }
    });

    return {
      ...bahan,
      stokAkhir,
      tanggal: endDate.toISOString(),
    };
  });

  return stockHistory;
}

