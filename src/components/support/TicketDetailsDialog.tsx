import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/store/hooks";
import { format } from "date-fns";

interface TicketDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TicketDetailsDialog({ open, onOpenChange }: TicketDetailsDialogProps) {
  const { selectedTicket: ticket } = useAppSelector((state) => state.supportTickets);

  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Ticket Details - #{ticket._id.slice(-6).toUpperCase()}
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
                <AvatarImage src={ticket.user?.avatar} />
                <AvatarFallback>{ticket.user?.fullName?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{ticket.user?.fullName || "Unknown User"}</p>
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
                {ticket.messages && ticket.messages.map((msg) => {
                  // Handle message sender name resolution safely
                  const senderName = typeof msg.sender === 'object' ? msg.sender.fullName : "Unknown";
                  // Ideally we check msg.senderType or ID. Assuming STAFF means current user or admin team.

                  return (
                    <div
                      key={msg._id}
                      className={`flex gap-3 ${msg.senderType === "STAFF" ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 ${msg.senderType === "STAFF" ? "text-right" : ""}`}>
                        <div
                          className={`inline-block p-3 rounded-lg ${msg.senderType === "STAFF"
                            ? "bg-primary/10 text-foreground"
                            : "bg-muted"
                            }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {senderName} • {format(new Date(msg.createdAt), "dd MMM, hh:mm a")}
                        </p>
                      </div>
                    </div>
                  )
                })}
                {(!ticket.messages || ticket.messages.length === 0) && (
                  <div className="text-center text-muted-foreground text-sm py-4">No messages yet.</div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Meta */}
          <div className="text-xs text-muted-foreground flex justify-between pt-2 border-t">
            <span>Created: {format(new Date(ticket.createdAt), "PPP p")}</span>
            <span>Last Update: {format(new Date(ticket.updatedAt), "PPP p")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
