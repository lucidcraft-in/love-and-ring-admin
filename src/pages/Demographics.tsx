import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDemographicsAsync } from "@/store/slices/demographicsSlice";
import { useEffect, useState, useMemo } from "react";
import { Loader2, BarChart3, Calendar } from "lucide-react";

// Helper colors for charts
const COLORS = [
  "hsl(348, 83%, 47%)", // Main Pink/Red
  "hsl(210, 80%, 55%)", // Blue
  "hsl(25, 95%, 60%)",  // Orange
  "hsl(142, 70%, 45%)", // Green
  "hsl(270, 50%, 60%)", // Purple
  "hsl(200, 30%, 40%)", // Slate/Teal
];

const EmptyChartState = ({ message = "No demographic data recorded for this period." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground min-h-[220px]">
    <BarChart3 className="w-10 h-10 mb-2 opacity-30 text-primary" />
    <p className="text-sm font-medium">{message}</p>
    <p className="text-xs text-muted-foreground/70 mt-1">Try selecting a different date range or timeline filter.</p>
  </div>
);

const Demographics = () => {
  const dispatch = useAppDispatch();
  const { data: demographics, loading } = useAppSelector((state) => state.demographics);

  const [timeframe, setTimeframe] = useState<string>("all-time");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Dynamically generate recent years (current year down 5 years)
  const yearsOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (current - i).toString());
  }, []);

  useEffect(() => {
    if (timeframe === "custom") {
      if (startDate && endDate) {
        dispatch(fetchDemographicsAsync({ startDate, endDate }));
      }
    } else if (timeframe === "yearly") {
      dispatch(fetchDemographicsAsync(selectedYear));
    } else {
      dispatch(fetchDemographicsAsync(timeframe));
    }
  }, [dispatch, timeframe, selectedYear, startDate, endDate]);

  if (loading && !demographics) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  // Process data for charts
  const genderData = (demographics?.genderDistribution || []).map((item, index) => ({
    name: item._id || "Unknown",
    value: item.count,
    color: index === 0 ? "hsl(210, 80%, 55%)" : "hsl(348, 83%, 47%)"
  }));

  if (genderData.length > 2) {
    genderData.forEach((item, index) => { item.color = COLORS[index % COLORS.length]; });
  }

  const religionData = (demographics?.religionDistribution || []).map((item, index) => ({
    name: item._id || "Unknown",
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

  const mapAgeLabel = (startAge: number) => {
    if (startAge >= 41) return "41+";
    if (startAge === 18) return "18-24";
    if (startAge === 25) return "25-30";
    if (startAge === 31) return "31-35";
    if (startAge === 36) return "36-40";
    return `${startAge}`;
  };

  const ageData = (demographics?.ageDistribution || []).map((item) => ({
    range: mapAgeLabel(item._id),
    male: item.male,
    female: item.female
  }));

  const locationData = (demographics?.topLocations || []).map((item) => ({
    city: item._id || "Unknown",
    users: item.count
  }));

  const educationData = (demographics?.educationLevel || []).map((item) => ({
    name: item._id || "Unknown",
    value: item.count
  }));

  const maxEducationCount = Math.max(...educationData.map(d => d.value), 0);

  const hasGenderData = genderData.some(d => d.value > 0);
  const hasReligionData = religionData.some(d => d.value > 0);
  const hasAgeData = ageData.some(d => d.male > 0 || d.female > 0);
  const hasLocationData = locationData.some(d => d.users > 0);
  const hasEducationData = educationData.some(d => d.value > 0);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header & Date Range Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Demographics</h1>
          <p className="text-sm text-muted-foreground">User distribution and Insights</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={timeframe} onValueChange={(val) => setTimeframe(val)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="yearly">Yearly Filter</SelectItem>
              <SelectItem value="custom">Custom Date Range</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>

          {timeframe === "yearly" && (
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {yearsOptions.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {timeframe === "custom" && (
            <div className="flex items-center gap-2 bg-card border border-input rounded-md px-2.5 py-1 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">From:</span>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-[145px] text-xs h-8 px-2 border-0 bg-transparent focus-visible:ring-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-80"
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground px-1">to</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">To:</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-[145px] text-xs h-8 px-2 border-0 bg-transparent focus-visible:ring-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-80"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gender & Religion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="stat-card-shadow border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasGenderData ? (
              <EmptyChartState />
            ) : (
              <div className="flex items-center gap-6 min-h-[220px]">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {genderData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.value.toLocaleString()} users</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="stat-card-shadow border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Religion Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasReligionData ? (
              <EmptyChartState />
            ) : (
              <div className="flex items-center gap-6 min-h-[220px]">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={religionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {religionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {religionData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">({item.value.toLocaleString()})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Age Distribution */}
      <Card className="stat-card-shadow border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Age Distribution by Gender</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasAgeData ? (
            <EmptyChartState />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData}>
                  <XAxis dataKey="range" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="male" fill="hsl(210, 80%, 55%)" radius={[4, 4, 0, 0]} name="Male" />
                  <Bar dataKey="female" fill="hsl(348, 83%, 47%)" radius={[4, 4, 0, 0]} name="Female" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="stat-card-shadow border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasLocationData ? (
              <EmptyChartState />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationData} layout="vertical">
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis dataKey="city" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="users" fill="hsl(270, 50%, 60%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="stat-card-shadow border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Education Level</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasEducationData ? (
              <EmptyChartState />
            ) : (
              <div className="space-y-4 py-2">
                {educationData.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="text-muted-foreground">{item.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: `${maxEducationCount > 0 ? (item.value / maxEducationCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Demographics;
