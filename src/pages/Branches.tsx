import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Building2, Users, IndianRupee, TrendingUp, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const branches = [
  {
    id: 1,
    name: "Mumbai Central",
    location: "Mumbai, Maharashtra",
    manager: "Rajesh Kumar",
    email: "mumbai@matchmate.com",
    phone: "+91 22 1234 5678",
    totalUsers: 8500,
    premiumUsers: 1250,
    monthlyRevenue: 456000,
    status: "Active",
  },
  {
    id: 2,
    name: "Delhi NCR",
    location: "New Delhi, Delhi",
    manager: "Priya Sharma",
    email: "delhi@matchmate.com",
    phone: "+91 11 1234 5678",
    totalUsers: 7200,
    premiumUsers: 1100,
    monthlyRevenue: 385000,
    status: "Active",
  },
  {
    id: 3,
    name: "Bangalore Tech Park",
    location: "Bangalore, Karnataka",
    manager: "Amit Singh",
    email: "bangalore@matchmate.com",
    phone: "+91 80 1234 5678",
    totalUsers: 6800,
    premiumUsers: 1450,
    monthlyRevenue: 520000,
    status: "Active",
  },
  {
    id: 4,
    name: "Hyderabad Hub",
    location: "Hyderabad, Telangana",
    manager: "Sneha Reddy",
    email: "hyderabad@matchmate.com",
    phone: "+91 40 1234 5678",
    totalUsers: 5400,
    premiumUsers: 890,
    monthlyRevenue: 298000,
    status: "Active",
  },
  {
    id: 5,
    name: "Chennai South",
    location: "Chennai, Tamil Nadu",
    manager: "Karthik Nair",
    email: "chennai@matchmate.com",
    phone: "+91 44 1234 5678",
    totalUsers: 4200,
    premiumUsers: 650,
    monthlyRevenue: 215000,
    status: "Inactive",
  },
];

const Branches = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Branch Management</h1>
            <p className="text-sm text-muted-foreground">Manage all branches and their performance</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Branch
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Branches</p>
                <p className="text-xl font-semibold text-foreground">12</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-chart-green" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Users</p>
                <p className="text-xl font-semibold text-foreground">42,964</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-chart-orange" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Revenue</p>
                <p className="text-xl font-semibold text-foreground">₹24.5L</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Growth</p>
                <p className="text-xl font-semibold text-foreground">+15.8%</p>
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
                <Input placeholder="Search branches..." className="pl-10" />
              </div>
              <div className="flex flex-wrap gap-2">
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
                <Select defaultValue="all-state">
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-state">All States</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branches Table */}
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Branch</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Total Users</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Monthly Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch.id} className="border-border/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{branch.name}</p>
                        <p className="text-sm text-muted-foreground">{branch.location}</p>
                      </div>
                    </TableCell>
                    <TableCell>{branch.manager}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{branch.email}</p>
                        <p className="text-muted-foreground">{branch.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{branch.totalUsers.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-chart-orange/10 text-chart-orange">
                        {branch.premiumUsers.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-chart-green">
                      ₹{(branch.monthlyRevenue / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          branch.status === "Active"
                            ? "border-chart-green text-chart-green"
                            : "border-muted-foreground text-muted-foreground"
                        }
                      >
                        {branch.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
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

export default Branches;
