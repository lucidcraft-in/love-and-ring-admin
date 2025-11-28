import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Ticket {
  id: string;
  user: { name: string; avatar: string };
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  lastUpdate: string;
  description?: string;
  messages?: Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: string;
    isStaff: boolean;
  }>;
}

interface TicketDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
}

export function TicketDetailsDialog({ open, onOpenChange, ticket }: TicketDetailsDialogProps) {
  if (!ticket) return null;

  const sampleMessages = ticket.messages || [
    {
      id: "1",
      sender: ticket.user.name,
      message: "I've been trying to upload my photos for the past 2 days but it keeps showing an error. Please help!",
      timestamp: ticket.createdAt,
      isStaff: false,
    },
    {
      id: "2",
      sender: "Support Team",
      message: "Thank you for reaching out. We're looking into this issue. Could you please tell us which file format you're trying to upload?",
      timestamp: "2024-03-15 11:00 AM",
      isStaff: true,
    },
    {
      id: "3",
      sender: ticket.user.name,
      message: "I'm trying to upload JPG images. Each file is about 2MB.",
      timestamp: "2024-03-15 11:15 AM",
      isStaff: false,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Ticket Details - {ticket.id}
          </DialogTitle>
          <DialogDescription>
            View ticket information and conversation history
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Ticket Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={ticket.user.avatar} />
                <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{ticket.user.name}</p>
                <p className="text-sm text-muted-foreground">User</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-end">
              <Badge variant="outline">{ticket.category}</Badge>
              <Badge
                variant={ticket.priority === "Critical" ? "destructive" : "outline"}
                className={
                  ticket.priority === "High"
                    ? "border-chart-orange text-chart-orange"
                    : ticket.priority === "Medium"
                    ? "border-info text-info"
                    : ticket.priority === "Low"
                    ? "border-chart-green text-chart-green"
                    : ""
                }
              >
                {ticket.priority}
              </Badge>
              <Badge
                variant="secondary"
                className={
                  ticket.status === "Open"
                    ? "bg-chart-orange/10 text-chart-orange"
                    : ticket.status === "In Progress"
                    ? "bg-info/10 text-info"
                    : ticket.status === "Resolved"
                    ? "bg-chart-green/10 text-chart-green"
                    : "bg-muted text-muted-foreground"
                }
              >
                {ticket.status}
              </Badge>
            </div>
          </div>

          {/* Subject */}
          <div>
            <h4 className="font-medium mb-1">Subject</h4>
            <p className="text-muted-foreground">{ticket.subject}</p>
          </div>

          <Separator />

          {/* Conversation */}
          <div>
            <h4 className="font-medium mb-3">Conversation</h4>
            <ScrollArea className="h-[250px] pr-4">
              <div className="space-y-4">
                {sampleMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.isStaff ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="w-8 h-8">
                      {!msg.isStaff && <AvatarImage src={ticket.user.avatar} />}
                      <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 ${msg.isStaff ? "text-right" : ""}`}>
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          msg.isStaff
                            ? "bg-primary/10 text-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {msg.sender} • {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Meta */}
          <div className="text-xs text-muted-foreground flex justify-between pt-2 border-t">
            <span>Created: {ticket.createdAt}</span>
            <span>Last Update: {ticket.lastUpdate}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
