import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, UserCog, Users, Activity, Award, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StaffViewDialog } from "../components/StaffViewDialog";
import { StaffEditDialog } from "../components/StaffEditDialog";
import { StaffDeleteDialog } from "../components/StaffDeleteDialog";
import { StaffAddDialog } from "../components/StaffAddDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStaffListAsync, setCurrentStaff } from "@/store/slices/staffSlice";
import { fetchBranchesAsync } from "@/store/slices/branchSlice";
import { Staff } from "@/services/staffService";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchRolesAsync } from "@/store/slices/roleSlice";
import { StaffPermissionsDialog } from "../components/StaffPermissionDialog";
import { Shield } from "lucide-react";

export default function StaffList() {
  const dispatch = useAppDispatch();
  const { staffList, total, listLoading } = useAppSelector((state) => state.staff);
  // const { roles } = useAppSelector((state) => state.role);
  console.log(staffList, "data in the staff list");
  console.log(total, "data in the total");
  console.log(listLoading, "data in the list loading");
  // const { branches } = useAppSelector((state) => state.branch);

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [permissionOpen, setPermissionOpen] = useState(false)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all-role");
  const [branchFilter, setBranchFilter] = useState("all-branch");
  const [statusFilter, setStatusFilter] = useState("all-status");

  // Fetch staff list and branches on mount
  // useEffect(() => {
  //   dispatch(fetchStaffListAsync({ take: 100 }));
  //   dispatch(fetchBranchesAsync({ take: 100 }));
  // }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRolesAsync())
  }, [])

  // Refetch when filters change
  useEffect(() => {
    const params: any = { take: 100 };

    if (searchQuery) params.search = searchQuery;
    if (roleFilter !== "all-role") params.role = roleFilter;
    if (branchFilter !== "all-branch") params.branch = branchFilter;
    if (statusFilter !== "all-status") params.status = statusFilter;

    const debounce = setTimeout(() => {
      dispatch(fetchStaffListAsync(params));
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, roleFilter, branchFilter, statusFilter, dispatch]);

  const handleView = (member: Staff) => {
    setSelectedStaff(member);
    dispatch(setCurrentStaff(member));
    setViewOpen(true);
  };

  const handleEdit = (member: Staff) => {
    setSelectedStaff(member);
    dispatch(setCurrentStaff(member));
    setEditOpen(true);
  };

  const handleDelete = (member: Staff) => {
    setSelectedStaff(member);
    setDeleteOpen(true);
  };

  // // Get branch name from ID or nested object
  // const getBranchName = (branch: any) => {
  //   // If branch is already an object with name property
  //   if (typeof branch === 'object' && branch?.name) {
  //     return branch.name;
  //   }
  //   // If branch is a string ID, find it in branches list
  //   if (typeof branch === 'string') {
  //     const foundBranch = branches.find((b) => b._id === branch);
  //     return foundBranch?.name || branch;
  //   }
  //   return 'N/A';
  // };

  // Calculate stats
  const activeStaff = staffList.filter((s) => s.status === "Active").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Staff Management</h1>
          <p className="text-sm text-muted-foreground">Manage staff members and their roles</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddOpen(true)}>
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
              <p className="text-xl font-semibold text-foreground">{total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-chart-green" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Staff</p>
              <p className="text-xl font-semibold text-foreground">{activeStaff}</p>
            </div>
          </CardContent>
        </Card>
        {/* <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-chart-orange" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Branches</p>
              <p className="text-xl font-semibold text-foreground">{branches.length}</p>
            </div>
          </CardContent>
        </Card> */}
        {/* <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Roles</p>
              <p className="text-xl font-semibold text-foreground">3</p>
            </div>
          </CardContent>
        </Card> */}
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-chart-green" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Inactive Staff</p>
              <p className="text-xl font-semibold text-foreground">{total - activeStaff}</p>
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
                placeholder="Search staff..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {/* <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-role">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role._id} value={role._id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
              {/* <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-branch">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
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

      {/* Staff Table */}
      <Card className="stat-card-shadow border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Staff Member</TableHead>
                <TableHead>Contact</TableHead>
                {/* <TableHead>Role</TableHead> */}
                {/* <TableHead>Branch</TableHead> */}
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-9 h-9 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    {/* <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell> */}
                    {/* <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell> */}
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : staffList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No staff members found
                  </TableCell>
                </TableRow>
              ) : (
                staffList.map((member) => (
                  <TableRow key={member._id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName)}&background=random`}
                          />
                          <AvatarFallback>{member.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{member.email}</p>
                        {member.phone && <p className="text-muted-foreground">{member.phone}</p>}
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <Badge variant="outline">{member?.role?.name}</Badge>
                    </TableCell> */}
                    {/* <TableCell className="text-sm">{getBranchName(member.branch)}</TableCell> */}
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
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(member.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(member)}>
                            <Eye className="w-4 h-4 mr-2" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(member)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          {member.status === "Active" && (
                            <DropdownMenuItem onClick={() => { setSelectedStaff(member); setPermissionOpen(true); }}>
                              <Shield className="w-4 h-4 mr-2" />Edit Permissions
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(member)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <StaffAddDialog open={addOpen} onOpenChange={setAddOpen} />
      <StaffViewDialog open={viewOpen} onOpenChange={setViewOpen} staff={selectedStaff} />
      <StaffEditDialog open={editOpen} onOpenChange={setEditOpen} staff={selectedStaff} />
      <StaffPermissionsDialog open={permissionOpen} onOpenChange={setPermissionOpen} staff={selectedStaff} />
      <StaffDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} staff={selectedStaff} />

    </div>
  );
}
