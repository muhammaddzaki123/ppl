"use client";

import * as React from "react";
import { z } from "zod";
import {
  addBahanKeluar,
  deleteBahanKeluar,
  getBahanKeluar,
  updateBahanKeluar,
} from "@/actions/barangkeluar";
import { getBahanMakanan } from "@/actions/databarang";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportModal } from "@/components/admin/shared/export-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { BahanMakanan, BahanKeluar } from "@prisma/client";
import { useForm, DefaultValues, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const BahanKeluarSchema = z.object({
  bahanMakananId: z.string().min(1, "Bahan makanan tidak boleh kosong"),
  jumlah: z.coerce.number().min(0.1, "Jumlah harus lebih dari 0"),
  tanggalKeluar: z.coerce.date(),
});

type BahanKeluarFormValues = z.infer<typeof BahanKeluarSchema>;

interface BahanKeluarWithRelations extends BahanKeluar {
  bahanMakanan: BahanMakanan;
}

export default function BarangKeluarPage() {
  const [data, setData] = React.useState<BahanKeluarWithRelations[]>([]);
  const [bahanMakanan, setBahanMakanan] = React.useState<BahanMakanan[]>([]);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] =
    React.useState<BahanKeluarWithRelations | null>(null);
  const [isLoading, setLoading] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");
  const [selectedYear, setSelectedYear] = React.useState<string>("");

  const form = useForm<BahanKeluarFormValues>({
    resolver: zodResolver(BahanKeluarSchema) as unknown as Resolver<
      BahanKeluarFormValues,
      any,
      BahanKeluarFormValues
    >,
    defaultValues: {
      bahanMakananId: "",
      jumlah: 0,
      tanggalKeluar: new Date(),
    } as DefaultValues<BahanKeluarFormValues>,
  });

  React.useEffect(() => {
    async function fetchData() {
      const [bahanKeluarData, bahanMakananData] = await Promise.all([
        getBahanKeluar(),
        getBahanMakanan(),
      ]);
      setData(bahanKeluarData as BahanKeluarWithRelations[]);
      setBahanMakanan(bahanMakananData);
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    if (editingItem) {
      form.reset({
        bahanMakananId: editingItem.bahanMakananId,
        jumlah: editingItem.jumlah,
        tanggalKeluar: new Date(editingItem.tanggalKeluar),
      } as DefaultValues<BahanKeluarFormValues>);
    } else {
      form.reset();
    }
  }, [editingItem, form]);

  const handleSubmit = async (formData: BahanKeluarFormValues) => {
    setLoading(true);
    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof Date) {
        dataToSend.append(key, value.toISOString());
      } else {
        dataToSend.append(key, String(value));
      }
    });

    if (editingItem) {
      await updateBahanKeluar(editingItem.id, dataToSend);
    } else {
      await addBahanKeluar(dataToSend);
    }

    const result = await getBahanKeluar();
    setData(result as BahanKeluarWithRelations[]);
    setLoading(false);
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: BahanKeluarWithRelations) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item: BahanKeluarWithRelations) => {
    await deleteBahanKeluar(item.id);
    const result = await getBahanKeluar();
    setData(result as BahanKeluarWithRelations[]);
  };

  const columns: ColumnDef<BahanKeluarWithRelations>[] = [
    {
      accessorKey: "bahanMakanan.kode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Kode Barang
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "bahanMakanan.nama",
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
      accessorKey: "tanggalKeluar",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tanggal
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        new Date(row.original.tanggalKeluar).toLocaleDateString(),
    },
    {
      accessorKey: "jumlah",
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

  const bahanMakananOptions = bahanMakanan.map((item) => ({
    value: item.id,
    label: `${item.kode} - ${item.nama}`,
  }));

  const years = Array.from(
    new Set(data.map((item) => new Date(item.tanggalKeluar).getFullYear()))
  ).sort();

  const handleResetFilter = () => {
    setSelectedMonth("");
    setSelectedYear("");
  };

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.tanggalKeluar);
    const monthMatch =
      !selectedMonth || itemDate.getMonth() + 1 === parseInt(selectedMonth);
    const yearMatch =
      !selectedYear || itemDate.getFullYear() === parseInt(selectedYear);
    return monthMatch && yearMatch;
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Barang Keluar</CardTitle>
              <CardDescription>
                Kelola data bahan makanan yang keluar.
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
              {(selectedMonth || selectedYear) && (
                <Button
                  variant="outline"
                  onClick={handleResetFilter}
                  className="w-full md:w-auto"
                >
                  Hapus Filter
                </Button>
              )}
              <ExportModal
                data={data}
                columns={[
                  {
                    header: "Kode Barang",
                    accessorKey: "bahanMakanan.kode",
                  },
                  {
                    header: "Nama Barang",
                    accessorKey: "bahanMakanan.nama",
                  },
                  { header: "Tanggal", accessorKey: "tanggalKeluar" },
                  { header: "Jumlah", accessorKey: "jumlah" },
                ]}
                fileName="barang_keluar"
                dateKey="tanggalKeluar"
              />
              <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setEditingItem(null)}
                    className="w-full md:w-auto"
                  >
                    Tambah Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingItem ? "Edit Data" : "Tambah Data"}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="bahanMakananId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bahan Makanan</FormLabel>
                              <FormControl>
                                <Combobox
                                  options={bahanMakananOptions}
                                  {...field}
                                  placeholder="Pilih bahan makanan"
                                  searchPlaceholder="Cari bahan makanan..."
                                  noResultsMessage="Bahan makanan tidak ditemukan."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="jumlah"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jumlah</FormLabel>
                              <FormControl>
                                <Input type="number" step="any" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="tanggalKeluar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tanggal Keluar</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  {...field}
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                          .toISOString()
                                          .split("T")[0]
                                      : ""
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Menyimpan..." : "Simpan"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
