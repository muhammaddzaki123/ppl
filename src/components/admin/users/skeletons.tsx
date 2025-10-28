import { Skeleton } from "@/components/ui/skeleton";

export function UserTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="rounded-md border">
        <div className="w-full">
          <div className="border-b">
            <div className="flex h-12 items-center px-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="ml-4 h-6 w-1/4" />
              <Skeleton className="ml-4 h-6 w-1/4" />
              <Skeleton className="ml-4 h-6 w-1/4" />
            </div>
          </div>
          <div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex h-12 items-center border-b px-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="ml-4 h-6 w-1/4" />
                <Skeleton className="ml-4 h-6 w-1/4" />
                <Skeleton className="ml-4 h-6 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
