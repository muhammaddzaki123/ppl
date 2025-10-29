import { getUserSession } from "@/lib/get-user-session";
import AdminClientLayout from "./admin-client-layout";
import React from "react";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserSession();

  if (!user) {
    redirect("/login");
  }

  return <AdminClientLayout user={user}>{children}</AdminClientLayout>;
}
