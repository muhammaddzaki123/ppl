"use client";

import * as React from "react";
import { z } from "zod";
import {
  addBahanMakanan,
  deleteBahanMakanan,
  getBahanMakananWithStockHistory,
  updateBahanMakanan,
} from "@/actions/databarang";
import { getBahanMasuk } from "@/actions/barangmasuk";
import { getBahanKeluar } from "@/actions/barangkeluar";
import { getSatuans } from "@/actions/satuan";
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
  satuanId: z.string().min(1, "Satuan tidak boleh kosong"),
  stok: z.coerce.number().int().min(0, "Stok tidak boleh negatif"),
});

type BahanMakananFormValues = z.infer<typeof BahanMakananSchema>;

interface BahanMakananWithStockHistory extends BahanMakanan {
  stokAkhir: number;
  tanggal: string;
}

export default function DataBarangPage() {
  const [satuans, setSatuans] = React.useState<any[]>([]);
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
  const [years, setYears] = React.useState<number[]>([]);

  const fetchHistoricData = React.useCallback(async () => {
    if (selectedMonth && selectedYear) {
      const result = await getBahanMakananWithStockHistory(
        parseInt(selectedMonth),
        parseInt(selectedYear)
      );
      setHistoricData(result);
    }
  }, [selectedMonth, selectedYear]);

  React.useEffect(() => {
    async function fetchData() {
      const [satuanData, bahanMasukData, bahanKeluarData] = await Promise.all([
        getSatuans(),
        getBahanMasuk(),
        getBahanKeluar(),
      ]);
      setSatuans(satuanData);

      const masukYears = bahanMasukData.map((item: any) =>
        new Date(item.tanggalMasuk).getFullYear()
      );
      const keluarYears = bahanKeluarData.map((item: any) =>
        new Date(item.tanggalKeluar).getFullYear()
      );
      const allYears = [...new Set([...masukYears, ...keluarYears])].sort();
      setYears(allYears);
    }
    fetchData();
    fetchHistoricData();
  }, [fetchHistoricData]);

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

    await fetchHistoricData();
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
    await fetchHistoricData();
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
      accessorKey: "satuan.nama",
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
      accessorKey: "stokAkhir",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stok Akhir
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const satuanOptions = satuans.map((satuan) => ({
    value: satuan.id,
    label: satuan.nama,
  }));

  const formFields: FormFieldConfig<BahanMakananFormValues>[] = [
    { name: "kode" as const, label: "Kode", type: "text", placeholder: "Contoh: B001" },
    { name: "nama" as const, label: "Nama Barang", type: "text", placeholder: "Contoh: Tepung Terigu" },
    {
      name: "satuanId" as const,
      label: "Satuan",
      type: "combobox",
      options: satuanOptions,
      placeholder: "Pilih satuan",
      searchPlaceholder: "Cari satuan...",
      noResultsMessage: "Satuan tidak ditemukan.",
    },
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
                  {years.map((year) => (
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
                  { header: "Satuan", accessorKey: "satuan.nama" },
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
                    initialData={
                      editingItem
                        ? { ...editingItem, satuanId: editingItem.satuanId || "" }
                        : { kode: "", nama: "", satuanId: "", stok: 0 }
                    }
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
            data={historicData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
