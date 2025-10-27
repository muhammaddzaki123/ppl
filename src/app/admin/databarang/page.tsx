"use client";

import * as React from "react";
import { z } from "zod";
import {
  addBahanMakanan,
  deleteBahanMakanan,
  getBahanMakanan,
  updateBahanMakanan,
} from "@/actions/databarang";
import { PageHeader } from "@/components/admin/page-header";
import {
  GenericForm,
  FormFieldConfig,
} from "@/components/admin/shared/form";
import { DataTable } from "@/components/admin/shared/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BahanMakanan } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const BahanMakananSchema = z.object({
  kode: z.string().min(1, "Kode tidak boleh kosong"),
  nama: z.string().min(1, "Nama tidak boleh kosong"),
  satuan: z.string().min(1, "Satuan tidak boleh kosong"),
  stok: z.coerce.number().int().min(0, "Stok tidak boleh negatif"),
});

type BahanMakananFormValues = z.infer<typeof BahanMakananSchema>;

export default function DataBarangPage() {
  const [data, setData] = React.useState<BahanMakanan[]>([]);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<BahanMakanan | null>(
    null
  );
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      const result = await getBahanMakanan();
      setData(result);
    }
    fetchData();
  }, []);

  const handleSubmit = async (formData: BahanMakananFormValues) => {
    setLoading(true);
    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.append(key, String(value));
    });

    if (editingItem) {
      await updateBahanMakanan(editingItem.id, dataToSend);
    } else {
      await addBahanMakanan(dataToSend);
    }

    const result = await getBahanMakanan();
    setData(result);
    setLoading(false);
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: BahanMakanan) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item: BahanMakanan) => {
    await deleteBahanMakanan(item.id);
    const result = await getBahanMakanan();
    setData(result);
  };

  const columns: ColumnDef<BahanMakanan>[] = [
    {
      accessorKey: "kode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Kode
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "nama",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama Barang
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "satuan",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Satuan
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "stok",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Jumlah
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const formFields: FormFieldConfig<BahanMakananFormValues>[] = [
    { name: "kode" as const, label: "Kode", type: "text", placeholder: "Contoh: B001" },
    { name: "nama" as const, label: "Nama Barang", type: "text", placeholder: "Contoh: Tepung Terigu" },
    { name: "satuan" as const, label: "Satuan", type: "text", placeholder: "Contoh: kg" },
    ...(editingItem
      ? []
      : [
          {
            name: "stok" as const,
            label: "Jumlah",
            type: "number",
            placeholder: "Contoh: 10",
          },
        ]),
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Data Barang</CardTitle>
              <CardDescription>
                Kelola data bahan makanan Anda.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setEditingItem(null)}
                  className="w-full md:w-auto"
                >
                  Tambah Barang
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit Barang" : "Tambah Barang"}
                  </DialogTitle>
                </DialogHeader>
                <GenericForm<BahanMakananFormValues>
                  schema={BahanMakananSchema}
                  fields={formFields}
                  onSubmit={handleSubmit}
                  initialData={editingItem || undefined}
                  isLoading={isLoading}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
