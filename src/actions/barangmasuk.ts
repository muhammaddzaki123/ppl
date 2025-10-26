"use server";

import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

const BahanMasukSchema = z.object({
  bahanMakananId: z.string().min(1, "Bahan makanan tidak boleh kosong"),
  jumlah: z.coerce.number().int().min(1, "Jumlah harus lebih dari 0"),
  tanggalMasuk: z.coerce.date(),
});

export async function getBahanMasuk() {
  return await prisma.bahanMasuk.findMany({
    include: {
      bahanMakanan: true,
    },
  });
}

export async function addBahanMasuk(formData: FormData) {
  const validatedFields = BahanMasukSchema.safeParse({
    bahanMakananId: formData.get("bahanMakananId"),
    jumlah: formData.get("jumlah"),
    tanggalMasuk: formData.get("tanggalMasuk"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { bahanMakananId, jumlah } = validatedFields.data;
    await prisma.$transaction([
      prisma.bahanMasuk.create({
        data: validatedFields.data,
      }),
      prisma.bahanMakanan.update({
        where: { id: bahanMakananId },
        data: {
          stok: {
            increment: jumlah,
          },
        },
      }),
    ]);
    revalidatePath("/admin/barangmasuk");
    revalidatePath("/admin/databarang");
    return { message: "Data berhasil ditambahkan" };
  } catch (error) {
    return { message: "Gagal menambahkan data" };
  }
}

export async function updateBahanMasuk(id: string, formData: FormData) {
  const validatedFields = BahanMasukSchema.safeParse({
    bahanMakananId: formData.get("bahanMakananId"),
    jumlah: formData.get("jumlah"),
    tanggalMasuk: formData.get("tanggalMasuk"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { bahanMakananId, jumlah } = validatedFields.data;
    const bahanMasuk = await prisma.bahanMasuk.findUnique({ where: { id } });
    if (!bahanMasuk) {
      return { message: "Data tidak ditemukan" };
    }
    await prisma.$transaction([
      prisma.bahanMakanan.update({
        where: { id: bahanMasuk.bahanMakananId },
        data: {
          stok: {
            decrement: bahanMasuk.jumlah,
          },
        },
      }),
      prisma.bahanMakanan.update({
        where: { id: bahanMakananId },
        data: {
          stok: {
            increment: jumlah,
          },
        },
      }),
      prisma.bahanMasuk.update({
        where: { id },
        data: validatedFields.data,
      }),
    ]);
    revalidatePath("/admin/barangmasuk");
    revalidatePath("/admin/databarang");
    return { message: "Data berhasil diubah" };
  } catch (error) {
    return { message: "Gagal mengubah data" };
  }
}

export async function deleteBahanMasuk(id: string) {
  try {
    const bahanMasuk = await prisma.bahanMasuk.findUnique({ where: { id } });
    if (!bahanMasuk) {
      return { message: "Data tidak ditemukan" };
    }
    await prisma.$transaction([
      prisma.bahanMakanan.update({
        where: { id: bahanMasuk.bahanMakananId },
        data: {
          stok: {
            decrement: bahanMasuk.jumlah,
          },
        },
      }),
      prisma.bahanMasuk.delete({
        where: { id },
      }),
    ]);
    revalidatePath("/admin/barangmasuk");
    revalidatePath("/admin/databarang");
    return { message: "Data berhasil dihapus" };
  } catch (error) {
    return { message: "Gagal menghapus data" };
  }
}
