import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, TrendingUp, Clock, Heart, Activity, Eye, Edit, Trash2, Plus, LogOut,
  Bell, Settings, Search, UserPlus, Copy, Check, Link as LinkIcon, ExternalLink
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
import { logoutConsultant } from "@/store/slices/consultantSlice";
import { fetchUsersAsync, deleteUserAsync, User } from "@/store/slices/usersSlice";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { ViewUserDialog } from "@/components/users/ViewUserDialog";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  type: "create" | "edit" | "delete" | "view" | "login";
}

export default function ConsultantDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  // Redux state
  const { currentConsultant, isAuthenticated } = useAppSelector((state) => state.consultant);
  const { users, isLoading: usersLoading, deleteLoading } = useAppSelector((state) => state.users);

  // Dialog & state
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const consultantUser = currentConsultant || JSON.parse(localStorage.getItem("currentConsultant") || "{}");
  const consultantId = consultantUser?._id || consultantUser?.id || "";
  const clientDomain = "https://loveandring.com";
  const referralLink = `${clientDomain}/register?ref=${consultantId}`;

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    toast({
      title: "Referral Link Copied!",
      description: "Client registration URL has been copied to your clipboard.",
    });
    setTimeout(() => setCopiedLink(false), 2500);
  };
  const permissions = consultantUser?.permissions || {
    createProfile: true,
    editProfile: true,
    viewProfile: true,
    deleteProfile: true,
  };

  const activityKey = `consultant_activities_${consultantUser?._id || "default"}`;
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Load activities from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(activityKey);
      if (saved) {
        setActivities(JSON.parse(saved));
      } else {
        const initial: ActivityItem[] = [
          {
            id: Date.now().toString(),
            action: "Logged in",
            details: "Logged into Consultant Dashboard",
            timestamp: new Date().toISOString(),
            type: "login",
          },
        ];
        setActivities(initial);
        localStorage.setItem(activityKey, JSON.stringify(initial));
      }
    } catch (e) {
      setActivities([]);
    }
  }, [activityKey]);

  const logActivity = (action: string, details: string, type: ActivityItem["type"]) => {
    const newItem: ActivityItem = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toISOString(),
      type,
    };
    setActivities((prev) => {
      const updated = [newItem, ...prev].slice(0, 20);
      try {
        localStorage.setItem(activityKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Fetch users when component mounts
  useEffect(() => {
    if (isAuthenticated || localStorage.getItem("consultantToken")) {
      dispatch(fetchUsersAsync({ take: 1000 }));
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutConsultant());
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/consultant/login");
  };

  const handleUserAdded = () => {
    dispatch(fetchUsersAsync({ take: 1000 }));
    logActivity("Created Profile", "Created a new member profile", "create");
    toast({
      title: "Success",
      description: "User profile created successfully",
    });
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
    logActivity("Viewed Profile", `Viewed details for ${user.fullName || user.email}`, "view");
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
      const userName = selectedUser.fullName || selectedUser.email;
      await dispatch(deleteUserAsync(selectedUser._id)).unwrap();
      logActivity("Deleted Profile", `Deleted profile for ${userName}`, "delete");
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
    dispatch(fetchUsersAsync({ take: 1000 }));
    logActivity("Updated Profile", `Updated profile details for ${selectedUser?.fullName || selectedUser?.email || "member"}`, "edit");
  };

  const formatLocation = (location: any): string => {
    if (!location) return "N/A";
    if (typeof location === "string") return location;
    if (typeof location === "object") {
      if (location.name) return location.name;
      if (location.city) return location.city;
      const parts = [location.city, location.state, location.country].filter(Boolean);
      if (parts.length > 0) return parts.join(", ");
    }
    return "N/A";
  };

  const filteredUsers = users.filter(
    (user) => {
      const creatorId = typeof user.createdBy === 'object' && user.createdBy !== null
        ? user.createdBy._id
        : user.createdBy;

      if (creatorId && consultantUser?._id && creatorId !== consultantUser._id) return false;

      const locStr = formatLocation(user.city || (user as any).location);

      return (
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locStr.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

  const myUsers = users.filter(u => {
    const creatorId = typeof u.createdBy === 'object' && u.createdBy !== null
      ? u.createdBy._id
      : u.createdBy;
    return !creatorId || !consultantUser?._id || creatorId === consultantUser._id;
  });

  const stats = [
    {
      title: "Total Profiles",
      value: myUsers.length,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Active Profiles",
      value: myUsers.filter(u => u.isActive && !u.isDeleted).length,
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Pending Review",
      value: myUsers.filter(u => u.approvalStatus === "PENDING").length,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    {
      title: "Approved",
      value: myUsers.filter(u => u.approvalStatus === "APPROVED").length,
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

  if (usersLoading) {
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
              <Heart className="w-5 h-5 text-primary" fill="currentColor" />
            </div>
            <span className="font-semibold text-lg">Consultant Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{consultantUser?.fullName?.charAt(0)?.toUpperCase() || "C"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline font-medium text-sm">{consultantUser?.fullName || "Consultant"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-foreground">{consultantUser?.fullName || "Consultant User"}</p>
                    <p className="text-xs text-muted-foreground font-mono">{consultantUser?.email || "consultant@loveandring.com"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
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
            <h1 className="text-2xl font-bold">Welcome back, {consultantUser?.fullName || "Consultant"}!</h1>
            <p className="text-muted-foreground">Manage your member profiles and track your activity</p>
          </div>
          {permissions.createProfile && (
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Profile
            </Button>
          )}
        </div>

        {/* Referral Link Card */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-background shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-xs">
                  <LinkIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Your Client Referral Link</CardTitle>
                  <CardDescription className="text-xs">
                    Share this link with potential members. Users who register using this link will automatically be assigned under your consultant account.
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="w-fit text-xs font-mono bg-background/80 border-primary/40 text-primary">
                Consultant ID: {consultantId || "N/A"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Input
                  readOnly
                  value={referralLink}
                  className="font-mono text-sm bg-background pr-10 border-primary/30 focus-visible:ring-primary"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
                  onClick={handleCopyLink}
                  title="Copy Referral Link"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
              <Button onClick={handleCopyLink} className="shrink-0 gap-2 font-medium">
                {copiedLink ? (
                  <>
                    <Check className="h-4 w-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy Link
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

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

        {/* Profiles Table */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Member Profiles</CardTitle>
                <CardDescription>Profiles you've created and manage</CardDescription>
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
                              {calculateAge(user.dateOfBirth)}y • {formatLocation(user.city || (user as any).location)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{calculateAge(user.dateOfBirth)}</TableCell>
                        <TableCell className="hidden md:table-cell">{formatLocation(user.city || (user as any).location)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusBadge(user.approvalStatus)}>
                            {user.approvalStatus || "PENDING"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {permissions.viewProfile && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleViewUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {permissions.editProfile && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {permissions.deleteProfile && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
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

        {/* Permissions Card */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Your Permissions</CardTitle>
            <CardDescription>Access levels assigned by admin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant={permissions.viewProfile ? "default" : "secondary"}>
                {permissions.viewProfile ? "✓" : "✗"} View Profiles
              </Badge>
              <Badge variant={permissions.createProfile ? "default" : "secondary"}>
                {permissions.createProfile ? "✓" : "✗"} Create Profiles
              </Badge>
              <Badge variant={permissions.editProfile ? "default" : "secondary"}>
                {permissions.editProfile ? "✓" : "✗"} Edit Profiles
              </Badge>
              <Badge variant={permissions.deleteProfile ? "default" : "secondary"}>
                {permissions.deleteProfile ? "✓" : "✗"} Delete Profiles
              </Badge>
            </div>
          </CardContent>
        </Card> */}
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
