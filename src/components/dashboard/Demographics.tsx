import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const countries = [
  { name: "Australia", users: "21042 User", color: "bg-primary" },
  { name: "China", users: "21042 User", color: "bg-chart-orange" },
  { name: "India", users: "75000 User", color: "bg-chart-green" },
  { name: "France", users: "23000 User", color: "bg-chart-purple" },
  { name: "Brazil", users: "31042 User", color: "bg-chart-rose" },
  { name: "New York", users: "71002 User", color: "bg-secondary" },
  { name: "USA", users: "104750 User", color: "bg-info" },
];

export function Demographics() {
  return (
    <Card className="stat-card-shadow border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Demographics</CardTitle>
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
              {/* Map dots for countries */}
              <circle cx="620" cy="220" r="6" fill="hsl(348, 83%, 47%)" opacity="0.7" /> {/* Australia */}
              <circle cx="580" cy="140" r="6" fill="hsl(25, 95%, 60%)" opacity="0.7" /> {/* China */}
              <circle cx="520" cy="170" r="8" fill="hsl(142, 70%, 45%)" opacity="0.7" /> {/* India */}
              <circle cx="380" cy="130" r="5" fill="hsl(270, 50%, 60%)" opacity="0.7" /> {/* France */}
              <circle cx="280" cy="240" r="6" fill="hsl(348, 83%, 47%)" opacity="0.7" /> {/* Brazil */}
              <circle cx="220" cy="150" r="5" fill="hsl(270, 50%, 60%)" opacity="0.7" /> {/* New York */}
              <circle cx="180" cy="160" r="7" fill="hsl(210, 80%, 55%)" opacity="0.7" /> {/* USA */}
            </svg>
          </div>

          {/* Country list */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            {countries.map((country) => (
              <div key={country.name} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${country.color}`} />
                <span className="text-primary font-medium">{country.name}</span>
                <span className="text-muted-foreground">{country.users}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
