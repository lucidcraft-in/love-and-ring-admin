import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, TrendingUp, Clock, Heart, Activity, Eye, Edit, Trash2, Plus, LogOut,
  Bell, Settings, Search, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutStaff } from "@/store/slices/staffSlice";
import { fetchUsersAsync, deleteUserAsync, User } from "@/store/slices/usersSlice";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { ViewUserDialog } from "@/components/users/ViewUserDialog";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  // Redux state
  const { currentStaffUser, isAuthenticated } = useAppSelector((state) => state.staff);
  console.log(currentStaffUser, "current user data in the staff")
  const { users, isLoading: usersLoading, deleteLoading } = useAppSelector((state) => state.users);

  // Dialog state
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users when component mounts
  useEffect(() => {
    if (isAuthenticated && currentStaffUser) {
      dispatch(fetchUsersAsync({ take: 1000 }));
    }
  }, [dispatch, isAuthenticated, currentStaffUser]);

  const handleLogout = () => {
    dispatch(logoutStaff());
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/staff/login");
  };

  const handleUserAdded = () => {
    // Refresh users list
    dispatch(fetchUsersAsync({ take: 1000 }));
    toast({
      title: "Success",
      description: "User profile created successfully",
    });
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await dispatch(deleteUserAsync(selectedUser._id)).unwrap();
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleUserUpdated = () => {
    // Refresh users list
    dispatch(fetchUsersAsync({ take: 1000 }));
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats from real user data
  const stats = [
    {
      title: "Total Profiles",
      value: users.length,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Active Profiles",
      value: users.filter(u => u.isActive && !u.isDeleted).length,
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Pending Review",
      value: users.filter(u => u.approvalStatus === "PENDING").length,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    {
      title: "Approved",
      value: users.filter(u => u.approvalStatus === "APPROVED").length,
      icon: Heart,
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900/30"
    },
  ];

  const getStatusBadge = (status?: string) => {
    const styles = {
      APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  };

  // Calculate age from date of birth
  const calculateAge = (dob?: string) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Show loading state
  if (!currentStaffUser || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" fill="currentColor" />
            </div>
            <span className="font-semibold text-lg">Staff Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{currentStaffUser.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{currentStaffUser.fullName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {currentStaffUser.fullName}!</h1>
            <p className="text-muted-foreground">Manage your assigned tasks and profiles</p>
          </div>
          {/* Check permissions if available in currentStaffUser, otherwise default to show */}
          {currentStaffUser.permissions.createProfile &&
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Profile
            </Button>
          }

        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profiles Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Member Profiles</CardTitle>
                  <CardDescription>Profiles you manage</CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search profiles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Age</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">
                            <div>
                              {user.fullName || user.email}
                              <p className="text-xs text-muted-foreground md:hidden">
                                {calculateAge(user.dateOfBirth)}y • {user.city?.city || "N/A"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{calculateAge(user.dateOfBirth)}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.city?.city || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getStatusBadge(user.approvalStatus)}>
                              {user.approvalStatus || "PENDING"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              {currentStaffUser.permissions.viewProfile &&
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleViewUser(user)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              }
                              {currentStaffUser.permissions.editProfile &&
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              }
                              {currentStaffUser.permissions.deleteProfile &&
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteUser(user)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              }

                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed - Coming Soon */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest actions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Activity tracking coming soon...
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Permissions</CardTitle>
            <CardDescription>Access levels assigned by admin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant={currentStaffUser.permissions.viewProfile ? "default" : "secondary"}>
                {currentStaffUser.permissions.viewProfile ? "✓" : "✗"} View Profiles
              </Badge>
              <Badge variant={currentStaffUser.permissions.createProfile ? "default" : "secondary"}>
                {currentStaffUser.permissions.createProfile ? "✓" : "✗"} Create Profiles
              </Badge>
              <Badge variant={currentStaffUser.permissions.editProfile ? "default" : "secondary"}>
                {currentStaffUser.permissions.editProfile ? "✓" : "✗"} Edit Profiles
              </Badge>
              <Badge variant={currentStaffUser.permissions.deleteProfile ? "default" : "secondary"}>
                {currentStaffUser.permissions.deleteProfile ? "✓" : "✗"} Delete Profiles
              </Badge>
            </div>
          </CardContent>
        </Card>

      </main>

      {/* User Creation Dialog */}
      <AddUserDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onUserAdded={handleUserAdded}
      />

      <ViewUserDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        user={selectedUser}
        onEdit={() => {
          setViewDialogOpen(false);
          setEditDialogOpen(true);
        }}
      />

      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={selectedUser}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
