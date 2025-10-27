"use client";

import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface ExportButtonsProps<TData> {
  data: TData[];
  columns: { header: string; accessorKey: string }[];
  fileName: string;
}

const resolvePath = (obj: any, path: string) => {
  return path.split(".").reduce((prev, curr) => (prev ? prev[curr] : null), obj);
};

export function ExportButtons<TData>({
  data,
  columns,
  fileName,
}: ExportButtonsProps<TData>) {
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableData = data.map((row) =>
      columns.map((col) => resolvePath(row, col.accessorKey))
    );
    const tableHeaders = columns.map((col) => col.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save(`${fileName}.pdf`);
  };

  const handleExportExcel = () => {
    const excelData = data.map((row) => {
      const newRow: { [key: string]: any } = {};
      columns.forEach((col) => {
        newRow[col.header] = resolvePath(row, col.accessorKey);
      });
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handlePrint = () => {
    const tableHeaders = columns.map((col) => `<th>${col.header}</th>`).join("");
    const tableBody = data
      .map(
        (row) =>
          `<tr>${columns
            .map((col) => `<td>${resolvePath(row, col.accessorKey)}</td>`)
            .join("")}</tr>`
      )
      .join("");

    const printContent = `
      <html>
        <head>
          <title>Print - ${fileName}</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${fileName}</h1>
          <table>
            <thead><tr>${tableHeaders}</tr></thead>
            <tbody>${tableBody}</tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button onClick={handleExportPDF} variant="outline">
        PDF
      </Button>
      <Button onClick={handleExportExcel} variant="outline">
        Excel
      </Button>
      <Button onClick={handlePrint}>Cetak</Button>
    </div>
  );
}
