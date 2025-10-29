"use client";

import { useEffect, useState } from "react";
import { getUsers, User } from "@/actions/user";
import { DataTable } from "@/components/admin/shared/table";
import { columns } from "@/components/admin/users/columns";
import { UserTableSkeleton } from "@/components/admin/users/skeletons";
import { toast } from "sonner";

export function UserClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const userList = await getUsers();
        setUsers(userList);
      } catch (error) {
        toast.error("Gagal memuat data user.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return <UserTableSkeleton />;
  }

  return <DataTable columns={columns} data={users} />;
}