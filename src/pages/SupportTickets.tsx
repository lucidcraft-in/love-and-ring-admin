import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MessageSquare, Clock, CheckCircle2, AlertCircle, MoreHorizontal, Eye, Reply } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TicketDetailsDialog } from "@/components/support/TicketDetailsDialog";
import { TicketReplyDialog } from "@/components/support/TicketReplyDialog";
import { MarkResolvedDialog } from "@/components/support/MarkResolvedDialog";

const tickets = [
  {
    id: "TKT-001",
    user: { name: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    subject: "Unable to upload photos",
    category: "Technical",
    priority: "High",
    status: "Open",
    createdAt: "2024-03-15 10:30 AM",
    lastUpdate: "2 hours ago",
  },
  {
    id: "TKT-002",
    user: { name: "Rahul Verma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    subject: "Payment not reflecting",
    category: "Billing",
    priority: "Critical",
    status: "In Progress",
    createdAt: "2024-03-14 03:45 PM",
    lastUpdate: "30 minutes ago",
  },
  {
    id: "TKT-003",
    user: { name: "Anjali Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    subject: "How to upgrade to premium?",
    category: "General",
    priority: "Low",
    status: "Resolved",
    createdAt: "2024-03-13 09:15 AM",
    lastUpdate: "1 day ago",
  },
  {
    id: "TKT-004",
    user: { name: "Vikram Singh", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    subject: "Profile verification pending",
    category: "Account",
    priority: "Medium",
    status: "Open",
    createdAt: "2024-03-15 02:20 PM",
    lastUpdate: "1 hour ago",
  },
  {
    id: "TKT-005",
    user: { name: "Sneha Reddy", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
    subject: "Request for profile deletion",
    category: "Account",
    priority: "High",
    status: "Pending",
    createdAt: "2024-03-14 11:00 AM",
    lastUpdate: "5 hours ago",
  },
];

type Ticket = typeof tickets[0];

const SupportTickets = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDetailsOpen(true);
  };

  const handleReply = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setReplyOpen(true);
  };

  const handleMarkResolved = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setResolveOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Support Tickets</h1>
            <p className="text-sm text-muted-foreground">Manage customer support requests</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Tickets</p>
                <p className="text-xl font-semibold text-foreground">1,284</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-chart-orange" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Open</p>
                <p className="text-xl font-semibold text-foreground">89</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">In Progress</p>
                <p className="text-xl font-semibold text-foreground">45</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-chart-green" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Resolved</p>
                <p className="text-xl font-semibold text-foreground">1,150</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search tickets..." className="pl-10" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select defaultValue="all-status">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-priority">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-priority">All Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-category">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-category">All Category</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} className="border-border/50">
                    <TableCell className="font-medium text-primary">{ticket.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={ticket.user.avatar} />
                          <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{ticket.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{ticket.subject}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ticket.category}</Badge>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{ticket.lastUpdate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(ticket)}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReply(ticket)}>
                            <Reply className="w-4 h-4 mr-2" /> Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMarkResolved(ticket)}>
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Resolved
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <TicketDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        ticket={selectedTicket}
      />
      <TicketReplyDialog
        open={replyOpen}
        onOpenChange={setReplyOpen}
        ticket={selectedTicket}
      />
      <MarkResolvedDialog
        open={resolveOpen}
        onOpenChange={setResolveOpen}
        ticket={selectedTicket}
      />
    </AdminLayout>
  );
};

export default SupportTickets;
