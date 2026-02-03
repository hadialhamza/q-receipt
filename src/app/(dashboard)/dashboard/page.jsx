import { CustomStatsCard } from "@/components/dashboard/CustomStatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { getDashboardStats } from "@/app/actions/dashboard-stats";

import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { Receipt, Users, Globe, Building2, ShieldCheck } from "lucide-react";
import { CategoryDistribution } from "@/components/analytics/CategoryDistribution";
import { WeeklyActivity } from "@/components/dashboard/WeeklyActivity";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";

export default async function DashboardPage() {
  const session = await getServerSession(authConfig);
  const { data } = await getDashboardStats();

  const totalReceipts = data?.totalReceipts || 0;
  const totalUsers = data?.totalUsers || 0;
  const companyCounts = data?.companyCounts || {
    GLOBAL: 0,
    FEDERAL: 0,
    TAKAFUL: 0,
  };
  const revenueChartData = data?.revenueChartData || [];
  const trends = data?.trends || {};
  const weeklyActivity = data?.weeklyActivity || [];
  const recentReceipts = data?.recentReceipts || [];

  // Transform companyCounts for CategoryDistribution
  const companyDistributionData = [
    { name: "Global Inc", value: companyCounts.GLOBAL || 0 },
    { name: "Federal Inc", value: companyCounts.FEDERAL || 0 },
    { name: "Takaful Inc", value: companyCounts.TAKAFUL || 0 },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <WelcomeBanner
        userName={session?.user?.name || "User"}
        userImage={session?.user?.image}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* 1. Total Receipts */}
        <CustomStatsCard
          title="Total Receipts"
          value={totalReceipts.toLocaleString()}
          colorString="blue"
          icon={<Receipt />}
          trend={trends.totalReceipts?.value || "0%"}
          trendDirection={trends.totalReceipts?.direction || "neutral"}
        />

        {/* 2. Global Inc */}
        <CustomStatsCard
          title="Global Inc"
          value={companyCounts.GLOBAL?.toLocaleString() || "0"}
          colorString="purple"
          icon={<Globe />}
          trend={trends.GLOBAL?.value || "0%"}
          trendDirection={trends.GLOBAL?.direction || "neutral"}
        />

        {/* 3. Federal Inc */}
        <CustomStatsCard
          title="Federal Inc"
          value={companyCounts.FEDERAL?.toLocaleString() || "0"}
          colorString="orange"
          icon={<Building2 />}
          trend={trends.FEDERAL?.value || "0%"}
          trendDirection={trends.FEDERAL?.direction || "neutral"}
        />

        {/* 4. Takaful Inc */}
        <CustomStatsCard
          title="Takaful Inc"
          value={companyCounts.TAKAFUL?.toLocaleString() || "0"}
          colorString="green"
          icon={<ShieldCheck />}
          trend={trends.TAKAFUL?.value || "0%"}
          trendDirection={trends.TAKAFUL?.direction || "neutral"}
        />

        {/* 5. Active Users */}
        <CustomStatsCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          colorString="pink"
          icon={<Users />}
          trend={trends.totalUsers?.value || "0%"}
          trendDirection={trends.totalUsers?.direction || "neutral"}
        />
      </div>

      {/* Row 3: Weekly Activity + Category Distribution (50% - 50%) */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 h-full">
        <div className="h-full">
          <WeeklyActivity data={weeklyActivity} />
        </div>
        <div className="h-full">
          <CategoryDistribution data={companyDistributionData} />
        </div>
      </div>

      {/* Row 4: Revenue Overview (Full Width) */}
      <div className="grid gap-4 grid-cols-1">
        <RevenueChart data={revenueChartData} />
      </div>
    </div>
  );
}
