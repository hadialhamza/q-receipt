import { CustomStatsCard } from "@/components/dashboard/CustomStatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentReceipts } from "@/components/dashboard/RecentReceipts";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient-primary">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your receipts and store performance.
          </p>
        </div>
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
          title="All User"
          value="10,234"
          colorString="purple"
        />
        <CustomStatsCard
          title="Event Count"
          value="536"
          colorString="orange"
        />
        <CustomStatsCard
          title="Conversations"
          value="21"
          colorString="green"
        />
        <CustomStatsCard
          title="New User"
          value="3321"
          colorString="blue"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart />
        <RecentReceipts />
      </div>
    </div>
  );
}
