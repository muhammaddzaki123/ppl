"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportButtons } from "./export-buttons";

interface ExportModalProps<TData> {
  data: TData[];
  columns: { header: string; accessorKey: string }[];
  fileName: string;
  dateKey: keyof TData;
}

export function ExportModal<TData>({
  data,
  columns,
  fileName,
  dateKey,
}: ExportModalProps<TData>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMonths, setSelectedMonths] = React.useState<string[]>([]);
  const [selectedYear, setSelectedYear] = React.useState<string>(
    new Date().getFullYear().toString()
  );

  const years = Array.from(
    new Set(data.map((item) => new Date(item[dateKey] as any).getFullYear()))
  ).sort();

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item[dateKey] as any);
      const itemMonth = (itemDate.getMonth() + 1).toString();
      const itemYear = itemDate.getFullYear().toString();
      return (
        selectedMonths.includes(itemMonth) && itemYear === selectedYear
      );
    });
  }, [data, selectedMonths, selectedYear, dateKey]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Export</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <MultiSelect
              options={Array.from({ length: 12 }, (_, i) => ({
                value: (i + 1).toString(),
                label: new Date(0, i).toLocaleString("id-ID", { month: "long" }),
              }))}
              onValueChange={setSelectedMonths}
              defaultValue={selectedMonths}
              placeholder="Pilih Bulan"
              className="flex-1"
            />
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ExportButtons
            data={filteredData}
            columns={columns}
            fileName={fileName}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
