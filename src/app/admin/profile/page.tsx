"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";

export default function ProfilPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <div className="p-4">
          <PageHeader
            title="Profil"
            description="Kelola profil admin Anda."
          />
        </div>
        <CardContent>
          {/* Tambahkan formulir profil di sini */}
        </CardContent>
      </Card>
    </div>
  );
}
