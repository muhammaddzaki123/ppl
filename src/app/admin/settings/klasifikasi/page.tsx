import prisma from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateKlasifikasiForm } from "@/components/admin/klasifikasi/create-klasifikasi-form";
import { KlasifikasiList } from "@/components/admin/klasifikasi/klasifikasi-list";
export const dynamic = "force-dynamic";
export default async function KlasifikasiPage() {
  const klasifikasis = await prisma.klasifikasi.findMany({
    include: {
      spesifikasiBahans: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Klasifikasi</h1>
        <p className="text-muted-foreground">
          Kelola klasifikasi dan spesifikasi bahan makanan.
        </p>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Tambah Klasifikasi Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateKlasifikasiForm />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <KlasifikasiList klasifikasis={klasifikasis} />
      </div>
    </div>
  );
}
