"use client";

import * as React from "react";
import { z } from "zod";
import {
  addBahanMasuk,
  deleteBahanMasuk,
  getBahanMasuk,
  updateBahanMasuk,
} from "@/actions/barangmasuk";
import { getBahanMakanan } from "@/actions/databarang";
import { PageHeader } from "@/components/admin/page-header";
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
import { BahanMakanan, BahanMasuk } from "@prisma/client";
import { useForm, DefaultValues, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const BahanMasukSchema = z.object({
  bahanMakananId: z.string().min(1, "Bahan makanan tidak boleh kosong"),
  jumlah: z.coerce.number().int().min(1, "Jumlah harus lebih dari 0"),
  tanggalMasuk: z.coerce.date(),
});

type BahanMasukFormValues = z.infer<typeof BahanMasukSchema>;

interface BahanMasukWithRelations extends BahanMasuk {
  bahanMakanan: BahanMakanan;
}

export default function BarangMasukPage() {
  const [data, setData] = React.useState<BahanMasukWithRelations[]>([]);
  const [bahanMakanan, setBahanMakanan] = React.useState<BahanMakanan[]>([]);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] =
    React.useState<BahanMasukWithRelations | null>(null);
  const [isLoading, setLoading] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState<string>(
    (new Date().getMonth() + 1).toString()
  );
  const [selectedYear, setSelectedYear] = React.useState<string>(
    new Date().getFullYear().toString()
  );

  const form = useForm<BahanMasukFormValues>({
    resolver: zodResolver(BahanMasukSchema) as unknown as Resolver<
      BahanMasukFormValues,
      any,
      BahanMasukFormValues
    >,
    defaultValues: {
      bahanMakananId: "",
      jumlah: 0,
      tanggalMasuk: new Date(),
    } as DefaultValues<BahanMasukFormValues>,
  });

  React.useEffect(() => {
    async function fetchData() {
      const [bahanMasukData, bahanMakananData] = await Promise.all([
        getBahanMasuk(),
        getBahanMakanan(),
      ]);
      setData(bahanMasukData as BahanMasukWithRelations[]);
      setBahanMakanan(bahanMakananData);
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    if (editingItem) {
      form.reset({
        bahanMakananId: editingItem.bahanMakananId,
        jumlah: editingItem.jumlah,
        tanggalMasuk: new Date(editingItem.tanggalMasuk),
      } as DefaultValues<BahanMasukFormValues>);
    } else {
      form.reset();
    }
  }, [editingItem, form]);

  const handleSubmit = async (formData: BahanMasukFormValues) => {
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
      await updateBahanMasuk(editingItem.id, dataToSend);
    } else {
      await addBahanMasuk(dataToSend);
    }

    const result = await getBahanMasuk();
    setData(result as BahanMasukWithRelations[]);
    setLoading(false);
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: BahanMasukWithRelations) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item: BahanMasukWithRelations) => {
    await deleteBahanMasuk(item.id);
    const result = await getBahanMasuk();
    setData(result as BahanMasukWithRelations[]);
  };

  const columns: ColumnDef<BahanMasukWithRelations>[] = [
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
      accessorKey: "tanggalMasuk",
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
        new Date(row.original.tanggalMasuk).toLocaleDateString(),
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
    new Set(data.map((item) => new Date(item.tanggalMasuk).getFullYear()))
  ).sort();

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.tanggalMasuk);
    return (
      itemDate.getMonth() + 1 === parseInt(selectedMonth) &&
      itemDate.getFullYear() === parseInt(selectedYear)
    );
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Barang Masuk</CardTitle>
              <CardDescription>
                Kelola data bahan makanan yang masuk.
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
                  { header: "Tanggal", accessorKey: "tanggalMasuk" },
                  { header: "Jumlah", accessorKey: "jumlah" },
                ]}
                fileName="barang_masuk"
                dateKey="tanggalMasuk"
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
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="tanggalMasuk"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tanggal Masuk</FormLabel>
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
