import { Card } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface StatsCardProps {
  title: string;
  value: string;
  chartData: { value: number }[];
  chartColor: string;
  gradientId: string;
}

export function StatsCard({ title, value, chartData, chartColor, gradientId }: StatsCardProps) {
  return (
    <Card className="p-5 stat-card-shadow border-0 overflow-hidden">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
        {title}
      </p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-semibold" style={{ color: chartColor }}>
          {value}
        </h3>
        <div className="w-24 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
