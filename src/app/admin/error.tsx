"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <h2 className="text-2xl font-semibold">Terjadi Kesalahan!</h2>
      <p className="text-center text-muted-foreground">
        Maaf, terjadi kesalahan saat memuat halaman ini. <br />
        Silakan coba lagi atau hubungi administrator jika masalah berlanjut.
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Coba Lagi
      </Button>
    </div>
  );
}
