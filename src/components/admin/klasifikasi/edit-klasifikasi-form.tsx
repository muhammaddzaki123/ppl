"use client";

import { updateKlasifikasi } from "@/actions/klasifikasi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Klasifikasi } from "@prisma/client";

interface EditKlasifikasiFormProps {
  klasifikasi: Klasifikasi;
  onFormSubmit: () => void;
}

export function EditKlasifikasiForm({
  klasifikasi,
  onFormSubmit,
}: EditKlasifikasiFormProps) {
  return (
    <form
      action={async (formData) => {
        await updateKlasifikasi(klasifikasi.id, formData);
        onFormSubmit();
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="nama">Nama Klasifikasi</Label>
        <Input
          id="nama"
          name="nama"
          placeholder="Contoh: A. BAHAN MAKANAN BASAH"
          defaultValue={klasifikasi.nama}
          required
        />
      </div>
      <Button type="submit">Simpan Perubahan</Button>
    </form>
  );
}
