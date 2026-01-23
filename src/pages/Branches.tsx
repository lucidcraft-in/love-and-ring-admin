import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Building2, Users, IndianRupee, TrendingUp, MoreHorizontal, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBranchesAsync, deleteBranchAsync } from "@/store/slices/branchSlice";
import { Branch } from "@/services/branchService";
import { CreateBranchModal } from "@/components/modals/CreateBranchModal";
import { ViewBranchModal } from "@/components/modals/ViewBranchModal";
import { EditBranchModal } from "@/components/modals/EditBranchModal";

const Branches = () => {
  const dispatch = useAppDispatch();
  const { branches, total, listLoading, error } = useAppSelector((state) => state.branch);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all-status" | "Active" | "Inactive">("all-status");
  const [stateFilter, setStateFilter] = useState("all-state");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Fetch branches on component mount and when filters change
  useEffect(() => {
    const params = {
      skip: currentPage * pageSize,
      take: pageSize,
      status: statusFilter !== "all-status" ? statusFilter : undefined,
    };
    dispatch(fetchBranchesAsync(params));
  }, [dispatch, currentPage, statusFilter]);

  // Handle view branch
  const handleView = (branch: Branch) => {
    setSelectedBranch(branch);
    setViewModalOpen(true);
  };

  // Handle edit branch
  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setEditModalOpen(true);
  };

  // Handle delete branch
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to deactivate this branch?")) {
      await dispatch(deleteBranchAsync(id));
      // Refresh the list
      dispatch(fetchBranchesAsync({ skip: currentPage * pageSize, take: pageSize }));
    }
  };

  // Filter branches by search query and state (client-side)
  const filteredBranches = branches.filter((branch) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      branch.name.toLowerCase().includes(searchLower) ||
      (branch.city && branch.city.toLowerCase().includes(searchLower)) ||
      (branch.state && branch.state.toLowerCase().includes(searchLower)) ||
      branch.managerName.toLowerCase().includes(searchLower) ||
      branch.email.toLowerCase().includes(searchLower);

    const matchesState =
      stateFilter === "all-state" ||
      (branch.state && branch.state.toLowerCase() === stateFilter);

    return matchesSearch && matchesState;
  });

  // Calculate stats from filtered branches
  const totalUsers = branches.reduce((sum, b) => sum + b.totalUsers, 0);
  const totalPremiumUsers = branches.reduce((sum, b) => sum + b.premiumUsers, 0);
  const totalRevenue = branches.reduce((sum, b) => sum + b.monthlyRevenue, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Branch Management</h1>
          <p className="text-sm text-muted-foreground">Manage all branches and their performance</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Branches</p>
              <p className="text-xl font-semibold text-foreground">{total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-chart-green" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Users</p>
              <p className="text-xl font-semibold text-foreground">{totalUsers.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-chart-orange" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Premium Users</p>
              <p className="text-xl font-semibold text-foreground">{totalPremiumUsers.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Revenue</p>
              <p className="text-xl font-semibold text-foreground">₹{(totalRevenue / 100000).toFixed(1)}L</p>
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
                placeholder="Search branches..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value: any) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-state">All States</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="telangana">Telangana</SelectItem>
                  <SelectItem value="tamil nadu">Tamil Nadu</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Branches Table */}
      <Card className="stat-card-shadow border-0">
        <CardContent className="p-0">
          {listLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredBranches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Building2 className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No branches found</p>
              <p className="text-sm">Try adjusting your filters or add a new branch</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Branch</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Total Users</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Monthly Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.map((branch: Branch) => (
                  <TableRow key={branch._id} className="border-border/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{branch.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {branch.city}, {branch.state}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{branch.managerName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{branch.email}</p>
                        <p className="text-muted-foreground">{branch.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{branch.totalUsers.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-chart-orange/10 text-chart-orange">
                        {branch.premiumUsers.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-chart-green">
                      ₹{(branch.monthlyRevenue / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          branch.status === "Active"
                            ? "border-chart-green text-chart-green"
                            : "border-muted-foreground text-muted-foreground"
                        }
                      >
                        {branch.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(branch)}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(branch)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(branch._id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem> */}
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

      {/* Pagination */}
      {!listLoading && filteredBranches.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, total)} of {total} branches
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={(currentPage + 1) * pageSize >= total}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateBranchModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      <ViewBranchModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} branch={selectedBranch} />
      <EditBranchModal open={editModalOpen} onClose={() => setEditModalOpen(false)} branch={selectedBranch} />
    </div>
  );
};

export default Branches;
