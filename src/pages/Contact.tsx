// import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Mail, Phone, MessageSquare, MoreHorizontal, Eye, Reply, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const contacts = [
  {
    id: 1,
    name: "Amit Kumar",
    email: "amit.kumar@email.com",
    phone: "+91 98765 43210",
    subject: "Partnership Inquiry",
    message: "Interested in becoming a branch partner in Pune region...",
    type: "Partnership",
    status: "New",
    date: "2024-03-15",
  },
  {
    id: 2,
    name: "Sunita Patel",
    email: "sunita.patel@email.com",
    phone: "+91 98765 43211",
    subject: "Feedback on App",
    message: "The new update is great but I noticed some issues with...",
    type: "Feedback",
    status: "Read",
    date: "2024-03-14",
  },
  {
    id: 3,
    name: "Rajesh Sharma",
    email: "rajesh.sharma@email.com",
    phone: "+91 98765 43212",
    subject: "Advertising Opportunity",
    message: "We would like to advertise our wedding services on your platform...",
    type: "Business",
    status: "Replied",
    date: "2024-03-14",
  },
  {
    id: 4,
    name: "Deepa Nair",
    email: "deepa.nair@email.com",
    phone: "+91 98765 43213",
    subject: "Profile Complaint",
    message: "I found a fake profile that is using my photos without permission...",
    type: "Complaint",
    status: "New",
    date: "2024-03-13",
  },
  {
    id: 5,
    name: "Vijay Singh",
    email: "vijay.singh@email.com",
    phone: "+91 98765 43214",
    subject: "General Inquiry",
    message: "How can I get my success story featured on your website?",
    type: "General",
    status: "Read",
    date: "2024-03-12",
  },
];

const Contact = () => {
  return (
    // <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Contact Messages</h1>
            <p className="text-sm text-muted-foreground">Manage inquiries and messages</p>
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
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Messages</p>
                <p className="text-xl font-semibold text-foreground">2,456</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-chart-orange" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">New</p>
                <p className="text-xl font-semibold text-foreground">45</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Read</p>
                <p className="text-xl font-semibold text-foreground">156</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-chart-green" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Replied</p>
                <p className="text-xl font-semibold text-foreground">2,255</p>
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
                <Input placeholder="Search by name, email, or subject..." className="pl-10" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select defaultValue="all-status">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-type">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-type">All Types</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Table */}
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id} className="border-border/50">
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{contact.subject}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{contact.message}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{contact.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          contact.status === "New"
                            ? "bg-chart-orange/10 text-chart-orange"
                            : contact.status === "Read"
                            ? "bg-info/10 text-info"
                            : "bg-chart-green/10 text-chart-green"
                        }
                      >
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{contact.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" /> View Full Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Reply className="w-4 h-4 mr-2" /> Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" /> Mark as Replied
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
    // </AdminLayout>
  );
};

export default Contact;
