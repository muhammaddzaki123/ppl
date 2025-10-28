"use client";

import { deleteSpesifikasi } from "@/actions/klasifikasi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SpesifikasiBahan } from "@prisma/client";
import { Trash } from "lucide-react";

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
          <TableRow key={spesifikasi.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{spesifikasi.bahan}</TableCell>
            <TableCell>{spesifikasi.satuan}</TableCell>
            <TableCell>{spesifikasi.spesifikasi}</TableCell>
            <TableCell>
              <form action={deleteSpesifikasi.bind(null, spesifikasi.id)}>
                <Button variant="destructive" size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
              </form>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
