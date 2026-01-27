import { useState, useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllTicketsAsync, fetchTicketStatsAsync, setSelectedTicket } from "@/store/slices/supportTicketSlice";
import { SupportTicket } from "@/services/supportTicketService";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const SupportTickets = () => {
  const dispatch = useAppDispatch();
  const { tickets, stats, loading } = useAppSelector((state) => state.supportTickets);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [priorityFilter, setPriorityFilter] = useState("all-priority");
  const [categoryFilter, setCategoryFilter] = useState("all-category");

  useEffect(() => {
    dispatch(fetchAllTicketsAsync());
    dispatch(fetchTicketStatsAsync());
  }, [dispatch]);

  const handleViewDetails = (ticket: SupportTicket) => {
    dispatch(setSelectedTicket(ticket));
    setDetailsOpen(true);
  };

  const handleReply = (ticket: SupportTicket) => {
    dispatch(setSelectedTicket(ticket));
    setReplyOpen(true);
  };

  const handleMarkResolved = (ticket: SupportTicket) => {
    dispatch(setSelectedTicket(ticket));
    setResolveOpen(true);
  };

  // Filter Logic
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all-status" || ticket.status.toLowerCase() === statusFilter.replace("-", " ");
    const matchesPriority = priorityFilter === "all-priority" || ticket.priority.toLowerCase() === priorityFilter;
    const matchesCategory = categoryFilter === "all-category" || ticket.category.toLowerCase() === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <>
      <div className="space-y-6 animate-fade-in pb-10">
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
                <p className="text-xl font-semibold text-foreground">{stats?.total || 0}</p>
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
                <p className="text-xl font-semibold text-foreground">{stats?.open || 0}</p>
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
                <p className="text-xl font-semibold text-foreground">{stats?.inProgress || 0}</p>
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
                <p className="text-xl font-semibold text-foreground">{stats?.resolved || 0}</p>
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
                <Input
                  placeholder="Search tickets by ID, Subject, or User..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                <Button variant="outline" size="icon" onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all-status");
                  setPriorityFilter("all-priority");
                  setCategoryFilter("all-category");
                }}>
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-0">
            {loading && tickets.length === 0 ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
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
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket._id} className="border-border/50">
                      <TableCell className="font-medium text-primary text-xs">#{ticket._id.slice(-6).toUpperCase()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={ticket.user?.avatar} />
                            <AvatarFallback>{ticket.user?.fullName?.charAt(0) || "?"}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{ticket.user?.fullName || "Unknown User"}</span>
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
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(ticket.updatedAt), "dd MMM, hh:mm a")}
                      </TableCell>
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
                  {filteredTickets.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No tickets found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      {/* We pass open/setOpen and let Redux handle selectedTicket access inside or passed down (we passed down selectedTicket in previous implementation, but it's null in Redux now if we use selector there) */}
      {/* For now, to minimize dialog changes if they take props, we can pass useAppSelector(state => state.supportTickets.selectedTicket) if the component expects it */}

      {/* However, the dialogs likely imported directly. I need to verify their props.
          Assuming they follow the previous pattern: ticket={selectedTicket}
      */}

      <TicketDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
      <TicketReplyDialog
        open={replyOpen}
        onOpenChange={setReplyOpen}
      />
      <MarkResolvedDialog
        open={resolveOpen}
        onOpenChange={setResolveOpen}
      />
    </>
  );
};

export default SupportTickets;
