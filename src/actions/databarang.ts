"use server";

import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

const BahanMakananSchema = z.object({
  kode: z.string().min(1, "Kode tidak boleh kosong"),
  nama: z.string().min(1, "Nama tidak boleh kosong"),
  satuan: z.string().min(1, "Satuan tidak boleh kosong"),
});

export async function getBahanMakanan() {
  return await prisma.bahanMakanan.findMany();
}

export async function addBahanMakanan(formData: FormData) {
  const validatedFields = BahanMakananSchema.safeParse({
    kode: formData.get("kode"),
    nama: formData.get("nama"),
    satuan: formData.get("satuan"),
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
  const validatedFields = BahanMakananSchema.safeParse({
    kode: formData.get("kode"),
    nama: formData.get("nama"),
    satuan: formData.get("satuan"),
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
    return { message: "Gagal menghapus data" };
  }
}
