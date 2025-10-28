"use client";

import * as React from "react";
import { z } from "zod";
import {
  addSatuan,
  deleteSatuan,
  getSatuans,
  updateSatuan,
} from "@/actions/satuan";
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
import { Satuan } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const SatuanSchema = z.object({
  nama: z.string().min(1, "Nama tidak boleh kosong"),
});

type SatuanFormValues = z.infer<typeof SatuanSchema>;

export default function SatuanPage() {
  const [data, setData] = React.useState<Satuan[]>([]);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Satuan | null>(null);
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      const result = await getSatuans();
      setData(result);
    }
    fetchData();
  }, []);

  const handleSubmit = async (formData: SatuanFormValues) => {
    setLoading(true);
    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.append(key, String(value));
    });

    if (editingItem) {
      await updateSatuan(editingItem.id, dataToSend);
    } else {
      await addSatuan(dataToSend);
    }

    const result = await getSatuans();
    setData(result);
    setLoading(false);
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: Satuan) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item: Satuan) => {
    await deleteSatuan(item.id);
    const result = await getSatuans();
    setData(result);
  };

  const columns: ColumnDef<Satuan>[] = [
    {
      accessorKey: "nama",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama Satuan
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const formFields: FormFieldConfig<SatuanFormValues>[] = [
    { name: "nama" as const, label: "Nama Satuan", type: "text", placeholder: "Contoh: kg" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Satuan</CardTitle>
              <CardDescription>
                Kelola satuan untuk bahan makanan.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setEditingItem(null)}
                  className="w-full md:w-auto"
                >
                  Tambah Satuan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit Satuan" : "Tambah Satuan"}
                  </DialogTitle>
                </DialogHeader>
                <GenericForm<SatuanFormValues>
                  schema={SatuanSchema}
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
