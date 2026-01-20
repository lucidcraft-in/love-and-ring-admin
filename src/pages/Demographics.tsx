import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const genderData = [
  { name: "Male", value: 22500, color: "hsl(210, 80%, 55%)" },
  { name: "Female", value: 20464, color: "hsl(348, 83%, 47%)" },
];

const ageData = [
  { range: "18-24", male: 4500, female: 5200 },
  { range: "25-30", male: 8200, female: 7800 },
  { range: "31-35", male: 5500, female: 4200 },
  { range: "36-40", male: 2800, female: 2100 },
  { range: "40+", male: 1500, female: 1164 },
];

const religionData = [
  { name: "Hindu", value: 25000, color: "hsl(25, 95%, 60%)" },
  { name: "Muslim", value: 8000, color: "hsl(142, 70%, 45%)" },
  { name: "Christian", value: 5000, color: "hsl(210, 80%, 55%)" },
  { name: "Sikh", value: 2500, color: "hsl(270, 50%, 60%)" },
  { name: "Others", value: 2464, color: "hsl(348, 83%, 47%)" },
];

const locationData = [
  { city: "Mumbai", users: 8500 },
  { city: "Delhi", users: 7200 },
  { city: "Bangalore", users: 6800 },
  { city: "Hyderabad", users: 5400 },
  { city: "Chennai", users: 4200 },
  { city: "Pune", users: 3800 },
  { city: "Kolkata", users: 3200 },
  { city: "Others", users: 3864 },
];

const educationData = [
  { name: "Graduate", value: 18000 },
  { name: "Post Graduate", value: 12000 },
  { name: "Doctorate", value: 3500 },
  { name: "Diploma", value: 5000 },
  { name: "Others", value: 4464 },
];

const Demographics = () => {
  return (
    <div className="space-y-6 animate-fade-in">
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
                      style={{ width: `${(item.value / 20000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Demographics;
