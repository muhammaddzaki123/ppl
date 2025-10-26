"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";

export default function DataBarangPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <div className="p-4">
          <PageHeader
            title="Data Barang"
            description="Kelola data bahan makanan Anda."
          />
        </div>
        <CardContent>
          {/* Tambahkan tabel dan fungsionalitas di sini */}
        </CardContent>
      </Card>
    </div>
  );
}
