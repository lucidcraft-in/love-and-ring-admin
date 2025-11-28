import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, UserPlus, MoreHorizontal, Eye, Edit, Ban, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const users = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    gender: "Female",
    age: 26,
    location: "Mumbai, India",
    membership: "Premium",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Rahul Verma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    email: "rahul.verma@email.com",
    phone: "+91 98765 43211",
    gender: "Male",
    age: 29,
    location: "Delhi, India",
    membership: "Free",
    status: "Active",
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Anjali Patel",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    email: "anjali.patel@email.com",
    phone: "+91 98765 43212",
    gender: "Female",
    age: 24,
    location: "Ahmedabad, India",
    membership: "Premium",
    status: "Pending",
    joinDate: "2024-03-10",
  },
  {
    id: 4,
    name: "Vikram Singh",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    email: "vikram.singh@email.com",
    phone: "+91 98765 43213",
    gender: "Male",
    age: 31,
    location: "Bangalore, India",
    membership: "Free",
    status: "Blocked",
    joinDate: "2024-01-05",
  },
  {
    id: 5,
    name: "Sneha Reddy",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    email: "sneha.reddy@email.com",
    phone: "+91 98765 43214",
    gender: "Female",
    age: 27,
    location: "Hyderabad, India",
    membership: "Premium",
    status: "Active",
    joinDate: "2024-02-28",
  },
];

const Users = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
            <p className="text-sm text-muted-foreground">Manage all registered users and profiles</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Users</p>
              <p className="text-2xl font-semibold text-primary mt-1">42,964</p>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Users</p>
              <p className="text-2xl font-semibold text-chart-green mt-1">38,421</p>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Premium Users</p>
              <p className="text-2xl font-semibold text-chart-orange mt-1">8,924</p>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Approval</p>
              <p className="text-2xl font-semibold text-chart-purple mt-1">156</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search users by name, email, or phone..." className="pl-10" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select defaultValue="all-gender">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-gender">All Gender</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-membership">
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Membership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-membership">All Membership</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-status">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{user.email}</p>
                        <p className="text-muted-foreground">{user.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.age}</TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>
                      <Badge variant={user.membership === "Premium" ? "default" : "secondary"}>
                        {user.membership}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.status === "Active"
                            ? "border-chart-green text-chart-green"
                            : user.status === "Pending"
                            ? "border-chart-orange text-chart-orange"
                            : "border-destructive text-destructive"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
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
                          <DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="w-4 h-4 mr-2" /> Block
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

export default Users;
