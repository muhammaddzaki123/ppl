"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

const UserSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
});

const AddUserSchema = UserSchema.extend({
  password: z.string().min(8, "Password minimal 8 karakter"),
});

const UpdatePasswordSchema = z
  .object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type State<T = Record<string, string[] | undefined>> = {
  status: string;
  message: string;
  errors?: T;
};

export async function getUsers() {
  try {
    const users = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export type User = Prisma.PromiseReturnType<typeof getUsers>[number];

export async function addUser(prevState: State, formData: FormData) {
  const validatedFields = AddUserSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Validasi gagal",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.admin.findUnique({ where: { email } });
    if (existingUser) {
      return {
        status: "error",
        message: "Email sudah digunakan.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    revalidatePath("/admin/users");
    return {
      status: "success",
      message: "User berhasil ditambahkan.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Gagal menambahkan user.",
    };
  }
}

export async function updateUser(id: string, prevState: State, formData: FormData) {
  const validatedFields = UserSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Validasi gagal",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email } = validatedFields.data;

  try {
    const existingUser = await prisma.admin.findFirst({
      where: { email, id: { not: id } },
    });

    if (existingUser) {
      return {
        status: "error",
        message: "Email sudah digunakan oleh user lain.",
      };
    }

    await prisma.admin.update({
      where: { id },
      data: { name, email },
    });

    revalidatePath("/admin/users");
    return {
      status: "success",
      message: "User berhasil diperbarui.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Gagal memperbarui user.",
    };
  }
}

export async function updatePassword(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdatePasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Validasi gagal",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { password } = validatedFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.update({
      where: { id },
      data: { password: hashedPassword },
    });

    revalidatePath("/admin/users");
    return {
      status: "success",
      message: "Password berhasil diperbarui.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Gagal memperbarui password.",
    };
  }
}

export async function deleteUser(id: string) {
  try {
    // Optional: Add a check to prevent deleting the last superadmin, for example.
    const userToDelete = await prisma.admin.findUnique({ where: { id } });
    if (!userToDelete) {
      return { status: "error", message: "User tidak ditemukan." };
    }
    // Add any other business logic checks here.

    await prisma.admin.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
    return {
      status: "success",
      message: "User berhasil dihapus.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Gagal menghapus user.",
    };
  }
}