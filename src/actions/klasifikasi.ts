"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createKlasifikasi(formData: FormData) {
  const nama = formData.get("nama") as string;
  await prisma.klasifikasi.create({
    data: {
      nama,
    },
  });
  revalidatePath("/admin/settings/klasifikasi");
}

export async function updateKlasifikasi(id: string, formData: FormData) {
  const nama = formData.get("nama") as string;
  await prisma.klasifikasi.update({
    where: { id },
    data: {
      nama,
    },
  });
  revalidatePath("/admin/settings/klasifikasi");
}

export async function deleteKlasifikasi(id: string) {
  await prisma.klasifikasi.delete({
    where: { id },
  });
  revalidatePath("/admin/settings/klasifikasi");
}

export async function createSpesifikasi(formData: FormData) {
  const bahan = formData.get("bahan") as string;
  const satuan = formData.get("satuan") as string;
  const spesifikasi = formData.get("spesifikasi") as string;
  const klasifikasiId = formData.get("klasifikasiId") as string;

  await prisma.spesifikasiBahan.create({
    data: {
      bahan,
      satuan,
      spesifikasi,
      klasifikasiId,
    },
  });
  revalidatePath("/admin/settings/klasifikasi");
}

export async function updateSpesifikasi(id: string, formData: FormData) {
  const bahan = formData.get("bahan") as string;
  const satuan = formData.get("satuan") as string;
  const spesifikasi = formData.get("spesifikasi") as string;

  await prisma.spesifikasiBahan.update({
    where: { id },
    data: {
      bahan,
      satuan,
      spesifikasi,
    },
  });
  revalidatePath("/admin/settings/klasifikasi");
}

export async function deleteSpesifikasi(id: string) {
  await prisma.spesifikasiBahan.delete({
    where: { id },
  });
  revalidatePath("/admin/settings/klasifikasi");
}
