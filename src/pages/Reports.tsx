import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Users, IndianRupee, TrendingUp, Download } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchReportSummaryAsync,
  fetchUserTrendAsync,
  fetchRevenueVsTargetAsync,
  fetchMembershipDistributionAsync,
  fetchBranchPerformanceAsync,
  fetchStaffActivityAsync,
} from "@/store/slices/reportSlice";

const Reports = () => {
  const dispatch = useAppDispatch();
  const [timeFrame, setTimeFrame] = useState("this-month");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const {
    summary,
    userTrends,
    revenueTrends,
    membershipDistribution,
    branchPerformance,
    staffActivity,
  } = useAppSelector((state) => state.reports);

  useEffect(() => {
    const query = { timeframe: timeFrame, year: selectedYear };
    dispatch(fetchReportSummaryAsync(query));
    dispatch(fetchUserTrendAsync(query));
    dispatch(fetchRevenueVsTargetAsync(query));
    dispatch(fetchMembershipDistributionAsync(query));
    dispatch(fetchBranchPerformanceAsync(query));
    dispatch(fetchStaffActivityAsync(query));
  }, [dispatch, timeFrame, selectedYear]);

  // Helper to map month number to name
  const getMonthName = (month: number) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month - 1] || `Period ${month}`;
  };

  const registrationData = useMemo(() => {
    return userTrends.map(item => ({
      month: getMonthName(item.month),
      users: item.users
    }));
  }, [userTrends]);

  const revenueData = useMemo(() => {
    return revenueTrends.map(item => ({
      month: getMonthName(item.month),
      revenue: item.revenue,
      target: item.target
    }));
  }, [revenueTrends]);

  const transformedBranchPerformance = useMemo(() => {
    return branchPerformance.map(item => ({
      branch: item.name,
      users: item.totalUsers,
      revenue: item.revenue,
      growth: 0
    }));
  }, [branchPerformance]);

  const COLORS = ["hsl(348, 83%, 47%)", "hsl(25, 95%, 60%)", "hsl(142, 70%, 45%)", "hsl(270, 50%, 60%)"];

  const membershipData = useMemo(() => {
    return membershipDistribution.map((item, index) => ({
      name: item._id || "Unknown",
      value: item.count,
      color: COLORS[index % COLORS.length]
    }));
  }, [membershipDistribution]);

  const transformedStaffActivity = useMemo(() => {
    return staffActivity.map(item => ({
      name: item.fullName,
      profilesHandled: item.profilesHandled || 0,
      matchesMade: item.matchesMade || 0,
      ticketsResolved: item.ticketsResolved || 0
    }));
  }, [staffActivity]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="yearly">Yearly Filter</SelectItem>
            </SelectContent>
          </Select>

          {timeFrame === "yearly" && (
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          )}

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
              <p className="text-xl font-semibold text-foreground">{summary?.newRegistrations || 0}</p>
              <p className="text-xs text-chart-green">
                {timeFrame === "this-week"
                  ? "This Week"
                  : timeFrame === "this-month"
                  ? "This Month"
                  : timeFrame === "this-quarter"
                  ? "This Quarter"
                  : timeFrame === "yearly"
                  ? `Year ${selectedYear}`
                  : "This Year"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-chart-green" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Revenue</p>
              <p className="text-xl font-semibold text-foreground">₹{(summary?.monthlyRevenue || 0).toLocaleString('en-IN')}</p>
              <p className="text-xs text-chart-green">Total for Period</p>
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
              <p className="text-xl font-semibold text-foreground">{summary?.conversionRate || 0}%</p>
              <p className="text-xs text-chart-green">Paid user ratio</p>
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
              <p className="text-xl font-semibold text-foreground">₹{summary?.avgRevenuePerUser || 0}</p>
              <p className="text-xs text-chart-green">Per active member</p>
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
          {/* <TabsTrigger value="staff">Staff Activity</TabsTrigger> */}
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
                  {transformedBranchPerformance.map((branch) => (
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
                  {transformedStaffActivity.map((staff) => (
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
