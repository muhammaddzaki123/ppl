"use server";

import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

const BahanKeluarSchema = z.object({
  bahanMakananId: z.string().min(1, "Bahan makanan tidak boleh kosong"),
  jumlah: z.coerce.number().int().min(1, "Jumlah harus lebih dari 0"),
  tanggalKeluar: z.coerce.date(),
});

export async function getBahanKeluar() {
  return await prisma.bahanKeluar.findMany({
    include: {
      bahanMakanan: true,
    },
  });
}

export async function addBahanKeluar(formData: FormData) {
  const validatedFields = BahanKeluarSchema.safeParse({
    bahanMakananId: formData.get("bahanMakananId"),
    jumlah: formData.get("jumlah"),
    tanggalKeluar: formData.get("tanggalKeluar"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { bahanMakananId, jumlah } = validatedFields.data;
    const bahanMakanan = await prisma.bahanMakanan.findUnique({
      where: { id: bahanMakananId },
    });
    if (!bahanMakanan || bahanMakanan.stok < jumlah) {
      return { message: "Stok tidak mencukupi" };
    }
    await prisma.$transaction([
      prisma.bahanKeluar.create({
        data: validatedFields.data,
      }),
      prisma.bahanMakanan.update({
        where: { id: bahanMakananId },
        data: {
          stok: {
            decrement: jumlah,
          },
        },
      }),
    ]);
    revalidatePath("/admin/barangkeluar");
    revalidatePath("/admin/databarang");
    return { message: "Data berhasil ditambahkan" };
  } catch {
    return { message: "Gagal menambahkan data" };
  }
}

export async function updateBahanKeluar(id: string, formData: FormData) {
  const validatedFields = BahanKeluarSchema.safeParse({
    bahanMakananId: formData.get("bahanMakananId"),
    jumlah: formData.get("jumlah"),
    tanggalKeluar: formData.get("tanggalKeluar"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { bahanMakananId, jumlah } = validatedFields.data;
    const bahanKeluar = await prisma.bahanKeluar.findUnique({
      where: { id },
    });
    if (!bahanKeluar) {
      return { message: "Data tidak ditemukan" };
    }
    const bahanMakanan = await prisma.bahanMakanan.findUnique({
      where: { id: bahanMakananId },
    });
    if (
      !bahanMakanan ||
      bahanMakanan.stok + bahanKeluar.jumlah < jumlah
    ) {
      return { message: "Stok tidak mencukupi" };
    }
    await prisma.$transaction([
      prisma.bahanMakanan.update({
        where: { id: bahanKeluar.bahanMakananId },
        data: {
          stok: {
            increment: bahanKeluar.jumlah,
          },
        },
      }),
      prisma.bahanMakanan.update({
        where: { id: bahanMakananId },
        data: {
          stok: {
            decrement: jumlah,
          },
        },
      }),
      prisma.bahanKeluar.update({
        where: { id },
        data: validatedFields.data,
      }),
    ]);
    revalidatePath("/admin/barangkeluar");
    revalidatePath("/admin/databarang");
    return { message: "Data berhasil diubah" };
  } catch {
    return { message: "Gagal mengubah data" };
  }
}

export async function deleteBahanKeluar(id: string) {
  try {
    const bahanKeluar = await prisma.bahanKeluar.findUnique({
      where: { id },
    });
    if (!bahanKeluar) {
      return { message: "Data tidak ditemukan" };
    }
    await prisma.$transaction([
      prisma.bahanMakanan.update({
        where: { id: bahanKeluar.bahanMakananId },
        data: {
          stok: {
            increment: bahanKeluar.jumlah,
          },
        },
      }),
      prisma.bahanKeluar.delete({
        where: { id },
      }),
    ]);
    revalidatePath("/admin/barangkeluar");
    revalidatePath("/admin/databarang");
    return { message: "Data berhasil dihapus" };
  } catch {
    return { message: "Gagal menghapus data" };
  }
}
