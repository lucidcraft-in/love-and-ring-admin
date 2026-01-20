import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Users, IndianRupee, TrendingUp, Download, FileText, Calendar, Building2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";

const registrationData = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1500 },
  { month: "Mar", users: 1800 },
  { month: "Apr", users: 2100 },
  { month: "May", users: 2400 },
  { month: "Jun", users: 2800 },
];

const revenueData = [
  { month: "Jan", revenue: 245000, target: 200000 },
  { month: "Feb", revenue: 298000, target: 250000 },
  { month: "Mar", revenue: 356000, target: 300000 },
  { month: "Apr", revenue: 412000, target: 350000 },
  { month: "May", revenue: 468000, target: 400000 },
  { month: "Jun", revenue: 524000, target: 450000 },
];

const branchPerformance = [
  { branch: "Mumbai", users: 8500, revenue: 520000, growth: 18 },
  { branch: "Delhi", users: 7200, revenue: 456000, growth: 15 },
  { branch: "Bangalore", users: 6800, revenue: 498000, growth: 22 },
  { branch: "Hyderabad", users: 5400, revenue: 345000, growth: 12 },
  { branch: "Chennai", users: 4200, revenue: 265000, growth: 8 },
];

const membershipData = [
  { name: "1 Month", value: 1250, color: "hsl(348, 83%, 47%)" },
  { name: "3 Months", value: 2800, color: "hsl(25, 95%, 60%)" },
  { name: "6 Months", value: 3500, color: "hsl(142, 70%, 45%)" },
  { name: "1 Year", value: 1374, color: "hsl(270, 50%, 60%)" },
];

const staffActivity = [
  { name: "Anita Desai", profilesHandled: 245, matchesMade: 89, ticketsResolved: 56 },
  { name: "Suresh Kumar", profilesHandled: 189, matchesMade: 56, ticketsResolved: 78 },
  { name: "Meera Sharma", profilesHandled: 312, matchesMade: 145, ticketsResolved: 42 },
  { name: "Rahul Verma", profilesHandled: 156, matchesMade: 42, ticketsResolved: 95 },
  { name: "Priya Nair", profilesHandled: 278, matchesMade: 98, ticketsResolved: 67 },
];

const Reports = () => {
  return (

      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground">Comprehensive insights and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="this-month">
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">New Registrations</p>
                <p className="text-xl font-semibold text-foreground">2,845</p>
                <p className="text-xs text-chart-green">+18% vs last month</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-chart-green" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Monthly Revenue</p>
                <p className="text-xl font-semibold text-foreground">₹5.24L</p>
                <p className="text-xs text-chart-green">+12% vs last month</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-chart-orange" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Conversion Rate</p>
                <p className="text-xl font-semibold text-foreground">21.4%</p>
                <p className="text-xs text-chart-green">+3.2% vs last month</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Revenue/User</p>
                <p className="text-xl font-semibold text-foreground">₹1,842</p>
                <p className="text-xs text-chart-green">+8% vs last month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Reports</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Reports</TabsTrigger>
            <TabsTrigger value="branches">Branch Performance</TabsTrigger>
            <TabsTrigger value="staff">Staff Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="stat-card-shadow border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">User Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={registrationData}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(348, 83%, 47%)" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="hsl(348, 83%, 47%)" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stroke="hsl(348, 83%, 47%)"
                          strokeWidth={2}
                          fill="url(#colorUsers)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card-shadow border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Revenue vs Target</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`₹${(value / 1000).toFixed(0)}K`, '']}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(142, 70%, 45%)" strokeWidth={2} name="Revenue" />
                        <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="stat-card-shadow border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Membership Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={membershipData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {membershipData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {membershipData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card-shadow border-0 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Top Performing Branches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={branchPerformance} layout="vertical">
                        <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis dataKey="branch" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={80} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="users" fill="hsl(270, 50%, 60%)" radius={[0, 4, 4, 0]} name="Users" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="stat-card-shadow border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">User Registration Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={registrationData}>
                      <defs>
                        <linearGradient id="colorUsers2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(348, 83%, 47%)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(348, 83%, 47%)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stroke="hsl(348, 83%, 47%)"
                        strokeWidth={2}
                        fill="url(#colorUsers2)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card className="stat-card-shadow border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revenue Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [`₹${(value / 1000).toFixed(0)}K`, '']}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="hsl(142, 70%, 45%)" radius={[4, 4, 0, 0]} name="Revenue" />
                      <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Target" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branches" className="space-y-4">
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Branch</TableHead>
                      <TableHead>Total Users</TableHead>
                      <TableHead>Monthly Revenue</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branchPerformance.map((branch) => (
                      <TableRow key={branch.branch} className="border-border/50">
                        <TableCell className="font-medium">{branch.branch}</TableCell>
                        <TableCell>{branch.users.toLocaleString()}</TableCell>
                        <TableCell className="text-chart-green">₹{(branch.revenue / 1000).toFixed(0)}K</TableCell>
                        <TableCell>
                          <span className="text-chart-green">+{branch.growth}%</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Profiles Handled</TableHead>
                      <TableHead>Matches Made</TableHead>
                      <TableHead>Tickets Resolved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffActivity.map((staff) => (
                      <TableRow key={staff.name} className="border-border/50">
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.profilesHandled}</TableCell>
                        <TableCell className="text-chart-green">{staff.matchesMade}</TableCell>
                        <TableCell>{staff.ticketsResolved}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

  );
};

export default Reports;
