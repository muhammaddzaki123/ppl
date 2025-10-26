// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";
// import Credentials from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials.password) {
//           return null;
//         }

//         const admin = await prisma.admin.findUnique({
//           where: { email: credentials.email as string },
//         });

//         if (!admin || !bcrypt.compareSync(credentials.password as string, admin.password)) {
//           return null;
//         }

//         return { id: admin.id, name: admin.name, email: admin.email };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/login",
//   },
// });
