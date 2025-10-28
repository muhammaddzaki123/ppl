"use server";

import { z } from "zod";
import { PrismaClient, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

const SatuanSchema = z.object({
  nama: z.string().min(1, "Nama tidak boleh kosong"),
});

export async function getSatuans() {
  return await prisma.satuan.findMany();
}

export async function addSatuan(formData: FormData) {
  const validatedFields = SatuanSchema.safeParse({
    nama: formData.get("nama"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.satuan.create({
      data: validatedFields.data,
    });
    revalidatePath("/admin/settings/satuan");
    return { message: "Satuan berhasil ditambahkan" };
  } catch (error) {
    return { message: "Gagal menambahkan satuan" };
  }
}

export async function updateSatuan(id: string, formData: FormData) {
  const validatedFields = SatuanSchema.safeParse({
    nama: formData.get("nama"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.satuan.update({
      where: { id },
      data: validatedFields.data,
    });
    revalidatePath("/admin/settings/satuan");
    return { message: "Satuan berhasil diubah" };
  } catch (error) {
    return { message: "Gagal mengubah satuan" };
  }
}

export async function deleteSatuan(id: string) {
  try {
    await prisma.satuan.delete({
      where: { id },
    });
    revalidatePath("/admin/settings/satuan");
    return { message: "Satuan berhasil dihapus" };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        message:
          "Gagal menghapus satuan karena masih digunakan di data barang",
      };
    }
    return { message: "Gagal menghapus satuan" };
  }
}
