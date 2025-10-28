"use client";

import * as React from "react";
import { z } from "zod";
import {
  addBahanMakanan,
  deleteBahanMakanan,
  getBahanMakanan,
  getBahanMakananWithStockHistory,
  updateBahanMakanan,
} from "@/actions/databarang";
import { ExportModal } from "@/components/admin/shared/export-modal";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface BahanMakananWithStockHistory extends BahanMakanan {
  stokAkhir: number;
  tanggal: string;
}

export default function DataBarangPage() {
  const [data, setData] = React.useState<BahanMakanan[]>([]);
  const [historicData, setHistoricData] = React.useState<
    BahanMakananWithStockHistory[]
  >([]);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<BahanMakanan | null>(
    null
  );
  const [isLoading, setLoading] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState<string>(
    (new Date().getMonth() + 1).toString()
  );
  const [selectedYear, setSelectedYear] = React.useState<string>(
    new Date().getFullYear().toString()
  );

  React.useEffect(() => {
    async function fetchData() {
      const result = await getBahanMakanan();
      setData(result);
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    async function fetchHistoricData() {
      const result = await getBahanMakananWithStockHistory(
        parseInt(selectedMonth),
        parseInt(selectedYear)
      );
      const normalized = (result as any[]).map((item) => ({
        ...item,
        stokAkhir: item.stokAkhir ?? item.stockAkhir,
      })) as BahanMakananWithStockHistory[];

      setHistoricData(normalized);
    }
    fetchHistoricData();
  }, [selectedMonth, selectedYear]);

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
            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    new Set(
                      data.map((item) => new Date().getFullYear())
                    )
                  )
                    .sort()
                    .map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <ExportModal
                data={historicData}
                columns={[
                  { header: "Tanggal", accessorKey: "tanggal" },
                  { header: "Kode", accessorKey: "kode" },
                  { header: "Nama Barang", accessorKey: "nama" },
                  { header: "Satuan", accessorKey: "satuan" },
                  { header: "Jumlah/Stok Akhir", accessorKey: "stokAkhir" },
                ]}
                fileName="data_barang"
                dateKey="tanggal"
              />
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
