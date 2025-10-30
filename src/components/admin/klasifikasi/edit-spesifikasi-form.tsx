"use client";

import { updateSpesifikasi } from "@/actions/klasifikasi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpesifikasiBahan } from "@prisma/client";

interface EditSpesifikasiFormProps {
  spesifikasi: SpesifikasiBahan;
  onFormSubmit: () => void;
}

export function EditSpesifikasiForm({
  spesifikasi,
  onFormSubmit,
}: EditSpesifikasiFormProps) {
  return (
    <form
      action={async (formData) => {
        await updateSpesifikasi(spesifikasi.id, formData);
        onFormSubmit();
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="bahan">Bahan</Label>
        <Input
          id="bahan"
          name="bahan"
          defaultValue={spesifikasi.bahan}
          required
        />
      </div>
      <div>
        <Label htmlFor="satuan">Satuan</Label>
        <Input
          id="satuan"
          name="satuan"
          defaultValue={spesifikasi.satuan}
          required
        />
      </div>
      <div>
        <Label htmlFor="spesifikasi">Spesifikasi Bahan Makanan</Label>
        <Input
          id="spesifikasi"
          name="spesifikasi"
          defaultValue={spesifikasi.spesifikasi}
          required
        />
      </div>
      <Button type="submit">Simpan Perubahan</Button>
    </form>
  );
}
