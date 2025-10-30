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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Klasifikasi, SpesifikasiBahan } from "@prisma/client";
import { Pencil, Trash } from "lucide-react";
import { SpesifikasiTable } from "./spesifikasi-table";
import { CreateSpesifikasiForm } from "./create-spesifikasi-form";
import { EditKlasifikasiForm } from "./edit-klasifikasi-form";
import { useState } from "react";

type KlasifikasiWithSpesifikasi = Klasifikasi & {
  spesifikasiBahans: SpesifikasiBahan[];
};

interface KlasifikasiListProps {
  klasifikasis: KlasifikasiWithSpesifikasi[];
}

export function KlasifikasiList({ klasifikasis }: KlasifikasiListProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      {klasifikasis.map((klasifikasi) => (
        <Card key={klasifikasi.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{klasifikasi.nama}</CardTitle>
              <div className="flex items-center gap-2">
                <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Klasifikasi</DialogTitle>
                    </DialogHeader>
                    <EditKlasifikasiForm
                      klasifikasi={klasifikasi}
                      onFormSubmit={() => setEditDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
                <form action={deleteKlasifikasi.bind(null, klasifikasi.id)}>
                  <Button variant="destructive" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </form>
              </div>
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
