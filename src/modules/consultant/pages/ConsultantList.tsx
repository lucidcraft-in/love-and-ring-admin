import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, UserCheck, Clock, XCircle, Users, MoreHorizontal, Eye, CheckCircle, Ban, Shield, MapPin, Loader2, ChevronLeft, ChevronRight, CheckCircle2, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatDistanceToNow } from "date-fns";

// Redux consultant actions
import { fetchConsultantsAsync, deleteConsultantAsync, updateConsultantAsync, getConsultantStatsAsync } from "@/store/slices/consultantSlice";

// Redux approval actions
import { fetchPendingProfilesAsync, fetchApprovalStatsAsync, approveProfileAsync, rejectProfileAsync, setSelectedProfile } from "@/store/slices/approvalSlice";
import { PendingProfile } from "@/services/approvalService";

// Dialog components
import { ConsultantViewDialog } from "../components/ConsultantViewDialog";
import { ConsultantApproveDialog } from "../components/ConsultantApproveDialog";
import { ConsultantRejectDialog } from "../components/ConsultantRejectDialog";
import { ConsultantDeleteDialog } from "../components/ConsultantDeleteDialog";
import { ConsultantPermissionsDialog } from "../components/ConsultantPermissionsDialog";
import { ConsultantCreateDialog } from "../components/ConsultantCreateDialog";
import { ConsultantFilterDialog, type ConsultantFilters } from "../components/ConsultantFilterDialog";
import { ApprovalDetailsDialog } from "@/components/approvals/ApprovalDetailsDialog";
import { ApproveRejectDialog } from "@/components/approvals/ApproveRejectDialog";

import type { Consultant } from "@/services/consultantService";

interface ConsultantListProps {
  initialTab?: "consultants" | "approvals";
}

