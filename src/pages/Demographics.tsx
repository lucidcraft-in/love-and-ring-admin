import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDemographicsAsync } from "@/store/slices/demographicsSlice";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// Helper colors for charts
const COLORS = [
  "hsl(348, 83%, 47%)", // Main Pink/Red
  "hsl(210, 80%, 55%)", // Blue
  "hsl(25, 95%, 60%)",  // Orange
  "hsl(142, 70%, 45%)", // Green
  "hsl(270, 50%, 60%)", // Purple
  "hsl(200, 30%, 40%)", // Slate/Teal
];

const Demographics = () => {
  const dispatch = useAppDispatch();
  const { data: demographics, loading } = useAppSelector((state) => state.demographics);

  useEffect(() => {
    dispatch(fetchDemographicsAsync());
  }, [dispatch]);

  if (loading && !demographics) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  // Default empty objects if data is missing locally to prevent crash
  const genderData = (demographics?.genderDistribution || []).map((item, index) => ({
    name: item._id || "Unknown",
    value: item.count,
    color: index === 0 ? "hsl(210, 80%, 55%)" : "hsl(348, 83%, 47%)" // Keep basic blue/pink for gender if 2 items
  }));

  // If more than 2 genders or flexible, apply colors cyclically
  if (genderData.length > 2) {
    genderData.forEach((item, index) => { item.color = COLORS[index % COLORS.length]; });
  }

  const religionData = (demographics?.religionDistribution || []).map((item, index) => ({
    name: item._id || "Unknown",
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

  // Age distribution: API returns [{ _id: 18, male: X, female: Y }, ...]
  // Need to map _id (start age) to label range (e.g., 18 -> "18-24")
  const mapAgeLabel = (startAge: number) => {
    if (startAge >= 41) return "41+"; // The bucket boundary was 41
    // Boundaries: 18, 25, 31, 36, 41
    if (startAge === 18) return "18-24";
    if (startAge === 25) return "25-30";
    if (startAge === 31) return "31-35";
    if (startAge === 36) return "36-40";
    return `${startAge}`; // Fallback
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

  // Calculate max for education progress bar scaling
  const maxEducationCount = Math.max(...educationData.map(d => d.value), 100);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Demographics</h1>
          <p className="text-sm text-muted-foreground">User distribution and insights</p>
        </div>
        <Select defaultValue="all-time">
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
            <SelectItem value="all-time">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gender & Religion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="stat-card-shadow border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
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
          </CardContent>
        </Card>

        <Card className="stat-card-shadow border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Religion Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
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
          </CardContent>
        </Card>
      </div>

      {/* Age Distribution */}
      <Card className="stat-card-shadow border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Age Distribution by Gender</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Location & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="stat-card-shadow border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card className="stat-card-shadow border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Education Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
              {educationData.length === 0 && <div className="text-muted-foreground text-sm">No education data available.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Demographics;
