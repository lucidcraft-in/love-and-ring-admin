import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus, MessageSquare, Eye, Heart, Activity, Search, ExternalLink, Filter } from "lucide-react";
import { ActivityItem } from "@/services/dashboardService";

interface ActivityFeedProps {
  data?: ActivityItem[];
}

function formatTimeAgo(dateStr?: string) {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatFullDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ActivityFeed({ data }: ActivityFeedProps) {
  const items = data || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getIconAndColor = (type?: string) => {
    switch (type) {
      case "view":
        return { icon: Eye, color: "text-blue-500", bg: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300", label: "Profile View" };
      case "interest":
        return { icon: Heart, color: "text-rose-500", bg: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300", label: "Send Interest" };
      case "signup":
        return { icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", label: "Account Creation" };
      case "like":
        return { icon: Heart, color: "text-pink-500", bg: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300", label: "Like Profile" };
      default:
        return { icon: MessageSquare, color: "text-primary", bg: "bg-primary/10 text-primary", label: "Activity" };
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesSearch =
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.action.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <>
      <Card className="stat-card-shadow border-0 h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle
            className="text-base font-semibold flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsModalOpen(true)}
          >
            <Activity className="w-4 h-4 text-primary" />
            Activity
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 h-8"
            onClick={() => setIsModalOpen(true)}
          >
            <span>View All</span>
            <ExternalLink className="w-3 h-3" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 overflow-y-auto">
          {items.length > 0 ? (
            items.slice(0, 6).map((activity) => {
              const { icon: IconComponent, color: iconColor } = getIconAndColor(activity.type);
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-accent/40 transition-colors"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Avatar className="w-9 h-9 border">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {activity.user ? activity.user.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none mb-1 truncate">{activity.user}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <IconComponent className={`w-3 h-3 ${iconColor}`} />
                      <span className="truncate">{activity.action}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time || formatTimeAgo(activity.createdAt)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No recent activity recorded.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center justify-between gap-2 border-b pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <span>All User Activities</span>
                <Badge variant="secondary" className="ml-2">
                  {items.length} Total
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Filter & Search Bar */}
          <div className="space-y-3 py-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activity by user name or action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-muted-foreground flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {[
                { id: "all", label: "All Activities" },
                { id: "interest", label: "Send Interest" },
                { id: "signup", label: "Account Creation" },
                { id: "like", label: "Like Profile" },
                { id: "view", label: "Profile View" },
              ].map((filter) => (
                <Button
                  key={filter.id}
                  variant={filterType === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(filter.id)}
                  className="h-7 text-xs px-2.5 rounded-full"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Activity List inside Modal */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[300px] max-h-[450px]">
            {filteredItems.length > 0 ? (
              filteredItems.map((activity) => {
                const { icon: IconComponent, color: iconColor, bg: badgeBg, label: badgeLabel } = getIconAndColor(activity.type);

                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="w-10 h-10 border">
                        <AvatarImage src={activity.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {activity.user ? activity.user.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground truncate">{activity.user}</p>
                          <Badge className={`text-[10px] px-2 py-0.5 border-0 font-medium ${badgeBg}`}>
                            {badgeLabel}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <IconComponent className={`w-3.5 h-3.5 ${iconColor}`} />
                          <span className="truncate">{activity.action}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right pl-3">
                      <span className="text-xs text-muted-foreground font-medium block">
                        {formatTimeAgo(activity.createdAt)}
                      </span>
                      <span className="text-[10px] text-muted-foreground/70 block">
                        {formatFullDate(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No activities match your current search or filter.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