export default function ConsultantList({ initialTab }: ConsultantListProps) {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab State
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam || initialTab || "consultants";

  const handleTabChange = (val: string) => {
    setSearchParams({ tab: val });
  };

  // Consultants Redux State
  const { consultants, total, stats, listLoading, error } = useAppSelector((state) => state.consultant);

  // Approvals Redux State
  const { pendingProfiles, stats: approvalStats, loading: approvalLoading, selectedProfile } = useAppSelector((state) => state.approvals);

  // Consultant Dialog State
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState<ConsultantFilters>({});

  // Pagination state for consultant list
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    const saved = localStorage.getItem("consultants_pageSize");
    return saved ? Number(saved) : 10;
  });

  useEffect(() => {
    localStorage.setItem("consultants_pageSize", pageSize.toString());
  }, [pageSize]);

  // Approvals Local State
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvalSearchQuery, setApprovalSearchQuery] = useState("");

  // Fetch consultants on mount and when filter or pagination changes
  useEffect(() => {
    const skip = (currentPage - 1) * pageSize;
    dispatch(fetchConsultantsAsync({
      skip,
      take: pageSize,
      status: statusFilter === "all" ? undefined : statusFilter as any,
    }));
  }, [dispatch, statusFilter, currentPage, pageSize]);

  // Fetch consultant stats on mount
  useEffect(() => {
    dispatch(getConsultantStatsAsync());
  }, [dispatch]);

  // Fetch approval pending profiles & stats on mount
  useEffect(() => {
    dispatch(fetchPendingProfilesAsync({ take: 50, skip: 0 }));
    dispatch(fetchApprovalStatsAsync());
  }, [dispatch]);

  // Filter consultants
  const filteredConsultants = consultants.filter(c => {
    const matchesSearch = !searchQuery ||
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    const effectiveStatus = advancedFilters.status || statusFilter;
    const matchesStatus = effectiveStatus === "all" || c.status === effectiveStatus;

    const matchesRegions = !advancedFilters.regions || advancedFilters.regions.length === 0 ||
      advancedFilters.regions.some(region =>
        c.regions?.some(r => r.toLowerCase().includes(region.toLowerCase()))
      );

    const matchesMinProfiles = advancedFilters.minProfiles === undefined ||
      (c.profilesCreated || 0) >= advancedFilters.minProfiles;

    const matchesMaxProfiles = advancedFilters.maxProfiles === undefined ||
      (c.profilesCreated || 0) <= advancedFilters.maxProfiles;

    const matchesCreatedAfter = !advancedFilters.createdAfter ||
      new Date(c.createdAt) >= new Date(advancedFilters.createdAfter);

    const matchesCreatedBefore = !advancedFilters.createdBefore ||
      new Date(c.createdAt) <= new Date(advancedFilters.createdBefore);

    return matchesSearch && matchesStatus && matchesRegions &&
      matchesMinProfiles && matchesMaxProfiles &&
      matchesCreatedAfter && matchesCreatedBefore;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: "bg-chart-green/10 text-chart-green",
      PENDING: "bg-chart-orange/10 text-chart-orange",
      REJECTED: "bg-destructive/10 text-destructive",
      SUSPENDED: "bg-muted text-muted-foreground"
    };
    return <Badge variant="secondary" className={styles[status]}>{status}</Badge>;
  };

  const handleApprove = async () => {
    if (!selectedConsultant) return;
    setActionLoading(true);
    try {
      await dispatch(approveProfileAsync(selectedConsultant._id)).unwrap();

      toast({
        title: "Consultant Approved",
        description: `${selectedConsultant.fullName} has been approved. An email with user credentials has been sent.`
      });
      setApproveOpen(false);
      const skip = (currentPage - 1) * pageSize;
      dispatch(fetchConsultantsAsync({
        skip,
        take: pageSize,
        status: statusFilter === "all" ? undefined : statusFilter as any,
      }));
      dispatch(getConsultantStatsAsync());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve consultant.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedConsultant) return;
    setActionLoading(true);
    try {
      await dispatch(rejectProfileAsync({ id: selectedConsultant._id, reason })).unwrap();

      toast({
        title: "Consultant Rejected",
        description: `${selectedConsultant.fullName} has been rejected. Rejection notice email sent.`
      });
      setRejectOpen(false);
      const skip = (currentPage - 1) * pageSize;
      dispatch(fetchConsultantsAsync({
        skip,
        take: pageSize,
        status: statusFilter === "all" ? undefined : statusFilter as any,
      }));
      dispatch(getConsultantStatsAsync());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject consultant.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (reason: string) => {
    if (!selectedConsultant) return;
    setActionLoading(true);
    try {
      await dispatch(deleteConsultantAsync({ id: selectedConsultant._id, reason })).unwrap();

      toast({
        title: "Consultant Deleted",
        description: `${selectedConsultant.fullName} has been deleted. Notification email sent.`
      });
      setDeleteOpen(false);
      const skip = (currentPage - 1) * pageSize;
      dispatch(fetchConsultantsAsync({
        skip,
        take: pageSize,
        status: statusFilter === "all" ? undefined : statusFilter as any,
      }));
      dispatch(getConsultantStatsAsync());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete consultant.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSavePermissions = () => {
    toast({
      title: "Permissions Updated",
      description: `Permissions for ${selectedConsultant?.fullName} have been updated.`
    });
    setPermissionsOpen(false);
  };

  const handleCreate = () => {
    toast({
      title: "Consultant Created",
      description: "Notification email sent."
    });
    setCreateOpen(false);
    setCurrentPage(1);
    dispatch(fetchConsultantsAsync({
      skip: 0,
      take: pageSize,
      status: statusFilter === "all" ? undefined : statusFilter as any,
    }));
    dispatch(getConsultantStatsAsync());
  };

  const handleApplyFilters = (filters: ConsultantFilters) => {
    setAdvancedFilters(filters);
    if (filters.status) {
      setStatusFilter(filters.status);
    }
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setAdvancedFilters({});
    setStatusFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const activeFilterCount = Object.keys(advancedFilters).filter((key) => {
    if (key === 'status') {
      return advancedFilters.status && advancedFilters.status !== statusFilter;
    }
    const value = advancedFilters[key as keyof ConsultantFilters];
    return value !== undefined && value !== "" && (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  // Approval handlers
  const handleViewApprovalDetails = (profile: PendingProfile) => {
    dispatch(setSelectedProfile(profile));
    setDetailsOpen(true);
  };

  const handleApprovalApproveClick = (profile: PendingProfile) => {
    dispatch(setSelectedProfile(profile));
    setActionType("approve");
    setActionDialogOpen(true);
  };

  const handleApprovalRejectClick = (profile: PendingProfile) => {
    dispatch(setSelectedProfile(profile));
    setActionType("reject");
    setActionDialogOpen(true);
  };

  const onConfirmApprovalAction = async (reason?: string) => {
    if (!selectedProfile) return;
    setIsSubmitting(true);
    try {
      if (actionType === "approve") {
        await dispatch(approveProfileAsync(selectedProfile._id)).unwrap();
        toast({ title: "Approved", description: "Consultant approved successfully." });
      } else {
        await dispatch(rejectProfileAsync({ id: selectedProfile._id, reason })).unwrap();
        toast({ title: "Rejected", description: "Consultant rejected notification sent." });
      }
      setActionDialogOpen(false);
      const skip = (currentPage - 1) * pageSize;
      dispatch(fetchConsultantsAsync({
        skip,
        take: pageSize,
        status: statusFilter === "all" ? undefined : statusFilter as any,
      }));
      dispatch(getConsultantStatsAsync());
      dispatch(fetchApprovalStatsAsync());
      dispatch(fetchPendingProfilesAsync({ take: 50, skip: 0 }));
    } catch (error) {
      toast({ title: "Error", description: "Action failed. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter pending approvals
  const filteredPendingProfiles = pendingProfiles.filter((profile) =>
    profile.fullName.toLowerCase().includes(approvalSearchQuery.toLowerCase()) ||
    profile.email.toLowerCase().includes(approvalSearchQuery.toLowerCase())
  );

  const pendingCount = approvalStats?.pendingConsultants ?? pendingProfiles.length;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Consultant Management</h1>
          <p className="text-sm text-muted-foreground">Manage brokers, consultants, and review membership requests</p>
        </div>
        {activeTab === "consultants" && (
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Consultant
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="consultants">
            Consultants List ({filteredConsultants.length})
          </TabsTrigger>
          <TabsTrigger value="approvals" className="relative flex items-center gap-2">
            <span>Approval Requests</span>
            {pendingCount > 0 && (
              <Badge
                variant="destructive"
                className="h-5 min-w-5 rounded-full px-1.5 flex items-center justify-center text-xs font-bold"
              >
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CONSULTANTS */}
        <TabsContent value="consultants" className="space-y-6 m-0">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Total</p>
                  <p className="text-xl font-semibold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-chart-green" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Active</p>
                  <p className="text-xl font-semibold">{stats.active}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-chart-orange" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Pending</p>
                  <p className="text-xl font-semibold">{stats.pending}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Rejected</p>
                  <p className="text-xl font-semibold">{stats.rejected}</p>
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
                    placeholder="Search consultants..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative"
                    onClick={() => setFilterOpen(true)}
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
                      {currentPage}/{Math.max(1, Math.ceil(total / pageSize))}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(total / pageSize), prev + 1))}
                      disabled={currentPage >= Math.ceil(total / pageSize)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultants Table */}
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-0">
              {listLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center p-8 text-destructive">
                  <p>Error loading consultants: {error}</p>
                </div>
              ) : filteredConsultants.length === 0 ? (
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  <p>No consultants found</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="overflow-auto max-h-[calc(100vh-28rem)]">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50">
                          <TableHead className="sticky top-0 bg-background z-10 border-b">Consultant</TableHead>
                          <TableHead className="sticky top-0 bg-background z-10 border-b">Regions</TableHead>
                          <TableHead className="sticky top-0 bg-background z-10 border-b">Profiles</TableHead>
                          <TableHead className="sticky top-0 bg-background z-10 border-b">Status</TableHead>
                          <TableHead className="sticky top-0 bg-background z-10 border-b">Created</TableHead>
                          <TableHead className="sticky top-0 bg-background z-10 border-b text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredConsultants.map((c) => (
                          <TableRow key={c._id} className="border-border/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-9 h-9">
                                  <AvatarFallback>{c.fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{c.fullName}</p>
                                  <p className="text-sm text-muted-foreground">{c.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                {c.regions && c.regions.length > 0 ? (
                                  c.regions.slice(0, 2).map(r => (
                                    <Badge key={r} variant="outline" className="text-xs">
                                      <MapPin className="w-3 h-3 mr-1" />{r}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground">-</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{c.profilesCreated || 0}</TableCell>
                            <TableCell>{getStatusBadge(c.status)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => { setSelectedConsultant(c); setViewOpen(true); }}>
                                    <Eye className="w-4 h-4 mr-2" />View Details
                                  </DropdownMenuItem>
                                  {c.status === "PENDING" && (
                                    <>
                                      <DropdownMenuItem onClick={() => { setSelectedConsultant(c); setApproveOpen(true); }}>
                                        <CheckCircle className="w-4 h-4 mr-2" />Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => { setSelectedConsultant(c); setRejectOpen(true); }} className="text-destructive">
                                        <Ban className="w-4 h-4 mr-2" />Reject
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {c.status === "ACTIVE" && (
                                    <DropdownMenuItem onClick={() => { setSelectedConsultant(c); setPermissionsOpen(true); }}>
                                      <Shield className="w-4 h-4 mr-2" />Edit Permissions
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => { setSelectedConsultant(c); setDeleteOpen(true); }} className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />Delete Consultant
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: APPROVAL REQUESTS TABLE */}
        <TabsContent value="approvals" className="space-y-6 m-0">
          {/* Approval Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-chart-orange" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Requests</p>
                  <p className="text-xl font-semibold text-foreground">{approvalStats?.pendingConsultants || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card-shadow border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-chart-green" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Approved Today</p>
                  <p className="text-xl font-semibold text-foreground">{approvalStats?.approvedToday || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card-shadow border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Rejected Today</p>
                  <p className="text-xl font-semibold text-foreground">{approvalStats?.rejectedToday || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by applicant name, email..."
                  className="pl-10"
                  value={approvalSearchQuery}
                  onChange={(e) => setApprovalSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Approval Requests Table */}
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Requested By</TableHead>
                    <TableHead>Email / Phone</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                        <span className="text-sm text-muted-foreground mt-2 block">Loading requests...</span>
                      </TableCell>
                    </TableRow>
                  ) : filteredPendingProfiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No pending approval requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPendingProfiles.map((profile) => (
                      <TableRow key={profile._id} className="border-border/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {profile.fullName?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{profile.fullName || "Unnamed"}</p>
                              {profile.username && (
                                <p className="text-xs text-muted-foreground">@{profile.username}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{profile.email}</div>
                          {profile.phone && (
                            <div className="text-xs text-muted-foreground">{profile.phone}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                            PENDING
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewApprovalDetails(profile)}
                            >
                              <Eye className="w-4 h-4 mr-1" /> View
                            </Button>
                            <Button
                              size="sm"
                              className="bg-chart-green text-white hover:bg-chart-green/90"
                              onClick={() => handleApprovalApproveClick(profile)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApprovalRejectClick(profile)}
                            >
                              <XCircle className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </div>
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

      {/* Consultant Dialogs */}
      <ConsultantViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        consultant={selectedConsultant}
      />
      <ConsultantApproveDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        consultant={selectedConsultant}
        onApprove={handleApprove}
        loading={actionLoading}
      />
      <ConsultantRejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        consultant={selectedConsultant}
        onReject={handleReject}
        loading={actionLoading}
      />
      <ConsultantDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        consultant={selectedConsultant}
        onDelete={handleDelete}
        loading={actionLoading}
      />
      <ConsultantPermissionsDialog
        open={permissionsOpen}
        onOpenChange={setPermissionsOpen}
        consultant={selectedConsultant}
        onSave={handleSavePermissions}
      />
      <ConsultantCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />
      <ConsultantFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={advancedFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Approval Dialogs */}
      <ApprovalDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onApprove={(id) => {
          setActionType("approve");
          setActionDialogOpen(true);
        }}
        onReject={(id) => {
          setActionType("reject");
          setActionDialogOpen(true);
        }}
      />

      <ApproveRejectDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        type={actionType}
        onConfirm={onConfirmApprovalAction}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
