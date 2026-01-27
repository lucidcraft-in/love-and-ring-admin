import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemographicStat } from "@/services/dashboardService";

interface DemographicsProps {
  data: DemographicStat[];
}

const COLORS = [
  "bg-primary",
  "bg-chart-orange",
  "bg-chart-green",
  "bg-chart-purple",
  "bg-chart-rose",
  "bg-secondary",
  "bg-info",
];

export function Demographics({ data }: DemographicsProps) {
  // If no data, show empty state or just empty list
  // Map data to display format
  const cityData = data.map((item, index) => ({
    name: item._id || "Unknown",
    users: `${item.users.toLocaleString()} Users`,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card className="stat-card-shadow border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Demographics (Top Cities)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          {/* World Map Placeholder */}
          <div className="flex-1 relative min-h-[180px]">
            <svg
              viewBox="0 0 800 400"
              className="w-full h-full"
              style={{ maxHeight: '180px' }}
            >
              {/* Simplified world map outline */}
              <path
                d="M150,150 Q200,100 300,120 T450,110 Q500,100 550,130 T650,120 Q700,140 720,180 T680,250 Q620,280 550,270 T400,290 Q300,300 200,280 T150,220 Q130,180 150,150 Z"
                fill="hsl(var(--muted))"
                opacity="0.5"
              />
              {/* Map dots for countries - static for now as we don't have geo coords for cities */}
              <circle cx="520" cy="170" r="8" fill="hsl(142, 70%, 45%)" opacity="0.7" />
            </svg>
          </div>

          {/* City list */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            {cityData.length > 0 ? (
              cityData.map((city) => (
                <div key={city.name} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${city.color}`} />
                  <span className="text-primary font-medium">{city.name}</span>
                  <span className="text-muted-foreground">{city.users}</span>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-muted-foreground">No demographic data available</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
