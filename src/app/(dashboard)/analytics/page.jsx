import { CustomStatsCard } from "@/components/dashboard/CustomStatsCard";
import { OverviewChart } from "@/components/analytics/OverviewChart";
import { CategoryDistribution } from "@/components/analytics/CategoryDistribution";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gradient-primary">Analytics</h2>
                    <p className="text-muted-foreground">
                        In-depth analysis of your business performance.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" className="border-border/60">
                        <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
                    </Button>
                    <Button className="bg-gradient-primary shadow-primary border-none">
                        <Download className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CustomStatsCard
                    title="Conversion Rate"
                    value="3.2%"
                    colorString="purple"
                />
                <CustomStatsCard
                    title="Avg. Order Value"
                    value="$128"
                    colorString="blue"
                />
                <CustomStatsCard
                    title="Total Refunds"
                    value="$1,203"
                    colorString="orange"
                />
                <CustomStatsCard
                    title="Customer Health"
                    value="98%"
                    colorString="green"
                />
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <OverviewChart />
                <CategoryDistribution />
            </div>

            {/* Additional Stats / Table Placeholders */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="font-semibold mb-2">Top Products</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Premium Plan</span>
                            <span className="font-bold">$12,400</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Basic Support</span>
                            <span className="font-bold">$8,200</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Custom Integration</span>
                            <span className="font-bold">$5,200</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="font-semibold mb-2">Device Usage</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Desktop</span>
                            <span className="font-bold">65%</span>
                        </div>
                        <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary w-[65%] h-full rounded-full" />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Mobile</span>
                            <span className="font-bold">35%</span>
                        </div>
                        <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
                            <div className="bg-purple-500 w-[35%] h-full rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="font-semibold mb-2">Customer Satisfaction</h3>
                    <div className="flex items-center justify-center h-32">
                        <div className="text-center">
                            <span className="text-4xl font-bold text-green-600 dark:text-green-400">4.8</span>
                            <span className="text-muted-foreground text-sm block">out of 5.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
