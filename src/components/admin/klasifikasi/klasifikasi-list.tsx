"use client";

import { deleteKlasifikasi } from "@/actions/klasifikasi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Klasifikasi, SpesifikasiBahan } from "@prisma/client";
import { Trash } from "lucide-react";
import { SpesifikasiTable } from "./spesifikasi-table";
import { CreateSpesifikasiForm } from "./create-spesifikasi-form";

type KlasifikasiWithSpesifikasi = Klasifikasi & {
  spesifikasiBahans: SpesifikasiBahan[];
};

interface KlasifikasiListProps {
  klasifikasis: KlasifikasiWithSpesifikasi[];
}

export function KlasifikasiList({ klasifikasis }: KlasifikasiListProps) {
  return (
    <div className="space-y-8">
      {klasifikasis.map((klasifikasi) => (
        <Card key={klasifikasi.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{klasifikasi.nama}</CardTitle>
              <form action={deleteKlasifikasi.bind(null, klasifikasi.id)}>
                <Button variant="destructive" size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardHeader>
          <CardContent>
            <SpesifikasiTable spesifikasis={klasifikasi.spesifikasiBahans} />
          </CardContent>
          <CardFooter>
            <CreateSpesifikasiForm klasifikasiId={klasifikasi.id} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
