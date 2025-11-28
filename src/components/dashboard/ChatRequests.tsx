import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const chatRequests = [
  {
    id: 1,
    name: "Abraham457",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    status: "Looking for prayers",
  },
  {
    id: 2,
    name: "Fergus",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    status: "Looking for prayers",
  },
  {
    id: 3,
    name: "Bellenzdevoll5",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    status: "Looking for prayers",
  },
  {
    id: 4,
    name: "Fergus",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    status: "Looking for prayers",
  },
];

export function ChatRequests() {
  return (
    <Card className="stat-card-shadow border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Chat Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {chatRequests.map((request) => (
          <div key={request.id} className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={request.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {request.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-none mb-1">{request.name}</p>
              <p className="text-xs text-muted-foreground truncate">{request.status}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary hover:bg-primary/10 font-medium"
            >
              Reply
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
