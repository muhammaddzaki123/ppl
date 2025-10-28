"use client";

import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import Link from "next/link"; // 1. IMPORT Link dari next/link

export default function Home() {
  return (
    // Container utama
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,_#226b25,_#52abb1,_#e1e1e1)] flex flex-col">
      
      <header className="w-full p-4 sm:px-8 flex justify-between items-center text-white">
        
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png" 
            alt="RSUD Moh. Roslan Kota Mataram Logo"
            width={50}
            height={50}
            priority
          />
          <div>
            <p className="text-sm font-semibold">RSUD Moh. Roslan Kota Mataram</p>
            <p className="text-xs">RS Umum Moh. Roslan</p>
          </div>
        </div>

        <div className="flex items-center gap-4">

          <div className="hidden sm:flex gap-2"> 
            <div className="w-3 h-3 rounded-full border border-white"></div>
            <div className="w-3 h-3 rounded-full border border-white"></div>
            <div className="w-3 h-3 rounded-full border border-white"></div>
            <div className="w-3 h-3 rounded-full border border-white"></div>
          </div>
         <Link 
            href="/login" 
            className="rounded-full border border-white px-5 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-[#007F73]"
          >
            Login
        </Link>
        <ModeToggle />
        </div>

      </header>

      {/* Main Content Area (Tidak berubah) */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 sm:py-16 text-white">
        
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            e-Stok Gizi RSUD
            <br />
            Moh. Ruslan Kota Mataram 
          </h1>
          <p className="text-base sm:text-lg leading-relaxed">
            e-Stok Gizi adalah sistem informasi yang membantu
            petugas dalam memantau pemasukan, pengeluaran,
            dan ketersediaan bahan makanan di Instalasi Gizi.
            Dengan sistem ini, pengelolaan stok menjadi lebih cepat,
            akurat, dan efisien untuk mendukung pelayanan gizi
            yang optimal.
          </p>
        </div>

        {/* Feature Cards Section (Tidak berubah) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-2xl flex flex-col items-center justify-center min-h-[180px] w-full max-w-xs sm:max-w-none">
            <Image
              src="/kuastv.png" 
              alt="Spesifikasi Bahan Icon"
              width={80}
              height={80}
              className="mb-4"
            />
            <p className="text-lg font-semibold text-center">Spesifikasi Bahan</p>
          </div>

          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-2xl flex flex-col items-center justify-center min-h-[180px] w-full max-w-xs sm:max-w-none">
            <Image
              src="/seo.png" 
              alt="Rekapan Bulanan Barang Icon"
              width={80}
              height={80}
              className="mb-4"
            />
            <p className="text-lg font-semibold text-center">Rekapan Bulanan Barang</p>
          </div>

          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-2xl flex flex-col items-center justify-center min-h-[180px] w-full max-w-xs sm:max-w-none">
            <Image
              src="/orangMikir.png" 
              alt="Input Barang Masuk & Keluar Icon"
              width={80}
              height={80}
              className="mb-4"
            />
            <p className="text-lg font-semibold text-center">Input Barang Masuk & Keluar</p>
          </div>
        </div>

        <Link 
          href="/klasifikasi"
          className="bg-[#4a1c7c] hover:bg-[#6b25ac] text-white font-bold py-3 px-8 rounded-full text-lg mb-16 sm:mb-20 transition-colors duration-200"
        >
          Selengkapnya
        </Link>

      </main>

      <footer className="w-full text-center p-6 sm:p-8 text-gray-700">
        <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Terima kasih telah menggunakan layanan ini
          <br />
          Mari bersama kita wujudkan pelayanan gizi yang
          profesional dan berkelanjutan.
        </p>
      </footer>
    </div>
  );
}
