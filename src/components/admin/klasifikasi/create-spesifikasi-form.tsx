"use client";

import { createSpesifikasi } from "@/actions/klasifikasi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";

interface CreateSpesifikasiFormProps {
  klasifikasiId: string;
}

export function CreateSpesifikasiForm({
  klasifikasiId,
}: CreateSpesifikasiFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createSpesifikasi(formData);
        formRef.current?.reset();
      }}
      className="space-y-4 w-full"
    >
      <input type="hidden" name="klasifikasiId" value={klasifikasiId} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="bahan">Bahan</Label>
          <Input id="bahan" name="bahan" required />
        </div>
        <div>
          <Label htmlFor="satuan">Satuan</Label>
          <Input id="satuan" name="satuan" required />
        </div>
        <div>
          <Label htmlFor="spesifikasi">Spesifikasi</Label>
          <Input id="spesifikasi" name="spesifikasi" required />
        </div>
      </div>
      <Button type="submit">Tambah Spesifikasi</Button>
    </form>
  );
}
