"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";

export default function BarangMasukPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <div className="p-4">
          <PageHeader
            title="Barang Masuk"
            description="Kelola data bahan makanan masuk."
          />
        </div>
        <CardContent>
          {/* Tambahkan tabel dan fungsionalitas di sini */}
        </CardContent>
      </Card>
    </div>
  );
}
