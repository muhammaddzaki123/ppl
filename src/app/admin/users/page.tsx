import { PageHeader } from "@/components/admin/page-header";
import { AddUserDialog } from "@/components/admin/users/add-user-dialog";
import { UserClient } from "@/components/admin/users/user-client";

export default function UsersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <PageHeader
        title="Users"
        description="Kelola akun administrator dan peran."
        actions={<AddUserDialog />}
      />
      <UserClient />
    </div>
  );
}