"use client";

import { deleteSpesifikasi } from "@/actions/klasifikasi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SpesifikasiBahan } from "@prisma/client";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { EditSpesifikasiForm } from "./edit-spesifikasi-form";

interface SpesifikasiTableProps {
  spesifikasis: SpesifikasiBahan[];
}

export function SpesifikasiTable({ spesifikasis }: SpesifikasiTableProps) {
  if (spesifikasis.length === 0) {
    return <p className="text-sm text-gray-500">Belum ada data spesifikasi.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Bahan</TableHead>
          <TableHead>Satuan</TableHead>
          <TableHead>Spesifikasi Bahan Makanan</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {spesifikasis.map((spesifikasi, index) => (
          <SpesifikasiTableRow
            key={spesifikasi.id}
            spesifikasi={spesifikasi}
            index={index}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function SpesifikasiTableRow({
  spesifikasi,
  index,
}: {
  spesifikasi: SpesifikasiBahan;
  index: number;
}) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{spesifikasi.bahan}</TableCell>
      <TableCell>{spesifikasi.satuan}</TableCell>
      <TableCell>{spesifikasi.spesifikasi}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Spesifikasi</DialogTitle>
              </DialogHeader>
              <EditSpesifikasiForm
                spesifikasi={spesifikasi}
                onFormSubmit={() => setEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <form action={deleteSpesifikasi.bind(null, spesifikasi.id)}>
            <Button variant="destructive" size="icon">
              <Trash className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </TableCell>
    </TableRow>
  );
}
