import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemographicStat } from "@/services/dashboardService";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MapPin } from "lucide-react";

interface DemographicsProps {
  data: DemographicStat[];
}

const HEX_COLORS = [
  "hsl(348, 83%, 47%)", // Primary Rose
  "hsl(25, 95%, 60%)",  // Orange
  "hsl(142, 70%, 45%)", // Green
  "hsl(270, 50%, 60%)", // Purple
  "hsl(199, 89%, 48%)", // Info Blue
  "hsl(330, 80%, 60%)", // Pink
  "hsl(45, 93%, 47%)",  // Amber
];

export function Demographics({ data }: DemographicsProps) {
  const totalUsers = (data || []).reduce((sum, item) => sum + (item.users || 0), 0);

  const cityData = (data || []).map((item, index) => {
    const userCount = item.users || 0;
    const percentage = totalUsers > 0 ? Math.round((userCount / totalUsers) * 100) : 0;
    return {
      name: item._id || "Unknown",
      value: userCount,
      percentage,
      color: HEX_COLORS[index % HEX_COLORS.length],
    };
  });

  return (
    <Card className="stat-card-shadow border-0 h-full flex flex-col justify-between">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Demographics (Top Cities)
        </CardTitle>
        <span className="text-xs text-muted-foreground font-medium bg-muted/60 px-2.5 py-1 rounded-full">
          {totalUsers} Total Users
        </span>
      </CardHeader>

      <CardContent className="flex-1 flex items-center justify-center p-6">
        {cityData.length > 0 && totalUsers > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Donut Chart */}
            <div className="md:col-span-5 h-[170px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {cityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val} Users`, "Count"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-foreground leading-tight">{totalUsers}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Users</span>
              </div>
            </div>

            {/* City Progress Bars */}
            <div className="md:col-span-7 space-y-2.5">
              {cityData.slice(0, 6).map((city) => (
                <div key={city.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: city.color }}
                      />
                      <span className="truncate capitalize text-foreground font-semibold">{city.name}</span>
                    </div>
                    <span className="text-muted-foreground text-[11px] whitespace-nowrap">
                      {city.value} {city.value === 1 ? "User" : "Users"} ({city.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(city.percentage, 5)}%`,
                        backgroundColor: city.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-1">
            <MapPin className="w-8 h-8 opacity-30 text-primary" />
            <p className="font-medium text-sm text-foreground/80">No Demographic Data</p>
            <p className="text-xs text-muted-foreground">No users recorded for the selected timeframe.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
