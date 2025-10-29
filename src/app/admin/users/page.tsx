"use client";

import { getUsers } from "@/actions/user";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/shared/table";
import { columns } from "@/components/admin/users/columns";
import { Suspense } from "react";
import { UserTableSkeleton } from "@/components/admin/users/skeletons";
import { AddUserDialog } from "@/components/admin/users/add-user-dialog";

async function UsersTable() {
  const users = await getUsers();
  return <DataTable columns={columns} data={users} />;
}

export default function UsersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <PageHeader
        title="Users"
        description="Kelola akun administrator dan peran."
        actions={<AddUserDialog />}
      />
      <Suspense fallback={<UserTableSkeleton />}>
        <UsersTable />
      </Suspense>
    </div>
  );
}
