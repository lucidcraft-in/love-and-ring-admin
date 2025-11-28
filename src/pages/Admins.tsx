import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, Shield, ShieldCheck, UserCog, Settings, MoreHorizontal, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

const admins = [
  {
    id: 1,
    name: "Super Admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    email: "superadmin@matchmate.com",
    role: "Super Admin",
    status: "Active",
    lastLogin: "Online now",
  },
  {
    id: 2,
    name: "Rajesh Mehta",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    email: "rajesh.mehta@matchmate.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2 hours ago",
  },
  {
    id: 3,
    name: "Priya Kapoor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    email: "priya.kapoor@matchmate.com",
    role: "Branch Admin",
    status: "Active",
    lastLogin: "1 day ago",
  },
];

const roles = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full access to all features",
    usersCount: 1,
    permissions: {
      viewProfiles: true,
      editProfiles: true,
      deleteProfiles: true,
      approveProfiles: true,
      managePayments: true,
      manageBranches: true,
      viewReports: true,
      manageStaff: true,
      manageAdmins: true,
      manageSettings: true,
    },
  },
  {
    id: 2,
    name: "Admin",
    description: "Administrative access with limited settings",
    usersCount: 3,
    permissions: {
      viewProfiles: true,
      editProfiles: true,
      deleteProfiles: true,
      approveProfiles: true,
      managePayments: true,
      manageBranches: true,
      viewReports: true,
      manageStaff: true,
      manageAdmins: false,
      manageSettings: false,
    },
  },
  {
    id: 3,
    name: "Branch Admin",
    description: "Manage branch-specific operations",
    usersCount: 12,
    permissions: {
      viewProfiles: true,
      editProfiles: true,
      deleteProfiles: false,
      approveProfiles: true,
      managePayments: false,
      manageBranches: false,
      viewReports: true,
      manageStaff: true,
      manageAdmins: false,
      manageSettings: false,
    },
  },
  {
    id: 4,
    name: "Support Staff",
    description: "Handle customer support and basic operations",
    usersCount: 24,
    permissions: {
      viewProfiles: true,
      editProfiles: false,
      deleteProfiles: false,
      approveProfiles: false,
      managePayments: false,
      manageBranches: false,
      viewReports: false,
      manageStaff: false,
      manageAdmins: false,
      manageSettings: false,
    },
  },
];

const permissionLabels: Record<string, string> = {
  viewProfiles: "View Profiles",
  editProfiles: "Edit Profiles",
  deleteProfiles: "Delete Profiles",
  approveProfiles: "Approve Profiles",
  managePayments: "Manage Payments",
  manageBranches: "Manage Branches",
  viewReports: "View Reports",
  manageStaff: "Manage Staff",
  manageAdmins: "Manage Admins",
  manageSettings: "Manage Settings",
};

const Admins = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Admin & Role Management</h1>
            <p className="text-sm text-muted-foreground">Manage administrators and role permissions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Super Admins</p>
                <p className="text-xl font-semibold text-foreground">1</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-chart-orange" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Admins</p>
                <p className="text-xl font-semibold text-foreground">3</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
                <UserCog className="w-5 h-5 text-chart-green" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Branch Admins</p>
                <p className="text-xl font-semibold text-foreground">12</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Roles Defined</p>
                <p className="text-xl font-semibold text-foreground">4</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="admins" className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="admins">Administrators</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            </TabsList>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          </div>

          <TabsContent value="admins" className="space-y-4">
            {/* Filters */}
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search admins..." className="pl-10" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select defaultValue="all-role">
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-role">All Roles</SelectItem>
                        <SelectItem value="super-admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="branch-admin">Branch Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admins Table */}
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Admin</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id} className="border-border/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarImage src={admin.avatar} />
                              <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{admin.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              admin.role === "Super Admin"
                                ? "border-primary text-primary"
                                : admin.role === "Admin"
                                ? "border-chart-orange text-chart-orange"
                                : "border-chart-green text-chart-green"
                            }
                          >
                            {admin.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-chart-green/10 text-chart-green"
                          >
                            {admin.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{admin.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" /> View
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
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {roles.map((role) => (
                <Card key={role.id} className="stat-card-shadow border-0">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{role.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                      <Badge variant="secondary">{role.usersCount} users</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(role.permissions).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          {value ? (
                            <CheckCircle className="w-4 h-4 text-chart-green" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className={value ? "text-foreground" : "text-muted-foreground"}>
                            {permissionLabels[key]}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50 flex justify-end">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" /> Edit Role
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Admins;
