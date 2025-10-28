import { getUsers } from "@/actions/user";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/shared/table";
import { columns } from "@/components/admin/users/columns";
import { UserForm } from "@/components/admin/users/user-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Suspense } from "react";
import { UserTableSkeleton } from "@/components/admin/users/skeletons";

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
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah User Baru</DialogTitle>
              </DialogHeader>
              <UserForm
                onSuccess={() => {
                  // In a real app, you might want to close the dialog here.
                  // This can be handled with state management if DialogTrigger is not sufficient.
                }}
              />
            </DialogContent>
          </Dialog>
        }
      />
      <Suspense fallback={<UserTableSkeleton />}>
        <UsersTable />
      </Suspense>
    </div>
  );
}
