import { getUserSession } from "@/lib/get-user-session";
import AdminClientLayout from "./admin-client-layout";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserSession();
  return <AdminClientLayout user={user}>{children}</AdminClientLayout>;
}
