import { StatsCard } from "@/components/dashboard/StatsCard";
import { VisitorsChart } from "@/components/dashboard/VisitorsChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ChatRequests } from "@/components/dashboard/ChatRequests";
import { Demographics } from "@/components/dashboard/Demographics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDashboardAnalyticsAsync, fetchDashboardCmsStatsAsync } from "@/store/slices/dashboardSlice";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// Mock chart data for small sparklines in cards
const mockSparklineData = [
  { value: 30 }, { value: 45 }, { value: 35 }, { value: 55 }, { value: 40 }, { value: 60 }, { value: 50 }, { value: 70 }
];

export default function DashboardHome() {
  const dispatch = useAppDispatch();
  const { analytics, loading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardAnalyticsAsync());
    dispatch(fetchDashboardCmsStatsAsync());
  }, [dispatch]);

  if (loading && !analytics) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const cards = analytics?.cards || { totalUsers: 0, paidUsers: 0, freeUsers: 0, newUsers: 0 };
  const visitors = analytics?.visitors || [];
  const demographicsData = analytics?.demographics || [];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm text-muted-foreground font-medium">User Analytics</h1>
        </div>
        <Select defaultValue="month">
          <SelectTrigger className="w-36 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={cards.totalUsers.toLocaleString()}
          chartData={mockSparklineData}
          chartColor="hsl(348, 83%, 47%)"
          gradientId="totalUsers"
        />
        <StatsCard
          title="Paid Users"
          value={cards.paidUsers.toLocaleString()}
          chartData={mockSparklineData}
          chartColor="hsl(25, 95%, 60%)"
          gradientId="paidUsers"
        />
        <StatsCard
          title="Free Users"
          value={cards.freeUsers.toLocaleString()}
          chartData={mockSparklineData}
          chartColor="hsl(142, 70%, 45%)"
          gradientId="freeUsers"
        />
        <StatsCard
          title="New Users (MoM)"
          value={cards.newUsers.toLocaleString()}
          chartData={mockSparklineData}
          chartColor="hsl(270, 50%, 60%)"
          gradientId="newUsers"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <VisitorsChart data={visitors} />
        </div>
        <ActivityFeed />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChatRequests />
        <Demographics data={demographicsData} />
      </div>
    </div>
  );
}
