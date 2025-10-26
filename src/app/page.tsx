import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A69D] to-[#007F73] text-white flex flex-col items-center justify-center p-4">
      {/* Header Section */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/rsud-logo.png" // Replace with your actual logo path
            alt="RSUD Moh. Roslan Kota Mataram Logo"
            width={40}
            height={40}
            priority
          />
          <div>
            <p className="text-sm font-semibold">RSUD Moh. Roslan Kota Mataram</p>
            <p className="text-xs">RS Umum Moh. Roslan</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full border border-white"></div>
          <div className="w-3 h-3 rounded-full border border-white"></div>
          <div className="w-3 h-3 rounded-full border border-white"></div>
          <div className="w-3 h-3 rounded-full border border-white"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center mt-20 mb-12 max-w-3xl">
        <h1 className="text-5xl font-bold mb-4">
          e-Stok Gizi RSUD
          <br />
          Moh. Ruslan Kota Matarm
        </h1>
        <p className="text-lg leading-relaxed px-4">
          e-Stok Gizi adalah sistem informasi yang membantu
          petugas dalam memantau pemasukan, pengeluaran,
          dan ketersediaan bahan makanan di Instalasi Gizi.
          Dengan sistem ini, pengelolaan stok menjadi lebih cepat,
          akurat, dan efisien untuk mendukung pelayanan gizi
          yang optimal.
        </p>
      </div>

      {/* Feature Cards Section */}
      <div className="flex flex-col sm:flex-row gap-8 mb-12">
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center text-center w-64 h-40">
          <Image
            src="/icon-bahan.svg" // Replace with your actual icon path
            alt="Spesifikasi Bahan Icon"
            width={60}
            height={60}
            className="mb-3"
          />
          <p className="text-lg font-semibold">Spesifikasi Bahan</p>
        </div>
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center text-center w-64 h-40">
          <Image
            src="/icon-rekap.svg" // Replace with your actual icon path
            alt="Rekapan Bulanan Barang Icon"
            width={60}
            height={60}
            className="mb-3"
          />
          <p className="text-lg font-semibold">Rekapan Bulanan Barang</p>
        </div>
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center text-center w-64 h-40">
          <Image
            src="/icon-input.svg" // Replace with your actual icon path
            alt="Input Barang Masuk & Keluar Icon"
            width={60}
            height={60}
            className="mb-3"
          />
          <p className="text-lg font-semibold">Input Barang Masuk & Keluar</p>
        </div>
      </div>

      {/* Selengkapnya Button */}
      <button className="bg-[#4a1c7c] hover:bg-[#6b25ac] text-white font-bold py-3 px-8 rounded-full text-lg mb-20">
        Selengkapnya
      </button>

      {/* Footer Text */}
      <div className="text-center max-w-2xl px-4">
        <p className="text-lg leading-relaxed">
          Terima kasih telah menggunakan layanan ini
          <br />
          Mari bersama kita wujudkan pelayanan gizi yang
          profesional dan berkelanjutan.
        </p>
      </div>
    </div>
  );
}