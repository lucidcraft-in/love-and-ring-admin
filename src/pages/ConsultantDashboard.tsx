import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, UserPlus, FileText, Clock, TrendingUp, 
  Activity, Eye, Edit, Trash2, Plus, LogOut,
  Heart, Bell, Settings, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ConsultantUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  permissions: {
    create_profile: boolean;
    edit_profile: boolean;
    view_profile: boolean;
    delete_profile: boolean;
  };
}

interface MemberProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  status: "active" | "pending" | "matched";
  createdAt: string;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
}

// Mock data
const mockProfiles: MemberProfile[] = [
  { id: "1", name: "Priya Sharma", age: 26, gender: "Female", location: "Mumbai", status: "active", createdAt: "2024-01-15" },
  { id: "2", name: "Rahul Patel", age: 29, gender: "Male", location: "Pune", status: "pending", createdAt: "2024-01-14" },
  { id: "3", name: "Anjali Gupta", age: 24, gender: "Female", location: "Delhi", status: "matched", createdAt: "2024-01-13" },
  { id: "4", name: "Vikram Singh", age: 31, gender: "Male", location: "Mumbai", status: "active", createdAt: "2024-01-12" },
  { id: "5", name: "Neha Reddy", age: 27, gender: "Female", location: "Bangalore", status: "active", createdAt: "2024-01-11" },
];

const mockActivity: ActivityLog[] = [
  { id: "1", action: "Profile Created", description: "Created profile for Priya Sharma", timestamp: "2 hours ago" },
  { id: "2", action: "Profile Updated", description: "Updated profile for Rahul Patel", timestamp: "4 hours ago" },
  { id: "3", action: "Login", description: "Logged in from Mumbai", timestamp: "5 hours ago" },
  { id: "4", action: "Profile Viewed", description: "Viewed profile for Anjali Gupta", timestamp: "Yesterday" },
  { id: "5", action: "Profile Created", description: "Created profile for Vikram Singh", timestamp: "2 days ago" },
];

export default function ConsultantDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [consultant, setConsultant] = useState<ConsultantUser | null>(null);
  const [profiles, setProfiles] = useState<MemberProfile[]>(mockProfiles);
  const [activity] = useState<ActivityLog[]>(mockActivity);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check if consultant is logged in
    const storedConsultant = sessionStorage.getItem("consultantUser");
    if (!storedConsultant) {
      navigate("/consultant/login");
      return;
    }
    setConsultant(JSON.parse(storedConsultant));
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("consultantUser");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/consultant/login");
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { 
      title: "Total Profiles", 
      value: profiles.length, 
      icon: Users, 
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      title: "Active Profiles", 
      value: profiles.filter(p => p.status === "active").length, 
      icon: TrendingUp, 
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    { 
      title: "Pending Review", 
      value: profiles.filter(p => p.status === "pending").length, 
      icon: Clock, 
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    { 
      title: "Matched", 
      value: profiles.filter(p => p.status === "matched").length, 
      icon: Heart, 
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900/30"
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      matched: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    };
    return styles[status as keyof typeof styles] || "";
  };

  if (!consultant) {
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
                    <AvatarFallback>{consultant.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{consultant.fullName}</span>
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
            <h1 className="text-2xl font-bold">Welcome back, {consultant.fullName}!</h1>
            <p className="text-muted-foreground">Manage your member profiles and track your activity</p>
          </div>
          {consultant.permissions.create_profile && (
            <Button onClick={() => toast({ title: "Coming Soon", description: "Profile creation form will be available soon." })}>
              <Plus className="mr-2 h-4 w-4" />
              Create Profile
            </Button>
          )}
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
                    {filteredProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">
                          <div>
                            {profile.name}
                            <p className="text-xs text-muted-foreground md:hidden">
                              {profile.age}y • {profile.location}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{profile.age}</TableCell>
                        <TableCell className="hidden md:table-cell">{profile.location}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusBadge(profile.status)}>
                            {profile.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {consultant.permissions.view_profile && (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {consultant.permissions.edit_profile && (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {consultant.permissions.delete_profile && (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest actions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activity.map((log) => (
                  <div key={log.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.description}</p>
                      <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Permissions</CardTitle>
            <CardDescription>Access levels assigned by admin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant={consultant.permissions.view_profile ? "default" : "secondary"}>
                {consultant.permissions.view_profile ? "✓" : "✗"} View Profiles
              </Badge>
              <Badge variant={consultant.permissions.create_profile ? "default" : "secondary"}>
                {consultant.permissions.create_profile ? "✓" : "✗"} Create Profiles
              </Badge>
              <Badge variant={consultant.permissions.edit_profile ? "default" : "secondary"}>
                {consultant.permissions.edit_profile ? "✓" : "✗"} Edit Profiles
              </Badge>
              <Badge variant={consultant.permissions.delete_profile ? "default" : "secondary"}>
                {consultant.permissions.delete_profile ? "✓" : "✗"} Delete Profiles
              </Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
