import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast"; // Assuming this is the correct path for shadcn toast in this project
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { replyToTicketAsync } from "@/store/slices/supportTicketSlice";

interface TicketReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TicketReplyDialog({ open, onOpenChange }: TicketReplyDialogProps) {
  const dispatch = useAppDispatch();
  const { selectedTicket: ticket } = useAppSelector((state) => state.supportTickets);

  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status || "In Progress");
    }
  }, [ticket]);

  if (!ticket) return null;

  const handleSubmit = async () => {
    if (!reply.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(replyToTicketAsync({
        id: ticket._id,
        message: reply,
        status: status
      })).unwrap();

      toast({
        title: "Reply Sent",
        description: `Your reply has been sent successfully.`,
      });

      setReply("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reply to Ticket</DialogTitle>
          <DialogDescription>
            Send a response to the customer's support request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Ticket Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src={ticket.user?.avatar} />
              <AvatarFallback>{ticket.user?.fullName?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{ticket.user?.fullName || "Unknown User"}</p>
              <p className="text-sm text-muted-foreground truncate">{ticket.subject}</p>
            </div>
            <Badge variant="outline">#{ticket._id.slice(-6).toUpperCase()}</Badge>
          </div>

          {/* Reply Input */}
          <div className="space-y-2">
            <Label htmlFor="reply">Your Reply</Label>
            <Textarea
              id="reply"
              placeholder="Type your response here..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={6}
            />
          </div>

          {/* Update Status */}
          <div className="space-y-2">
            <Label>Update Ticket Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending">Pending (Waiting for User)</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
