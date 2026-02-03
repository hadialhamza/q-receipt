import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner Skeleton */}
      <div className="rounded-2xl border p-6 lg:p-7 h-45 w-full bg-background dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 w-full">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
        <Skeleton className="h-28 w-40 rounded-xl hidden md:block" />
      </div>

      {/* Stats Cards Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-40 relative overflow-hidden rounded-2xl border p-6 bg-background dark:bg-slate-900 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Row 3: Weekly Activity + Category Distribution Skeleton */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Weekly Activity */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-full">
          <div className="p-6 space-y-1.5 border-b">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="p-6 h-62.5 flex items-end justify-between gap-2">
            {[40, 70, 35, 85, 50, 65, 90].map((height, i) => (
              <Skeleton
                key={i}
                className="w-full rounded-t-md"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-full">
          <div className="p-6 space-y-1.5 border-b">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="p-6 h-62.5 flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        </div>
      </div>

      {/* Row 4: Revenue Overview Skeleton */}
      <div className="grid gap-4 grid-cols-1">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm w-full">
          <div className="p-6 space-y-1.5 border-b">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="p-6 h-62.5">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
