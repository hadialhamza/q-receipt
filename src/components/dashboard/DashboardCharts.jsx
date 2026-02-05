"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const WeeklyActivity = dynamic(
  () =>
    import("@/components/dashboard/WeeklyActivity").then(
      (mod) => mod.WeeklyActivity,
    ),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-xl" />,
    ssr: false,
  },
);

export const CategoryDistribution = dynamic(
  () =>
    import("@/components/analytics/CategoryDistribution").then(
      (mod) => mod.CategoryDistribution,
    ),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-xl" />,
    ssr: false,
  },
);

export const RevenueChart = dynamic(
  () =>
    import("@/components/dashboard/RevenueChart").then(
      (mod) => mod.RevenueChart,
    ),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-xl" />,
    ssr: false,
  },
);
