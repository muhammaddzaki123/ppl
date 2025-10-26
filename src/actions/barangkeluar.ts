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
    await prisma.bahanKeluar.create({
      data: validatedFields.data,
    });
    revalidatePath("/admin/barangkeluar");
    return { message: "Data berhasil ditambahkan" };
  } catch (error) {
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
    await prisma.bahanKeluar.update({
      where: { id },
      data: validatedFields.data,
    });
    revalidatePath("/admin/barangkeluar");
    return { message: "Data berhasil diubah" };
  } catch (error) {
    return { message: "Gagal mengubah data" };
  }
}

export async function deleteBahanKeluar(id: string) {
  try {
    await prisma.bahanKeluar.delete({
      where: { id },
    });
    revalidatePath("/admin/barangkeluar");
    return { message: "Data berhasil dihapus" };
  } catch (error) {
    return { message: "Gagal menghapus data" };
  }
}
