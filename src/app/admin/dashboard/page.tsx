"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  ShoppingCart,
  FileText,
  Package,
} from "lucide-react";
import { getBahanMakanan } from "@/actions/databarang";
import { getBahanMasuk } from "@/actions/barangmasuk";
import { getBahanKeluar } from "@/actions/barangkeluar";
import { BahanMasuk, BahanKeluar, BahanMakanan } from "@prisma/client";

interface BahanMasukWithRelations extends BahanMasuk {
  bahanMakanan: BahanMakanan;
}

interface BahanKeluarWithRelations extends BahanKeluar {
  bahanMakanan: BahanMakanan;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState({
    dataBarang: 0,
    barangMasuk: 0,
    barangKeluar: 0,
  });
  const [barangMasukBulanIni, setBarangMasukBulanIni] = React.useState<
    BahanMasukWithRelations[]
  >([]);
  const [barangKeluarBulanIni, setBarangKeluarBulanIni] = React.useState<
    BahanKeluarWithRelations[]
  >([]);

  React.useEffect(() => {
    async function fetchData() {
      const [bahanMakanan, bahanMasuk, bahanKeluar] = await Promise.all([
        getBahanMakanan(),
        getBahanMasuk(),
        getBahanKeluar(),
      ]);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const filteredBarangMasuk = (
        bahanMasuk as BahanMasukWithRelations[]
      ).filter((item) => {
        const itemDate = new Date(item.tanggalMasuk);
        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        );
      });

      const filteredBarangKeluar = (
        bahanKeluar as BahanKeluarWithRelations[]
      ).filter((item) => {
        const itemDate = new Date(item.tanggalKeluar);
        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        );
      });

      setStats({
        dataBarang: bahanMakanan.length,
        barangMasuk: bahanMasuk.length,
        barangKeluar: bahanKeluar.length,
      });
      setBarangMasukBulanIni(filteredBarangMasuk);
      setBarangKeluarBulanIni(filteredBarangKeluar);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card Data Barang */}
        <div className="rounded-lg bg-blue-500 text-white shadow-sm">
          <div className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Data Barang</h3>
            <Package className="h-4 w-4 text-white" />
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
        <div className="rounded-lg bg-green-500 text-white shadow-sm">
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
        <div className="rounded-lg bg-red-500 text-white shadow-sm">
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
                  <th className="text-left">Kode Barang</th>
                  <th className="text-left">Tanggal</th>
                  <th className="text-left">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {barangMasukBulanIni.length > 0 ? (
                  barangMasukBulanIni.map((item, index) => (
                    <tr key={index}>
                      <td>{item.bahanMakanan.kode}</td>
                      <td>{new Date(item.tanggalMasuk).toLocaleDateString()}</td>
                      <td>{item.jumlah}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center h-24">
                      Tidak ada data.
                    </td>
                  </tr>
                )}
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
                  <th className="text-left">Kode Barang</th>
                  <th className="text-left">Tanggal</th>
                  <th className="text-left">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {barangKeluarBulanIni.length > 0 ? (
                  barangKeluarBulanIni.map((item, index) => (
                    <tr key={index}>
                      <td>{item.bahanMakanan.kode}</td>
                      <td>
                        {new Date(item.tanggalKeluar).toLocaleDateString()}
                      </td>
                      <td>{item.jumlah}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center h-24">
                      Tidak ada data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
