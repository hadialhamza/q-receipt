"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const COLORS = ["#8b5cf6", "#f97316", "#10b981", "#3b82f6"];

export function CategoryDistribution({ data = [] }) {
  const chartData = data.length > 0 ? data : [{ name: "No Data", value: 100 }];
  return (
    <Card className="col-span-3 border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Creates by Category</CardTitle>
        <CardDescription>
          Distribution of sales across top categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-62.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
