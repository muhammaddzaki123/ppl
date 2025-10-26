"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  ShoppingCart,
  FileText,
} from "lucide-react";

export default function AdminDashboardPage() {
  // Data dummy untuk statistik
  const stats = {
    dataBarang: 4,
    barangMasuk: 2,
    barangKeluar: 1,
  };

  // Data dummy untuk tabel
  const barangMasukBulanIni = [
    { kodeBarang: "B001", tanggal: "2024-05-01", jumlah: 10 },
    { kodeBarang: "B002", tanggal: "2024-05-03", jumlah: 5 },
  ];

  const barangKeluarBulanIni = [
    { kodeBarang: "B003", tanggal: "2024-05-02", jumlah: 2 },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card Data Barang */}
        <div className="rounded-lg bg-blue-500 text-white shadow-sm">
          <div className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Data Barang</h3>
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold">{stats.dataBarang}</div>
            <Link
              href="/admin/databarang"
              className="text-xs text-white flex items-center"
            >
              More info <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Card Barang Masuk */}
        <div className="rounded-lg bg-red-500 text-white shadow-sm">
          <div className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Barang Masuk</h3>
            <ShoppingCart className="h-4 w-4 text-white" />
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold">{stats.barangMasuk}</div>
            <Link
              href="/admin/barangmasuk"
              className="text-xs text-white flex items-center"
            >
              More info <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Card Barang Keluar */}
        <div className="rounded-lg bg-green-500 text-white shadow-sm">
          <div className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Barang Keluar</h3>
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold">{stats.barangKeluar}</div>
            <Link
              href="/admin/barangkeluar"
              className="text-xs text-white flex items-center"
            >
              More info <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Tabel Barang Masuk */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-4">
            <h3 className="font-semibold">Barang masuk bulan ini</h3>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">#</th>
                  <th className="text-left">Kode Barang</th>
                  <th className="text-left">Tanggal</th>
                  <th className="text-left">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {barangMasukBulanIni.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.kodeBarang}</td>
                    <td>{item.tanggal}</td>
                    <td>{item.jumlah}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabel Barang Keluar */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-4">
            <h3 className="font-semibold">Barang keluar bulan ini</h3>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">#</th>
                  <th className="text-left">Kode Barang</th>
                  <th className="text-left">Tanggal</th>
                  <th className="text-left">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {barangKeluarBulanIni.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.kodeBarang}</td>
                    <td>{item.tanggal}</td>
                    <td>{item.jumlah}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
