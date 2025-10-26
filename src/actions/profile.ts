// "use server";

// import { z } from "zod";
// import { PrismaClient } from "@prisma/client";
// import { revalidatePath } from "next/cache";
// import { auth } from "@/auth"; // Asumsi Anda memiliki sistem otentikasi
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// const ProfileSchema = z.object({
//   name: z.string().min(1, "Nama tidak boleh kosong"),
// });

// const PasswordSchema = z.object({
//   currentPassword: z.string().min(1, "Kata sandi saat ini tidak boleh kosong"),
//   newPassword: z.string().min(6, "Kata sandi baru minimal 6 karakter"),
// });

// export async function getAdminProfile() {
//   const session = await auth();
//   if (!session?.user?.email) {
//     return null;
//   }
//   return await prisma.admin.findUnique({
//     where: { email: session.user.email },
//   });
// }

// export async function updateAdminProfile(formData: FormData) {
//   const session = await auth();
//   if (!session?.user?.email) {
//     return { message: "Not authenticated" };
//   }

//   const validatedFields = ProfileSchema.safeParse({
//     name: formData.get("name"),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//     };
//   }

//   try {
//     await prisma.admin.update({
//       where: { email: session.user.email },
//       data: { name: validatedFields.data.name },
//     });
//     revalidatePath("/admin/profile");
//     return { message: "Profil berhasil diperbarui" };
//   } catch (error) {
//     return { message: "Gagal memperbarui profil" };
//   }
// }

// export async function changePassword(formData: FormData) {
//   const session = await auth();
//   if (!session?.user?.email) {
//     return { message: "Not authenticated" };
//   }

//   const validatedFields = PasswordSchema.safeParse({
//     currentPassword: formData.get("currentPassword"),
//     newPassword: formData.get("newPassword"),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//     };
//   }

//   const admin = await prisma.admin.findUnique({
//     where: { email: session.user.email },
//   });

//   if (!admin) {
//     return { message: "Admin tidak ditemukan" };
//   }

//   const isPasswordValid = await bcrypt.compare(
//     validatedFields.data.currentPassword,
//     admin.password
//   );

//   if (!isPasswordValid) {
//     return { message: "Kata sandi saat ini salah" };
//   }

//   const hashedPassword = await bcrypt.hash(validatedFields.data.newPassword, 10);

//   try {
//     await prisma.admin.update({
//       where: { email: session.user.email },
//       data: { password: hashedPassword },
//     });
//     return { message: "Kata sandi berhasil diubah" };
//   } catch (error) {
//     return { message: "Gagal mengubah kata sandi" };
//   }
// }
