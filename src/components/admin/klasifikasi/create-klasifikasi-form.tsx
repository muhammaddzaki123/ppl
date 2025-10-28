"use client";

import { createKlasifikasi } from "@/actions/klasifikasi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";

export function CreateKlasifikasiForm() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createKlasifikasi(formData);
        formRef.current?.reset();
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="nama">Nama Klasifikasi</Label>
        <Input
          id="nama"
          name="nama"
          placeholder="Contoh: A. BAHAN MAKANAN BASAH"
          required
        />
      </div>
      <Button type="submit">Tambah</Button>
    </form>
  );
}
