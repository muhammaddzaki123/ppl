import prisma from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function KlasifikasiPage() {
  const klasifikasis = await prisma.klasifikasi.findMany({
    include: {
      spesifikasiBahans: true,
    },
    orderBy: {
      nama: "asc",
    },
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Spesifikasi Bahan Makanan
      </h1>

      <div className="space-y-8">
        {klasifikasis.map((klasifikasi) => (
          <Card key={klasifikasi.id}>
            <CardHeader>
              <CardTitle>{klasifikasi.nama}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Bahan</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Spesifikasi Bahan Makanan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {klasifikasi.spesifikasiBahans.map((spesifikasi, index) => (
                    <TableRow key={spesifikasi.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{spesifikasi.bahan}</TableCell>
                      <TableCell>{spesifikasi.satuan}</TableCell>
                      <TableCell>{spesifikasi.spesifikasi}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
