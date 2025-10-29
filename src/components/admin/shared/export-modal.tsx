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
  const [selectedMonth, setSelectedMonth] = React.useState<string>(
    (new Date().getMonth() + 1).toString()
  );
  const [selectedYear, setSelectedYear] = React.useState<string>(
    new Date().getFullYear().toString()
  );

  const years = Array.from(
    new Set(data.map((item) => new Date(item[dateKey] as any).getFullYear()))
  ).sort();

  const filteredData = React.useMemo(() => {
    if (!selectedMonth || !selectedYear) {
      return [];
    }
    return data.filter((item) => {
      const itemDate = new Date(item[dateKey] as any);
      const itemMonth = (itemDate.getMonth() + 1).toString();
      const itemYear = itemDate.getFullYear().toString();
      return itemMonth === selectedMonth && itemYear === selectedYear;
    });
  }, [data, selectedMonth, selectedYear, dateKey]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">Export</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full flex-1">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={(i + 1).toString()}>
                    {new Date(0, i).toLocaleString("id-ID", {
                      month: "long",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full md:w-[120px]">
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
            dateKey={dateKey}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
