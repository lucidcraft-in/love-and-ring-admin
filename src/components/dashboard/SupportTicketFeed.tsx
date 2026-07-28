import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LifeBuoy, Search, ExternalLink, Send, CheckCircle2, Clock, MessageSquare, Loader2 } from "lucide-react";
import { SupportTicketDashboardItem } from "@/services/dashboardService";
import { supportTicketService } from "@/services/supportTicketService";

interface SupportTicketFeedProps {
  data?: SupportTicketDashboardItem[];
  onRefresh?: () => void;
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

export function SupportTicketFeed({ data, onRefresh }: SupportTicketFeedProps) {
  const [tickets, setTickets] = useState<SupportTicketDashboardItem[]>(data || []);
  
  // Sync if prop updates
  const items = data && data.length > 0 ? data : tickets;

  const [isFullListOpen, setIsFullListOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketDashboardItem | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const [replyMessage, setReplyMessage] = useState("");
  const [replyStatus, setReplyStatus] = useState<string>("In Progress");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Resolved":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">Resolved</Badge>;
      case "In Progress":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300">In Progress</Badge>;
      default:
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300">Open</Badge>;
    }
  };

  const handleOpenReply = (ticket: SupportTicketDashboardItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedTicket(ticket);
    setReplyStatus(ticket.status === "Open" ? "In Progress" : ticket.status);
    setReplyMessage("");
    setIsReplyModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    setIsSubmitting(true);
    try {
      await supportTicketService.replyToTicket(selectedTicket.id, replyMessage, replyStatus);
      
      // Update local state ticket
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? {
                ...t,
                status: replyStatus,
                message: replyMessage,
                messages: [
                  ...(t.messages || []),
                  { senderType: "STAFF", message: replyMessage, createdAt: new Date().toISOString() },
                ],
              }
            : t
        )
      );

      setIsReplyModalOpen(false);
      setReplyMessage("");
      if (onRefresh) onRefresh();
    } catch (err: any) {
      console.error("Failed to reply to ticket:", err);
      alert(err?.response?.data?.message || "Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTickets = items.filter((ticket) => {
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesSearch =
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.email && ticket.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <Card className="stat-card-shadow border-0 h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle
            className="text-base font-semibold flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsFullListOpen(true)}
          >
            <LifeBuoy className="w-4 h-4 text-primary" />
            Support Tickets
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 h-8"
            onClick={() => setIsFullListOpen(true)}
          >
            <span>View All</span>
            <ExternalLink className="w-3 h-3" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-3 flex-1 overflow-y-auto">
          {items.length > 0 ? (
            items.slice(0, 5).map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/40 transition-colors cursor-pointer"
                onClick={() => setIsFullListOpen(true)}
              >
                <Avatar className="w-10 h-10 border">
                  <AvatarImage src={ticket.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {ticket.name ? ticket.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium leading-none truncate">{ticket.name}</p>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <p className="text-xs font-medium text-foreground truncate">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground truncate">{ticket.message}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary hover:text-primary hover:bg-primary/10 font-medium text-xs h-7 px-3"
                  onClick={(e) => handleOpenReply(ticket, e)}
                >
                  Reply
                </Button>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No active support tickets.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Support Tickets List Modal */}
      <Dialog open={isFullListOpen} onOpenChange={setIsFullListOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-primary" />
                <span>Support Tickets List</span>
                <Badge variant="secondary" className="ml-2">
                  {items.length} Tickets
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Search & Filter Bar */}
          <div className="space-y-3 py-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ticket ID, user name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {["all", "Open", "In Progress", "Resolved"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="h-7 text-xs px-3 rounded-full"
                >
                  {status === "all" ? "All Tickets" : status}
                </Button>
              ))}
            </div>
          </div>

          {/* Tickets List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[300px] max-h-[450px]">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 rounded-xl border bg-card hover:bg-accent/20 transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border">
                        <AvatarImage src={ticket.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {ticket.name ? ticket.name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary font-mono">{ticket.ticketId}</span>
                          <span className="text-sm font-semibold">{ticket.name}</span>
                          {ticket.email && <span className="text-xs text-muted-foreground">({ticket.email})</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Category: {ticket.category || "General"} • Priority: {ticket.priority || "Low"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(ticket.status)}
                      <Button
                        size="sm"
                        className="h-8 text-xs px-3"
                        onClick={() => handleOpenReply(ticket)}
                      >
                        Reply Ticket
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/40 p-3 rounded-lg border text-xs space-y-1">
                    <p className="font-semibold text-foreground">{ticket.subject}</p>
                    <p className="text-muted-foreground whitespace-pre-wrap">{ticket.message}</p>
                  </div>

                  {ticket.messages && ticket.messages.length > 1 && (
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                      <MessageSquare className="w-3 h-3" />
                      <span>{ticket.messages.length} messages in conversation thread</span>
                    </div>
                  )}

                  <div className="text-[10px] text-muted-foreground/70 text-right">
                    Created {formatTimeAgo(ticket.createdAt)}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No support tickets found.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 border-b pb-3">
              <Send className="w-4 h-4 text-primary" />
              Reply to Ticket {selectedTicket?.ticketId}
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4 pt-1">
              <div className="bg-muted/40 p-3 rounded-lg border text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>{selectedTicket.name}</span>
                  <span className="text-[10px] text-muted-foreground">{selectedTicket.email}</span>
                </div>
                <p className="font-medium text-foreground">{selectedTicket.subject}</p>
                <p className="text-muted-foreground">{selectedTicket.message}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Update Ticket Status</label>
                <Select value={replyStatus} onValueChange={setReplyStatus}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Reply Message</label>
                <Textarea
                  placeholder="Type your response to the user here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                  className="text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-9"
                  onClick={() => setIsReplyModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="text-xs h-9 flex items-center gap-1.5"
                  onClick={handleSendReply}
                  disabled={isSubmitting || !replyMessage.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
