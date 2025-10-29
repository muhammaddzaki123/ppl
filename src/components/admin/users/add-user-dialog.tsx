"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { UserForm } from "@/components/admin/users/user-form";

export function AddUserDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
        {/* UserForm akan memanggil Server Action,
            dan Server Action yang akan memanggil revalidatePath.
            Setelah selesai, UserForm akan memanggil onSuccess. */}
        <UserForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}