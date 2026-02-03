import { CustomStatsCard } from "@/components/dashboard/CustomStatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getDashboardStats } from "@/app/actions/dashboard-stats";



import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";

export default async function DashboardPage() {
  const session = await getServerSession(authConfig);
  const { data } = await getDashboardStats();

  const totalReceipts = data?.totalReceipts || 0;
  const companyCounts = data?.companyCounts || { GLOBAL: 0, FEDERAL: 0, TAKAFUL: 0 };
  const revenueChartData = data?.revenueChartData || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">

      {/* Dynamic Welcome Banner */}
      <WelcomeBanner userName={session?.user?.name || "User"} />

      <div className="flex items-center justify-end space-y-2">
        <div className="flex items-center space-x-2">
          <Button asChild className="bg-gradient-primary hover:opacity-90 shadow-primary border-none">
            <Link href="/create">
              <Plus className="mr-2 h-4 w-4" /> Create Receipt
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CustomStatsCard
          title="Total Receipts"
          value={totalReceipts.toLocaleString()}
          colorString="purple"
        />
        <CustomStatsCard
          title="Global Inc"
          value={companyCounts.GLOBAL?.toLocaleString() || "0"}
          colorString="blue"
        />
        <CustomStatsCard
          title="Federal"
          value={companyCounts.FEDERAL?.toLocaleString() || "0"}
          colorString="orange"
        />
        <CustomStatsCard
          title="Takaful"
          value={companyCounts.TAKAFUL?.toLocaleString() || "0"}
          colorString="green"
        />
      </div>

      <div className="grid gap-4 grid-cols-1">
        <RevenueChart data={revenueChartData} />
      </div>
    </div>
  );
}
