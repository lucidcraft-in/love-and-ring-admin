import { useState, useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRolesAsync, setCurrentRole } from "@/store/slices/roleSlice";
import { fetchAdminsAsync, setCurrentAdmin, deleteAdminAsync } from "@/store/slices/adminSlice";
import { Role } from "@/services/roleService";
import { Admin } from "@/services/adminService";
import { RoleAddDialog } from "@/components/roles/RoleAddDialog";
import { RoleEditDialog } from "@/components/roles/RoleEditDialog";
import { RoleDeleteDialog } from "@/components/roles/RoleDeleteDialog";
import { AdminAddDialog } from "@/components/admins/AdminAddDialog";
import  AdminEditDialog  from "@/components/admins/AdminEditDialog";
import { AdminDeleteDialog } from "@/components/admins/AdminDeleteDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatsCountAsync } from "@/store/slices/adminSlice";



const permissionLabels: Record<string, string> = {
  viewProfiles: "View Profiles",
  editProfiles: "Edit Profiles",
  deleteProfiles: "Delete Profiles",
  approveProfiles: "Approve Profiles",
  managePayments: "Manage Payments",
  // manageBranches: "Manage Branches",
  viewReports: "View Reports",
  manageStaff: "Manage Staff",
  manageAdmins: "Manage Admins",
  manageSettings: "Manage Settings",
};

const Admins = () => {
  const dispatch = useAppDispatch();
  const { roles, listLoading: rolesLoading } = useAppSelector((state) => state.role);
  const { admins, listLoading: adminsLoading, currentAdmin, stats } = useAppSelector((state) => state.admin);

  const totalAdmins = stats?.totalAdmins || 0;
  const activeAdmins = stats?.activeAdmins || 0;
  const inactiveAdmins = stats?.inactiveAdmins || 0;
  const totalRoles = stats?.totalRoles || 0;

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [deleteRoleOpen, setDeleteRoleOpen] = useState(false);

  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [editAdminOpen, setEditAdminOpen] = useState(false);
  const [deleteAdminOpen, setDeleteAdminOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("admins");

  // Admin Pagination & Filters
  const [adminPage, setAdminPage] = useState(1);
  const [adminPageSize, setAdminPageSize] = useState(10);
  const [adminRoleFilter, setAdminRoleFilter] = useState("all-role");
  const [adminSearch, setAdminSearch] = useState("");
  const [adminStatusFilter, setAdminStatusFilter] = useState("all");

  // Fetch roles when component mounts or when switching to roles tab
  useEffect(() => {
    if (activeTab === "roles") {
      dispatch(fetchRolesAsync());
    } else if (activeTab === "admins") {
      const skip = (adminPage - 1) * adminPageSize;
      dispatch(fetchAdminsAsync({
        skip,
        take: adminPageSize,
        role: adminRoleFilter === "all-role" ? undefined : adminRoleFilter,
        status: adminStatusFilter === "all" ? undefined : adminStatusFilter,
      }));
      // We also need roles to filter and display in add/edit dialogs
      if (roles.length === 0) dispatch(fetchRolesAsync());
    }
  }, [activeTab, dispatch, adminPage, adminPageSize, adminRoleFilter, adminStatusFilter, roles.length]);

  useEffect(() => {
    dispatch(getStatsCountAsync());
  }, [dispatch]);

  const handleEditAdmin = (admin: Admin) => {
    dispatch(setCurrentAdmin(admin));
    setEditAdminOpen(true);
  };

  const handleDeleteAdmin = (admin: Admin) => {
    dispatch(setCurrentAdmin(admin));
    setDeleteAdminOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    dispatch(setCurrentRole(role));
    setEditRoleOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setDeleteRoleOpen(true);
  };

  return (
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
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Admins</p>
              <p className="text-xl font-semibold text-foreground">{totalAdmins}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-chart-orange" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Admins</p>
              <p className="text-xl font-semibold text-foreground">{activeAdmins}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-chart-green" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Inactive Admins</p>
              <p className="text-xl font-semibold text-foreground">{inactiveAdmins}</p>
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
              <p className="text-xl font-semibold text-foreground">{totalRoles}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="admins">Administrators</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          </TabsList>
          {activeTab === "admins" ? (
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddAdminOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          ) : (
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddRoleOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          )}
        </div>

        <TabsContent value="admins" className="space-y-4">
          {/* Filters */}
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search admins..."
                    className="pl-10"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={adminRoleFilter} onValueChange={(value) => {
                    setAdminRoleFilter(value);
                    setAdminPage(1);
                  }}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-role">All Roles</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role._id} value={role._id}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={adminStatusFilter} onValueChange={(value) => {
                    setAdminStatusFilter(value);
                    setAdminPage(1);
                  }}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admins Table */}
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-0">
              {adminsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : admins.length === 0 ? (
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  No admins found.
                </div>
              ) : (
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
                    {admins.filter(a =>
                      a.fullName.toLowerCase().includes(adminSearch.toLowerCase()) ||
                      (a.email && a.email.toLowerCase().includes(adminSearch.toLowerCase()))
                    ).map((admin) => (
                      <TableRow key={admin._id} className="border-border/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback>{admin.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{admin.fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-primary text-primary"
                          >
                            {admin?.role?.name || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={admin.status === 'Active' ? "bg-chart-green/10 text-chart-green" : "bg-destructive/10 text-destructive"}
                          >
                            {admin.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditAdmin(admin)}>
                                <Edit className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAdmin(admin)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          {rolesLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="stat-card-shadow border-0">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-5 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : roles.length === 0 ? (
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-8 text-center text-muted-foreground">
                No roles found. Create your first role to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {roles.map((role) => (
                <Card key={role._id} className="stat-card-shadow border-0">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{role.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{role.description || "No description"}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteRole(role)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {role.permissions && Object.entries(role.permissions).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          {value ? (
                            <CheckCircle className="w-4 h-4 text-chart-green" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className={value ? "text-foreground" : "text-muted-foreground"}>
                            {permissionLabels[key] || key}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Role Dialogs */}
      <RoleAddDialog open={addRoleOpen} onOpenChange={setAddRoleOpen} />
      <RoleEditDialog open={editRoleOpen} onOpenChange={setEditRoleOpen} role={selectedRole} />
      <RoleDeleteDialog open={deleteRoleOpen} onOpenChange={setDeleteRoleOpen} role={selectedRole} />

      {/* Admin Dialogs */}
      <AdminAddDialog open={addAdminOpen} onOpenChange={setAddAdminOpen} />
      <AdminEditDialog open={editAdminOpen} onOpenChange={setEditAdminOpen} admin={currentAdmin} />
      <AdminDeleteDialog open={deleteAdminOpen} onOpenChange={setDeleteAdminOpen} admin={currentAdmin} />
    </div>
  );
};

export default Admins;
