import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartHandshake, CheckCircle2, XCircle, Search, RotateCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import { fetchMillionClubUsersAsync } from "@/store/slices/usersSlice";
import { useToast } from "@/hooks/use-toast";
import Axios from "@/axios/axios";

interface MillionRequest {
  _id: string;
  user: any;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  notes?: string;
}

const MillionClub = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users, isLoading } = useAppSelector((state) => state.users);

  const [activeTab, setActiveTab] = useState("users");
  const [requests, setRequests] = useState<MillionRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [requestStatusFilter, setRequestStatusFilter] = useState("PENDING");

  const [currentPage] = useState(1);
  const [pageSize] = useState(100);

  // Fetch Requests Function
  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.get("/api/million-club/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    const skip = (currentPage - 1) * pageSize;
    dispatch(fetchMillionClubUsersAsync({ skip, take: pageSize }));
    fetchRequests();
  }, [dispatch, currentPage, pageSize]);

  // Handle Accept / Reject Action
  const handleUpdateRequestStatus = async (requestId: string, status: "APPROVED" | "REJECTED") => {
    try {
      const token = localStorage.getItem("token");
      await Axios.put(
        `/api/million-club/requests/${requestId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Status Updated",
        description: `Request marked as ${status}. ${status === "APPROVED" ? "User is now a Million Club member." : ""}`,
      });

      // Refresh requests and million club users list
      fetchRequests();
      dispatch(fetchMillionClubUsersAsync({ skip: 0, take: pageSize }));
    } catch (err: any) {
      toast({
        title: "Action Failed",
        description: err.response?.data?.message || "Could not update request status",
        variant: "destructive",
      });
    }
  };

  // Helper to format gender display: Gay -> Male, Lesbian -> Female
  const getDisplayGender = (gender?: string) => {
    if (!gender) return "N/A";
    const g = gender.trim().toLowerCase();
    if (g === "gay") return "Male";
    if (g === "lesbian") return "Female";
    return gender;
  };

  const checkGenderMatch = (userGender?: string, filterValue?: string) => {
    if (!filterValue || filterValue === "all") return true;
    if (!userGender) return false;
    const ug = userGender.trim().toLowerCase();
    const f = filterValue.trim().toLowerCase();
    if (f === "male") return ug === "male" || ug === "gay";
    if (f === "female") return ug === "female" || ug === "lesbian";
    if (f === "gay") return ug === "gay" || ug === "male";
    if (f === "lesbian") return ug === "lesbian" || ug === "female";
    return ug === f;
  };

  // Reset Filters Function
  const handleResetFilters = () => {
    setSearchTerm("");
    setGenderFilter("all");
    setRequestStatusFilter("PENDING");
  };

  // 1. Filtered Members (Tab 1)
  const filteredMembers = useMemo(() => {
    return users.filter((user) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        user.fullName?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.mobile?.includes(search);

      const matchesGender = checkGenderMatch(user.gender, genderFilter);

      return matchesSearch && matchesGender;
    });
  }, [users, searchTerm, genderFilter]);

  // 2. Filtered Requests (Tab 2)
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        req.user?.fullName?.toLowerCase().includes(search) ||
        req.user?.email?.toLowerCase().includes(search) ||
        req.user?.mobile?.includes(search);

      const matchesGender = checkGenderMatch(req.user?.gender, genderFilter);

      const matchesStatus =
        requestStatusFilter === "all" || req.status === requestStatusFilter;

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [requests, searchTerm, genderFilter, requestStatusFilter]);

  // Pending Count for Badge Indicator
  const pendingRequestsCount = useMemo(() => {
    return requests.filter((r) => r.status === "PENDING").length;
  }, [requests]);

  const isFilterActive =
    searchTerm !== "" || genderFilter !== "all" || (activeTab === "requests" && requestStatusFilter !== "PENDING");

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Million Club Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage Million Club profiles and membership access requests
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <Card className="stat-card-shadow border-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Gender Filter */}
              <Select value={genderFilter} onValueChange={setGenderFilter}>
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

              {/* Status Filter (Only active on Requests tab) */}
              {activeTab === "requests" && (
                <Select value={requestStatusFilter} onValueChange={setRequestStatusFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="all">All Statuses</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Clear Filters Button */}
              {isFilterActive && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleResetFilters}
                  title="Reset Filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/50 mb-4">
          <TabsTrigger value="users">
            Million Club Members ({filteredMembers.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            Membership Requests
            {pendingRequestsCount > 0 && (
              <Badge
                variant="destructive"
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {pendingRequestsCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: MEMBERS TABLE */}
        <TabsContent value="users" className="space-y-4">
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading members...
                      </TableCell>
                    </TableRow>
                  ) : filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No Million Club members found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.fullName || "Unnamed"}</TableCell>
                        <TableCell>
                          <div>{user.email}</div>
                          <div className="text-xs text-muted-foreground">{user.mobile}</div>
                        </TableCell>
                        <TableCell>{getDisplayGender(user.gender)}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                            Million Club
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/million/match/${user._id}`)}
                            title="Find Match"
                          >
                            <HeartHandshake className="w-4 h-4 text-primary" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: REQUESTS TABLE */}
        <TabsContent value="requests" className="space-y-4">
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Email / Phone</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingRequests ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading requests...
                      </TableCell>
                    </TableRow>
                  ) : filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No requests found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((req) => (
                      <TableRow key={req._id}>
                        <TableCell className="font-medium">
                          {req.user?.fullName || "Unnamed User"}
                        </TableCell>
                        <TableCell>
                          <div>{req.user?.email}</div>
                          <div className="text-xs text-muted-foreground">{req.user?.mobile}</div>
                        </TableCell>
                        <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              req.status === "APPROVED"
                                ? "bg-chart-green/10 text-chart-green"
                                : req.status === "PENDING"
                                ? "bg-yellow-500/10 text-yellow-600"
                                : "bg-destructive/10 text-destructive"
                            }
                          >
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {req.status === "PENDING" ? (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                className="bg-chart-green text-white hover:bg-chart-green/90"
                                onClick={() => handleUpdateRequestStatus(req._id, "APPROVED")}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" /> Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUpdateRequestStatus(req._id, "REJECTED")}
                              >
                                <XCircle className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground capitalize">
                              {req.status.toLowerCase()}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MillionClub;