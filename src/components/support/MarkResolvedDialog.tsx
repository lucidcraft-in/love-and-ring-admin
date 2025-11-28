import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  user: { name: string; avatar: string };
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  lastUpdate: string;
}

interface MarkResolvedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
}

export function MarkResolvedDialog({ open, onOpenChange, ticket }: MarkResolvedDialogProps) {
  const [resolutionNote, setResolutionNote] = useState("");

  if (!ticket) return null;

  const handleConfirm = () => {
    toast({
      title: "Ticket Resolved",
      description: `Ticket ${ticket.id} has been marked as resolved.`,
    });
    setResolutionNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-chart-green" />
            Mark as Resolved
          </DialogTitle>
          <DialogDescription>
            Confirm that this support ticket has been resolved
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Ticket Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src={ticket.user.avatar} />
              <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{ticket.user.name}</p>
              <p className="text-sm text-muted-foreground truncate">{ticket.subject}</p>
            </div>
            <Badge variant="outline">{ticket.id}</Badge>
          </div>

          {/* Resolution Note */}
          <div className="space-y-2">
            <Label htmlFor="resolution">Resolution Note (Optional)</Label>
            <Textarea
              id="resolution"
              placeholder="Add a note about how this ticket was resolved..."
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              rows={4}
            />
          </div>

          <div className="p-3 bg-chart-green/10 rounded-lg text-sm text-chart-green">
            <p>This action will:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Change ticket status to "Resolved"</li>
              <li>Send a resolution notification to the user</li>
              <li>Close the ticket conversation</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-chart-green hover:bg-chart-green/90 text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirm Resolution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
