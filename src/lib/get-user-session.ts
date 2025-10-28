import "server-only";

import db from "@/lib/prisma";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function getUserSession() {
  const token = await getAuthCookie();
  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }

  const user = await db.admin.findUnique({
    where: {
      id: payload.sub,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}
