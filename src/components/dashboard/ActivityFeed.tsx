import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, UserPlus, MessageSquare, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const activities = [
  {
    id: 1,
    user: "Abraham Pigvex",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    action: "is Now following You",
    icon: UserPlus,
    time: "80 Hours Ago",
    iconColor: "text-primary",
  },
  {
    id: 2,
    user: "Guth Wiedenbauer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    action: "Sent you a Message",
    icon: MessageSquare,
    time: "85 Hours Ago",
    iconColor: "text-secondary",
  },
  {
    id: 3,
    user: "Terrence McKenzie",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    action: "Just viewed your Profile",
    icon: Eye,
    time: "93 Hours Ago",
    iconColor: "text-info",
  },
  {
    id: 4,
    user: "Guth Wiedenbauer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    action: "Matching Rate with You!",
    icon: Heart,
    time: "98 Hours Ago",
    iconColor: "text-chart-rose",
  },
];

export function ActivityFeed() {
  return (
    <Card className="stat-card-shadow border-0 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold">Activity</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <Avatar className="w-9 h-9">
              <AvatarImage src={activity.avatar} />
              <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-none mb-1">{activity.user}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <activity.icon className={`w-3 h-3 ${activity.iconColor}`} />
                <span>{activity.action}</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
