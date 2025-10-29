"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
          <Skeleton className="h-10 w-full md:w-[180px]" />
          <Skeleton className="h-10 w-full md:w-[180px]" />
          <Skeleton className="h-10 w-full md:w-24" />
          <Skeleton className="h-10 w-full md:w-32" />
        </div>
      </div>
      <div className="rounded-md border">
        <div className="p-4">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="border-t">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="p-4">
                  <Skeleton className="h-6 w-24" />
                </th>
                <th className="p-4">
                  <Skeleton className="h-6 w-32" />
                </th>
                <th className="p-4">
                  <Skeleton className="h-6 w-24" />
                </th>
                <th className="p-4">
                  <Skeleton className="h-6 w-24" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="p-4">
                    <Skeleton className="h-6 w-full" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-6 w-full" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-6 w-full" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
