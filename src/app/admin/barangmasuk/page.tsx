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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BahanMakanan, BahanMasuk } from "@prisma/client";
import { useForm, DefaultValues, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const form = useForm<BahanMasukFormValues>({
    // Cast resolver/defaultValues to match react-hook-form generics
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

  const columns = [
    {
      header: "Kode Barang",
      accessor: "bahanMakanan" as const,
      render: (item: BahanMasukWithRelations) => item.bahanMakanan.kode,
    },
    {
      header: "Tanggal",
      accessor: "tanggalMasuk" as const,
      render: (item: BahanMasukWithRelations) =>
        new Date(item.tanggalMasuk).toLocaleDateString(),
    },
    { header: "Jumlah", accessor: "jumlah" as const },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Barang Masuk</CardTitle>
              <CardDescription>
                Kelola data bahan makanan yang masuk.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingItem(null)}>
                  Tambah Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit Data" : "Tambah Data"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="bahanMakananId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bahan Makanan</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih bahan makanan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bahanMakanan.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.nama}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                                field.value instanceof Date
                                  ? field.value.toISOString().split("T")[0]
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns.map((c) => ({
              header: c.header,
              accessor: c.accessor,
            }))}
            data={data.map((row) => ({
              ...row,
              bahanMakanan: row.bahanMakanan.kode,
              tanggalMasuk: new Date(row.tanggalMasuk).toLocaleDateString(),
            }))}
            onEdit={handleEdit as any}
            onDelete={handleDelete as any}
          />
        </CardContent>
      </Card>
    </div>
  );
}
