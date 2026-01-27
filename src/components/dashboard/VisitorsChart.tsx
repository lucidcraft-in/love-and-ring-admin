import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { VisitorStat } from "@/services/dashboardService";

interface VisitorsChartProps {
  data: VisitorStat[];
}

export function VisitorsChart({ data }: VisitorsChartProps) {
  // Transform API data to Chart data
  // API: { _id: { day, month }, count }
  // Chart: { date: "Jan 01", visitors: 1200 }

  const chartData = data.map((item) => {
    const date = new Date();
    date.setMonth(item._id.month - 1); // Month is 1-indexed in mongo aggregate usually, date object is 0-indexed
    date.setDate(item._id.day);
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      visitors: item.count,
    };
  });

  return (
    <Card className="stat-card-shadow border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Visitors</CardTitle>
        <Select defaultValue="15days">
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="15days">Last 15 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.length > 0 ? chartData : []}>
              <defs>
                <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(348, 83%, 47%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(348, 83%, 47%)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="hsl(348, 83%, 47%)"
                strokeWidth={2}
                fill="url(#visitorsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
