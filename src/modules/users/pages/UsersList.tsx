import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, UserPlus, MoreHorizontal, Eye, Edit, Ban, CheckCircle, CheckCircle2, Clock, AlertCircle, Trash2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { ViewUserDialog } from "@/components/users/ViewUserDialog";
import { UserFilterDialog, type UserFilters } from "@/components/users/UserFilterDialog";
import { DeleteUserReasonDialog } from "@/components/users/DeleteUserReasonDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsersAsync, deleteUserAsync } from "@/store/slices/usersSlice";

const Users = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading, error, total, deleteLoading } = useAppSelector((state) => state.users);
  console.log(users, "user data")

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [deleteReasonDialogOpen, setDeleteReasonDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [advancedFilters, setAdvancedFilters] = useState<UserFilters>({});
  const [createdByFilter, setCreatedByFilter] = useState('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    const saved = localStorage.getItem("users_pageSize");
    return saved ? Number(saved) : 10;
  });

  useEffect(() => {
    localStorage.setItem("users_pageSize", pageSize.toString());
  }, [pageSize]);

  // get loged user data
  const authString = localStorage.getItem("auth");
  const auth = authString ? JSON.parse(authString) : null;
  console.log(auth, "user data login");

  const canShowActions =
    auth?.permissions?.viewProfiles ||
    auth?.permissions?.editProfiles ||
    auth?.permissions?.deleteProfiles;



  useEffect(() => {
    // Fetch all users for client-side pagination
    dispatch(fetchUsersAsync({ take: 1000 }));
  }, [dispatch]);

  // Helper function to extract membership plan title
  const getMembershipPlanTitle = (user: any): string => {
    if (!user) return "Free Plan";
    const plan = user.membership?.plan;
    if (plan) {
      if (typeof plan === "object") {
        const title = plan.title || plan.name;
        if (title) return title;
      } else if (typeof plan === "string" && plan.trim()) {
        return plan;
      }
    }
    if (user.profileStatus && typeof user.profileStatus === "string" && user.profileStatus.toLowerCase().includes("million")) {
      return "Million Club";
    }
    return "Free Plan";
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth?: string | Date) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) return "N/A";
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : "N/A";
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

      // Creatd by
      const created = advancedFilters.createdByModel || createdByFilter;
      const matchCreated = created === "all" || user.createdByModel === created;

      // Membership - use advanced filter if set, otherwise use main filter
      const effectiveMembership = advancedFilters.membership || membershipFilter;
      const userPlanTitle = getMembershipPlanTitle(user);
      const isUserPremium = userPlanTitle !== "Free Plan";
      const matchesMembership =
        effectiveMembership === "all" ||
        (effectiveMembership === "premium" && isUserPremium) ||
        (effectiveMembership === "free" && !isUserPremium);

      // Status - use advanced filter if set, otherwise use main filter
      const effectiveStatus = advancedFilters.status || statusFilter;
      const normalizedStatus = effectiveStatus.toLowerCase();
      const userStatus = (
        user.approvalStatus === "INACTIVE" || user.isActive === false
          ? "inactive"
          : user.approvalStatus === "APPROVED"
          ? "active"
          : user.approvalStatus === "PENDING"
          ? "pending"
          : user.approvalStatus === "REJECTED"
          ? "blocked"
          : "active"
      );
      const matchesStatus =
        normalizedStatus === "all" || normalizedStatus === userStatus;

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
        matchCreated &&
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
  }, [users, searchTerm, genderFilter, membershipFilter, statusFilter, advancedFilters, createdByFilter])

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

  const handleInitiateDelete = (user: any) => {
    setUserToDelete(user);
    setDeleteReasonDialogOpen(true);
  };

  const handleConfirmDeleteUser = async (reason: string) => {
    if (!userToDelete?._id) return;
    const result = await dispatch(deleteUserAsync({ userId: userToDelete._id, reason }));
    if (deleteUserAsync.fulfilled.match(result)) {
      setDeleteReasonDialogOpen(false);
      setUserToDelete(null);
    }
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
    setCreatedByFilter("all")
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

  const isProfileComplete = (u: any): boolean => {
    if (!u) return false;
    if (u.profileStatus === "COMPLETED" || u.profileStatus === "Completed") return true;
    const hasBasic = Boolean(u.fullName && u.email && u.mobile && u.gender && u.dateOfBirth);
    const hasPersonal = Boolean(u.heightCm || u.maritalStatus);
    const hasEduWork = Boolean(u.primaryEducation || u.profession || u.highestEducation);
    return hasBasic && hasPersonal && hasEduWork;
  };

  // Helper function to map approval status to display status
  const getStatusDisplay = (user: any) => {
    const approvalStatus = typeof user === "string" ? user : user?.approvalStatus;
    const isActive = typeof user === "object" ? user?.isActive : undefined;

    if (approvalStatus === "INACTIVE" || isActive === false) {
      return "Inactive";
    }
    switch (approvalStatus) {
      case "APPROVED":
        return "Active";
      case "PENDING":
        return "Pending";
      case "REJECTED":
        return "Blocked";
      default:
        return "Active";
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
      (u) => getMembershipPlanTitle(u) !== "Free Plan"
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
      <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 animate-fade-in">
        {/* Fixed Header Section */}
        <div className="flex-none space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
              <p className="text-sm text-muted-foreground">Manage all registered users and profiles</p>
            </div>

            {auth?.permissions?.createProfiles &&
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddDialogOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            }
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
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
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
                      <SelectItem value="Gay">Gay</SelectItem>
                      <SelectItem value="Lesbian">Lesbian</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue={createdByFilter} onValueChange={setCreatedByFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Consultant">Consultant</SelectItem>
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
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Blocked">Blocked</SelectItem>
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
                  {(searchTerm || genderFilter !== "all" || membershipFilter !== "all" || statusFilter !== "all" || activeFilterCount > 0) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClearFilters}
                      title="Reset Filters"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
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
        </div>

        {/* Scrollable Table Section */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <Card className="stat-card-shadow border-0 h-full flex flex-col">
            <CardContent className="p-0 flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="sticky top-0 bg-card z-10">User</TableHead>
                    <TableHead className="sticky top-0 bg-card z-10">Contact</TableHead>
                    <TableHead className="sticky top-0 bg-card z-10">Gender</TableHead>
                    <TableHead className="sticky top-0 bg-card z-10">Age</TableHead>
                    {/* <TableHead className="sticky top-0 bg-card z-10">Location</TableHead> */}
                    <TableHead className="sticky top-0 bg-card z-10">Membership</TableHead>
                    <TableHead className="sticky top-0 bg-card z-10">Status</TableHead>
                    <TableHead className="sticky top-0 bg-card z-10">Created</TableHead>
                    <TableHead className="sticky top-0 bg-card z-10">Created By</TableHead>
                    <TableHead className="sticky top-0 bg-card z-10">Joined</TableHead>
                    {canShowActions &&
                      <TableHead className="sticky top-0 bg-card z-10 text-right">Actions</TableHead>

                    }
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
                        const status = getStatusDisplay(user);
                        return (
                          <TableRow key={user._id} className="border-border/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-9 h-9">
                                  {user.photos && user.photos.length > 0 ? (
                                    <AvatarImage
                                      src={user.photos.find((p: any) => p.isPrimary)?.url || user.photos[0].url}
                                      className="object-cover"
                                    />
                                  ) : (
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName || user.email}&size=64`} />
                                  )}
                                  <AvatarFallback>{(user.fullName?.charAt(0) || user.email.charAt(0)).toUpperCase()}</AvatarFallback>
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
                            {/* <TableCell>{user?.city?.city}</TableCell> */}
                            <TableCell>
                              {(() => {
                                const planTitle = getMembershipPlanTitle(user);
                                const isFree = planTitle === "Free Plan";
                                return (
                                  <Badge
                                    variant={isFree ? "secondary" : "default"}
                                    className={
                                      !isFree
                                        ? "bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-xs"
                                        : "bg-muted text-muted-foreground"
                                    }
                                  >
                                    {planTitle}
                                  </Badge>
                                );
                              })()}
                            </TableCell>
                             <TableCell>
                              <div className="flex flex-col gap-1.5 items-start whitespace-nowrap">
                                {/* Account Status Badge */}
                                {status === "Active" ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Active
                                  </span>
                                ) : status === "Inactive" ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    Inactive
                                  </span>
                                ) : status === "Pending" ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Pending
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                    Blocked
                                  </span>
                                )}

                                {/* Profile Completion Badge */}
                                {isProfileComplete(user) ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    Completed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 shadow-2xs">
                                    <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                                    Not Completed
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{user?.createdByModel || "User"}</TableCell>
                            <TableCell>{user?.createdBy?.fullName || user?.fullName}</TableCell>
                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                            {canShowActions &&
                              <TableCell className="text-right">

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {auth?.permissions?.viewProfiles &&
                                      <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                        <Eye className="w-4 h-4 mr-2" /> View Profile
                                      </DropdownMenuItem>
                                    }

                                    {auth?.permissions?.editProfiles &&
                                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                        <Edit className="w-4 h-4 mr-2" /> Edit
                                      </DropdownMenuItem>
                                    }

                                    {/* <DropdownMenuItem>
                                  <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                </DropdownMenuItem> */}
                                    {auth?.permissions?.deleteProfiles &&
                                      <DropdownMenuItem className="text-destructive"
                                        onClick={() => handleInitiateDelete(user)}
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                      </DropdownMenuItem>
                                    }
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            }
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
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
      <DeleteUserReasonDialog
        open={deleteReasonDialogOpen}
        onOpenChange={setDeleteReasonDialogOpen}
        user={userToDelete}
        onConfirmDelete={handleConfirmDeleteUser}
        loading={deleteLoading}
      />
    </>
  );
};

export default Users;
