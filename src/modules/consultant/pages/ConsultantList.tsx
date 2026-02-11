import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, UserCheck, Clock, XCircle, Users, MoreHorizontal, Eye, CheckCircle, Ban, Shield, MapPin, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchConsultantsAsync, deleteConsultantAsync, updateConsultantAsync, getConsultantStatsAsync } from "@/store/slices/consultantSlice";
import { ConsultantViewDialog } from "../components/ConsultantViewDialog";
import { ConsultantApproveDialog } from "../components/ConsultantApproveDialog";
import { ConsultantRejectDialog } from "../components/ConsultantRejectDialog";
import { ConsultantPermissionsDialog } from "../components/ConsultantPermissionsDialog";
import { ConsultantCreateDialog } from "../components/ConsultantCreateDialog";
import { ConsultantFilterDialog, type ConsultantFilters } from "../components/ConsultantFilterDialog";
import type { Consultant } from "@/services/consultantService";

export default function ConsultantList() {
  const dispatch = useAppDispatch();

  // Redux state
  const { consultants, total, stats, listLoading, error } = useAppSelector((state) => state.consultant);

  // Local state
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  console.log(selectedConsultant, "selectedConsultant")
  const [viewOpen, setViewOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState<ConsultantFilters>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch consultants on mount and when filter or pagination changes
  useEffect(() => {
    const skip = (currentPage - 1) * pageSize;
    dispatch(fetchConsultantsAsync({
      skip,
      take: pageSize,
      status: statusFilter === "all" ? undefined : statusFilter as any,
    }));
  }, [dispatch, statusFilter, currentPage, pageSize]);

  // Fetch stats on mount
  useEffect(() => {
    dispatch(getConsultantStatsAsync());
  }, [dispatch]);


  // Apply all filters to consultants
  const filteredConsultants = consultants.filter(c => {
    // Search query filter
    const matchesSearch = !searchQuery ||
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
      // || (c.branch && c.branch.name.toLowerCase().includes(searchQuery.toLowerCase()))
      ;

    // Status filter - use advanced filter status if set, otherwise use main status filter
    const effectiveStatus = advancedFilters.status || statusFilter;
    const matchesStatus = effectiveStatus === "all" || c.status === effectiveStatus;

    // Advanced filters
    // const matchesBranch = !advancedFilters.agencyName ||
    //   (c.branch && c.branch.name.toLowerCase().includes(advancedFilters.agencyName.toLowerCase()));

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

    return matchesSearch && matchesStatus && /* matchesBranch && */ matchesRegions &&
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

    try {
      await dispatch(updateConsultantAsync({
        id: selectedConsultant._id,
        payload: { status: "ACTIVE" }
      })).unwrap();

      toast({
        title: "Consultant Approved",
        description: `${selectedConsultant.fullName} has been approved.`
      });
      setApproveOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve consultant.",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedConsultant) return;

    try {
      await dispatch(updateConsultantAsync({
        id: selectedConsultant._id,
        payload: { status: "REJECTED" }
      })).unwrap();

      toast({
        title: "Consultant Rejected",
        description: `${selectedConsultant.fullName} has been rejected.`
      });
      setRejectOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject consultant.",
        variant: "destructive"
      });
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
    // Reset to first page and refresh list
    setCurrentPage(1);
    dispatch(fetchConsultantsAsync({
      skip: 0,
      take: pageSize,
      status: statusFilter === "all" ? undefined : statusFilter as any,
    }));
  };

  const handleApplyFilters = (filters: ConsultantFilters) => {
    setAdvancedFilters(filters);
    // Sync status filter with advanced filter if it's set
    if (filters.status) {
      setStatusFilter(filters.status);
    }
    // Reset to first page when applying filters
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setAdvancedFilters({});
    setStatusFilter("all");
    setSearchQuery("");
    // Reset to first page when clearing filters
    setCurrentPage(1);
  };

  // Count active filters (excluding status if it matches the main filter)
  const activeFilterCount = Object.keys(advancedFilters).filter((key) => {
    if (key === 'status') {
      // Don't count status if it matches the main status filter
      return advancedFilters.status && advancedFilters.status !== statusFilter;
    }
    const value = advancedFilters[key as keyof ConsultantFilters];
    return value !== undefined && value !== "" && (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Consultant Management</h1>
          <p className="text-sm text-muted-foreground">Manage brokers and consultants</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Consultant
        </Button>
      </div>

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
                setCurrentPage(1); // Reset to first page when status filter changes
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
                  {currentPage}/{Math.ceil(total / pageSize)}
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

      {/* Table */}
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
                      {/* <TableHead className="sticky top-0 bg-background z-10 border-b">Branch</TableHead> */}
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
                        {/* <TableCell className="text-sm">{c.branch ? c.branch.name : "-"}</TableCell> */}
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

      {/* Dialogs */}
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
      />
      <ConsultantRejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        consultant={selectedConsultant}
        onReject={handleReject}
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
    </div>
  );
}
