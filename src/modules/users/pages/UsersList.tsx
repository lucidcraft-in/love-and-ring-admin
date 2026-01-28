import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, UserPlus, MoreHorizontal, Eye, Edit, Ban, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { ViewUserDialog } from "@/components/users/ViewUserDialog";
import { UserFilterDialog, type UserFilters } from "@/components/users/UserFilterDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsersAsync } from "@/store/slices/usersSlice";

const Users = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading, error, total } = useAppSelector((state) => state.users);
  console.log(users, "users");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [advancedFilters, setAdvancedFilters] = useState<UserFilters>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // Fetch all users for client-side pagination
    dispatch(fetchUsersAsync({ take: 1000 }));
  }, [dispatch]);

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // search
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        user.fullName?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.mobile?.includes(search);

      // gender - use advanced filter if set, otherwise use main filter
      const effectiveGender = advancedFilters.gender || genderFilter;
      const matchesGender = effectiveGender === "all" || user.gender === effectiveGender;

      // Membership - use advanced filter if set, otherwise use main filter
      const effectiveMembership = advancedFilters.membership || membershipFilter;
      const matchesMembership =
        effectiveMembership === "all" ||
        (effectiveMembership === "premium" && user.profileStatus === "COMPLETE") ||
        (effectiveMembership === "free" && user.profileStatus !== "COMPLETE");

      // Status - use advanced filter if set, otherwise use main filter
      const effectiveStatus = advancedFilters.status || statusFilter;
      const matchesStatus =
        effectiveStatus === "all" ||
        (effectiveStatus === "active" && user.approvalStatus === "APPROVED") ||
        (effectiveStatus === "pending" && user.approvalStatus === "PENDING") ||
        (effectiveStatus === "blocked" && user.approvalStatus === "REJECTED");

      // Advanced filters
      const matchesCity = !advancedFilters.city ||
        user.city?.city?.toLowerCase().includes(advancedFilters.city.toLowerCase());

      const matchesReligion = !advancedFilters.religion ||
        (typeof user.religion === 'string'
          ? user.religion.toLowerCase().includes(advancedFilters.religion.toLowerCase())
          : (user.religion && typeof user.religion === 'object' && 'religion' in user.religion)
            ? String((user.religion as any).religion || '').toLowerCase().includes(advancedFilters.religion.toLowerCase())
            : false);

      const matchesMaritalStatus = !advancedFilters.maritalStatus ||
        user.maritalStatus === advancedFilters.maritalStatus;

      // Age range filter
      const userAge = user.dateOfBirth ? calculateAge(user.dateOfBirth) : null;
      const matchesMinAge = advancedFilters.minAge === undefined ||
        (userAge !== null && typeof userAge === 'number' && userAge >= advancedFilters.minAge);
      const matchesMaxAge = advancedFilters.maxAge === undefined ||
        (userAge !== null && typeof userAge === 'number' && userAge <= advancedFilters.maxAge);

      // Date range filter
      const matchesCreatedAfter = !advancedFilters.createdAfter ||
        new Date(user.createdAt) >= new Date(advancedFilters.createdAfter);
      const matchesCreatedBefore = !advancedFilters.createdBefore ||
        new Date(user.createdAt) <= new Date(advancedFilters.createdBefore);

      return (
        matchesSearch &&
        matchesGender &&
        matchesMembership &&
        matchesStatus &&
        matchesCity &&
        matchesReligion &&
        matchesMaritalStatus &&
        matchesMinAge &&
        matchesMaxAge &&
        matchesCreatedAfter &&
        matchesCreatedBefore
      );
    })
  }, [users, searchTerm, genderFilter, membershipFilter, statusFilter, advancedFilters])

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleEditFromView = () => {
    setViewDialogOpen(false);
    setEditDialogOpen(true);
  };

  const handleUserAdded = () => {
    dispatch(fetchUsersAsync({ take: 1000 }));
  };

  const handleUserUpdated = () => {
    dispatch(fetchUsersAsync({ take: 1000 }));
  };

  const handleApplyFilters = (filters: UserFilters) => {
    setAdvancedFilters(filters);
    // Sync main filters with advanced filters if they're set
    if (filters.status) setStatusFilter(filters.status);
    if (filters.membership) setMembershipFilter(filters.membership);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setAdvancedFilters({});
    setGenderFilter("all");
    setMembershipFilter("all");
    setStatusFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Count active advanced filters (excluding those that match main filters)
  const activeFilterCount = Object.keys(advancedFilters).filter((key) => {
    if (key === 'gender' && advancedFilters.gender === genderFilter) return false;
    if (key === 'status' && advancedFilters.status === statusFilter) return false;
    if (key === 'membership' && advancedFilters.membership === membershipFilter) return false;
    const value = advancedFilters[key as keyof UserFilters];
    return value !== undefined && value !== "" && (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  // Helper function to map approval status to display status
  const getStatusDisplay = (approvalStatus?: string) => {
    switch (approvalStatus) {
      case "APPROVED":
        return "Active";
      case "PENDING":
        return "Pending";
      case "REJECTED":
        return "Blocked";
      default:
        return "Pending";
    }
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Helper function to safely extract string from ObjectId or string fields
  const getFieldValue = (field: any): string => {
    if (!field) return "N/A";
    // If it's an object with _id property (ObjectId), return the _id
    if (typeof field === "object" && field._id) {
      return field._id;
    }
    // If it's already a string, return it
    if (typeof field === "string") {
      return field;
    }
    return "N/A";
  };

  const stats = useMemo(() => {
    const totalUsers = users.length;

    const activeUsers = users.filter(
      (u) => u.approvalStatus === "APPROVED"
    ).length;

    const pendingUsers = users.filter(
      (u) => u.approvalStatus === "PENDING"
    ).length;

    const blockedUsers = users.filter(
      (u) => u.approvalStatus === "REJECTED"
    ).length;

    const premiumUsers = users.filter(
      (u) => u.profileStatus === "COMPLETE"
    ).length;

    return {
      totalUsers,
      activeUsers,
      premiumUsers,
      pendingUsers,
      blockedUsers,
    };
  }, [users]);


  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
            <p className="text-sm text-muted-foreground">Manage all registered users and profiles</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Users</p>
              <p className="text-2xl font-semibold text-primary mt-1">{stats.totalUsers}</p>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Users</p>
              <p className="text-2xl font-semibold text-chart-green mt-1">{stats.activeUsers}</p>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Premium Users</p>
              <p className="text-2xl font-semibold text-chart-orange mt-1">{stats.premiumUsers}</p>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Approval</p>
              <p className="text-2xl font-semibold text-chart-purple mt-1">{stats.pendingUsers}</p>
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
                  placeholder="Search users by name, email, or phone..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select defaultValue={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Gender</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue={membershipFilter} onValueChange={setMembershipFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Membership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Membership</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative"
                  onClick={() => setFilterDialogOpen(true)}
                >
                  <Filter className="w-4 h-4" />
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
                {/* Compact Pagination Controls */}
                <div className="flex items-center gap-2 border-l pl-2 ml-1">
                  <Select value={pageSize.toString()} onValueChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-16 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[3rem] text-center">
                    {currentPage}/{Math.ceil(filteredUsers.length / pageSize)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredUsers.length / pageSize), prev + 1))}
                    disabled={currentPage >= Math.ceil(filteredUsers.length / pageSize)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="text-muted-foreground">Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="text-destructive">
                        <p className="font-medium">Error loading users</p>
                        <p className="text-sm text-muted-foreground mt-1">{error}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <p className="text-muted-foreground">No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((user) => {
                      const status = getStatusDisplay(user.approvalStatus);
                      return (
                        <TableRow key={user._id} className="border-border/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-9 h-9">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName || user.email}&size=64`} />
                                <AvatarFallback>{user.fullName?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{user.fullName || "Unnamed"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{user.email}</p>
                              <p className="text-muted-foreground">
                                {user.mobile ? `${user.countryCode || ""} ${user.mobile}` : "N/A"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{user.gender || "N/A"}</TableCell>
                          <TableCell>{calculateAge(user.dateOfBirth)}</TableCell>
                          <TableCell>{user?.city?.city}</TableCell>
                          <TableCell>
                            <Badge variant={user.profileStatus === "COMPLETE" ? "default" : "secondary"}>
                              {user.profileStatus || "Basic"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                status === "Active"
                                  ? "border-chart-green text-chart-green"
                                  : status === "Pending"
                                    ? "border-chart-orange text-chart-orange"
                                    : "border-destructive text-destructive"
                              }
                            >
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                  <Eye className="w-4 h-4 mr-2" /> View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <Edit className="w-4 h-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>
                                <CheckCircle className="w-4 h-4 mr-2" /> Approve
                              </DropdownMenuItem> */}
                                <DropdownMenuItem className="text-destructive">
                                  <Ban className="w-4 h-4 mr-2" /> Block
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddUserDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onUserAdded={handleUserAdded} />
      <ViewUserDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        user={selectedUser}
        onEdit={handleEditFromView}
      />
      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />
      <UserFilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        filters={advancedFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </>
  );
};

export default Users;
