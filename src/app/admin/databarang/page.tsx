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
import { GenericForm } from "@/components/admin/shared/form";
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

const BahanMakananSchema = z.object({
  kode: z.string().min(1, "Kode tidak boleh kosong"),
  nama: z.string().min(1, "Nama tidak boleh kosong"),
  satuan: z.string().min(1, "Satuan tidak boleh kosong"),
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
      dataToSend.append(key, value);
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

  const columns = [
    { header: "Kode", accessor: "kode" as const },
    { header: "Nama Barang", accessor: "nama" as const },
    { header: "Satuan", accessor: "satuan" as const },
  ];

  const formFields = [
    { name: "kode", label: "Kode", type: "text", placeholder: "Contoh: B001" },
    { name: "nama", label: "Nama Barang", type: "text", placeholder: "Contoh: Tepung Terigu" },
    { name: "satuan", label: "Satuan", type: "text", placeholder: "Contoh: kg" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Barang</CardTitle>
              <CardDescription>Kelola data bahan makanan Anda.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingItem(null)}>
                  Tambah Barang
                </Button>
              </DialogTrigger>
              <DialogContent>
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
