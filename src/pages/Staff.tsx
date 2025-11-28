import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, UserCog, Users, Activity, Award, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const staff = [
  {
    id: 1,
    name: "Anita Desai",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    email: "anita.desai@matchmate.com",
    phone: "+91 98765 43210",
    role: "Branch Admin",
    branch: "Mumbai Central",
    profilesHandled: 245,
    matchesSuggested: 89,
    status: "Active",
    lastLogin: "2 hours ago",
  },
  {
    id: 2,
    name: "Suresh Kumar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    email: "suresh.kumar@matchmate.com",
    phone: "+91 98765 43211",
    role: "Support Staff",
    branch: "Delhi NCR",
    profilesHandled: 189,
    matchesSuggested: 56,
    status: "Active",
    lastLogin: "30 minutes ago",
  },
  {
    id: 3,
    name: "Meera Sharma",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    email: "meera.sharma@matchmate.com",
    phone: "+91 98765 43212",
    role: "Matchmaker",
    branch: "Bangalore Tech Park",
    profilesHandled: 312,
    matchesSuggested: 145,
    status: "Active",
    lastLogin: "1 hour ago",
  },
  {
    id: 4,
    name: "Rahul Verma",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    email: "rahul.verma@matchmate.com",
    phone: "+91 98765 43213",
    role: "Support Staff",
    branch: "Hyderabad Hub",
    profilesHandled: 156,
    matchesSuggested: 42,
    status: "Inactive",
    lastLogin: "3 days ago",
  },
  {
    id: 5,
    name: "Priya Nair",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    email: "priya.nair@matchmate.com",
    phone: "+91 98765 43214",
    role: "Branch Admin",
    branch: "Chennai South",
    profilesHandled: 278,
    matchesSuggested: 98,
    status: "Active",
    lastLogin: "4 hours ago",
  },
];

const Staff = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Staff Management</h1>
            <p className="text-sm text-muted-foreground">Manage staff members and their roles</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserCog className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Staff</p>
                <p className="text-xl font-semibold text-foreground">48</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-chart-green" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Now</p>
                <p className="text-xl font-semibold text-foreground">32</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-chart-orange" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Profiles Handled</p>
                <p className="text-xl font-semibold text-foreground">12,456</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Matches Made</p>
                <p className="text-xl font-semibold text-foreground">3,892</p>
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
                <Input placeholder="Search staff..." className="pl-10" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select defaultValue="all-role">
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-role">All Roles</SelectItem>
                    <SelectItem value="branch-admin">Branch Admin</SelectItem>
                    <SelectItem value="matchmaker">Matchmaker</SelectItem>
                    <SelectItem value="support">Support Staff</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-branch">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-branch">All Branches</SelectItem>
                    <SelectItem value="mumbai">Mumbai Central</SelectItem>
                    <SelectItem value="delhi">Delhi NCR</SelectItem>
                    <SelectItem value="bangalore">Bangalore Tech Park</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad Hub</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-status">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff Table */}
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Profiles</TableHead>
                  <TableHead>Matches</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{member.email}</p>
                        <p className="text-muted-foreground">{member.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.role}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{member.branch}</TableCell>
                    <TableCell className="font-medium">{member.profilesHandled}</TableCell>
                    <TableCell className="font-medium text-chart-green">{member.matchesSuggested}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          member.status === "Active"
                            ? "border-chart-green text-chart-green"
                            : "border-muted-foreground text-muted-foreground"
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{member.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" /> Remove
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
    </AdminLayout>
  );
};

export default Staff;
