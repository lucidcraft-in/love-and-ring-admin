import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Search,
  Activity,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Info,
  User,
  ArrowRight,
  Code,
  Calendar,
} from "lucide-react";
import Axios from "@/axios/axios";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  getFriendlyActionName,
  getFriendlyDetails,
  getStepInfo,
  LogItem,
} from "@/utils/activityLogUtils";

export interface ActivityLogItem extends LogItem {
  _id: string;
  userId?: {
    _id: string;
    fullName?: string;
    email?: string;
    mobile?: string;
    profileId?: string;
  };
  userEmail?: string;
  userPhone?: string;
  userFullName?: string;
  category: "REGISTRATION" | "LOGIN" | "PROFILE" | "SYSTEM";
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{
    totalLogs: number;
    totalErrors: number;
    totalSuccess: number;
    stepErrors: Record<string, number>;
    stepFunnel: Record<string, number>;
  }>({
    totalLogs: 0,
    totalErrors: 0,
    totalSuccess: 0,
    stepErrors: {},
    stepFunnel: {},
  });

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [stepFilter, setStepFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected Log Modal
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.get("/api/admin/activity-logs/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch activity stats:", err);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params: Record<string, any> = {
        page,
        limit,
      };

      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (stepFilter !== "all") params.step = stepFilter;
      if (statusFilter !== "all") params.status = statusFilter;
      if (categoryFilter !== "all") params.category = categoryFilter;

      const res = await Axios.get("/api/admin/activity-logs", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (res.data) {
        setLogs(res.data.logs || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
      toast.error("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, stepFilter, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStepFilter("all");
    setStatusFilter("all");
    setCategoryFilter("all");
    setPage(1);
  };

  const openLogDetails = (log: ActivityLogItem) => {
    setSelectedLog(log);
    setShowRawJson(false);
    setModalOpen(true);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Success
          </Badge>
        );
      case "ERROR":
        return (
          <Badge variant="destructive" className="font-medium">
            <AlertCircle className="w-3 h-3 mr-1" /> Error
          </Badge>
        );
      case "WARNING":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium">
            <AlertTriangle className="w-3 h-3 mr-1" /> Warning
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-medium">
            <Info className="w-3 h-3 mr-1" /> Info
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> User Activity & Registration Logs
          </h1>
          <p className="text-sm text-muted-foreground">
            Clear tracking of user registration progress, step completion, and error diagnostics.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchStats();
            fetchLogs();
          }}
          disabled={loading}
          className="gap-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Activity Events</p>
              <p className="text-xl font-bold text-foreground">{stats.totalLogs || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Validation Errors</p>
              <p className="text-xl font-bold text-rose-600">{stats.totalErrors || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Successful Steps</p>
              <p className="text-xl font-bold text-emerald-600">{stats.totalSuccess || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Top Error Step</p>
              <p className="text-xl font-bold text-foreground">
                {Object.entries(stats.stepErrors).sort((a, b) => b[1] - a[1])[0]
                  ? `Step ${Object.entries(stats.stepErrors).sort((a, b) => b[1] - a[1])[0][0].replace("step", "")}`
                  : "None"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registration Funnel Breakdown */}
      <Card className="stat-card-shadow border-0">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            Registration Step Completion & Error Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((stepNum) => {
              const stepInfo = getStepInfo(stepNum);
              const errCount = stats.stepErrors[`step${stepNum}`] || 0;
              const nextCount = stats.stepFunnel[`step${stepNum}`] || 0;
              return (
                <div
                  key={stepNum}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    errCount > 0
                      ? "bg-rose-500/5 border-rose-500/30"
                      : "bg-muted/30 border-border/50"
                  }`}
                >
                  <p className="text-xs font-semibold text-foreground">{stepInfo.shortName}</p>
                  <div className="mt-1.5 text-base font-bold text-foreground">
                    {nextCount} <span className="text-xs font-normal text-muted-foreground">completions</span>
                  </div>
                  <div className="mt-1">
                    {errCount > 0 ? (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        {errCount} {errCount === 1 ? "error" : "errors"}
                      </Badge>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-medium">0 errors</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters Bar */}
      <Card className="stat-card-shadow border-0">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by user name, email, action, or error details..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={stepFilter}
                onValueChange={(val) => {
                  setStepFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Step" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Steps</SelectItem>
                  <SelectItem value="1">Step 1: OTP</SelectItem>
                  <SelectItem value="2">Step 2: Basic</SelectItem>
                  <SelectItem value="3">Step 3: Personal</SelectItem>
                  <SelectItem value="4">Step 4: Education</SelectItem>
                  <SelectItem value="5">Step 5: Photos</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={categoryFilter}
                onValueChange={(val) => {
                  setCategoryFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="REGISTRATION">Registration</SelectItem>
                  <SelectItem value="LOGIN">Login</SelectItem>
                  <SelectItem value="PROFILE">Profile</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || stepFilter !== "all" || statusFilter !== "all" || categoryFilter !== "all") && (
                <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-xs">
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="stat-card-shadow border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>User / Email</TableHead>
                <TableHead>Step</TableHead>
                <TableHead>Activity Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description / Error</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" /> Loading activity logs...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No activity logs match your search filters.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => {
                  const userName = log.userId?.fullName || log.userFullName || "Anonymous / Guest";
                  const userEmail = log.userId?.email || log.userEmail || "—";
                  const friendlyAction = getFriendlyActionName(log.action, log.step);
                  const friendlyDetails = getFriendlyDetails(log);
                  const stepInfo = getStepInfo(log.step);

                  return (
                    <TableRow key={log._id} className="border-border/50 hover:bg-muted/40 transition-colors">
                      {/* User Column */}
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="leading-tight overflow-hidden">
                            <span className="font-semibold text-foreground text-sm block truncate">{userName}</span>
                            <span className="text-xs text-muted-foreground block truncate">{userEmail}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Step Column */}
                      <TableCell>
                        {log.step ? (
                          <Badge variant="outline" className={`font-semibold text-xs whitespace-nowrap ${stepInfo.color}`}>
                            Step {log.step}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      {/* Action Event Column */}
                      <TableCell className="max-w-[220px]">
                        <div className="leading-tight">
                          <span className="text-xs font-semibold text-foreground block truncate">{friendlyAction}</span>
                          <span className="text-[10px] text-muted-foreground font-mono truncate block opacity-70">
                            {log.action}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status Column */}
                      <TableCell>{renderStatusBadge(log.status)}</TableCell>

                      {/* Description / Error Column */}
                      <TableCell className="max-w-[300px]">
                        {log.errorMessage ? (
                          <div className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20 line-clamp-2">
                            {friendlyDetails}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {friendlyDetails}
                          </span>
                        )}
                      </TableCell>

                      {/* Timestamp Column */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(log.createdAt), "dd MMM yyyy, hh:mm a")}
                      </TableCell>

                      {/* Inspect Button */}
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={() => openLogDetails(log)}>
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border/50">
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>
                Showing {logs.length} of {totalCount} activity logs
              </span>
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <Select
                  value={String(limit)}
                  onValueChange={(val) => {
                    setLimit(Number(val));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-20 text-xs">
                    <SelectValue placeholder="15" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="h-8 gap-1 text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </Button>
                <span className="text-xs font-medium text-foreground px-2">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  className="h-8 gap-1 text-xs"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Log Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Activity className="w-5 h-5 text-primary" /> Activity Details
            </DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 pt-2">
              {/* User Overview Card */}
              <div className="p-4 bg-muted/40 rounded-lg border border-border/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {(selectedLog.userId?.fullName || selectedLog.userFullName || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">
                    {selectedLog.userId?.fullName || selectedLog.userFullName || "Guest User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {selectedLog.userId?.email || selectedLog.userEmail || "No email registered"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {renderStatusBadge(selectedLog.status)}
                </div>
              </div>

              {/* Action & Step Card */}
              <div className="p-4 rounded-lg border border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Activity Event</span>
                  {selectedLog.step && (
                    <Badge variant="outline" className={getStepInfo(selectedLog.step).color}>
                      {getStepInfo(selectedLog.step).label}
                    </Badge>
                  )}
                </div>

                <div className="text-base font-semibold text-foreground flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                  {getFriendlyActionName(selectedLog.action, selectedLog.step)}
                </div>

                <div className="text-xs text-muted-foreground bg-muted/50 p-2.5 rounded border border-border/40">
                  {getFriendlyDetails(selectedLog)}
                </div>
              </div>

              {/* User Typed Registration Form Payload Card */}
              {(selectedLog.details?.payload || selectedLog.userFullName || selectedLog.userEmail || selectedLog.userPhone) && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1.5">
                    <User className="w-4 h-4" /> Registration Form Payload Typed By User
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    {selectedLog.userFullName && (
                      <div>
                        <span className="text-muted-foreground">Full Name: </span>
                        <span className="font-medium text-foreground">{selectedLog.userFullName}</span>
                      </div>
                    )}
                    {selectedLog.userEmail && (
                      <div>
                        <span className="text-muted-foreground">Email: </span>
                        <span className="font-medium text-foreground">{selectedLog.userEmail}</span>
                      </div>
                    )}
                    {selectedLog.userPhone && (
                      <div>
                        <span className="text-muted-foreground">Phone: </span>
                        <span className="font-medium text-foreground">{selectedLog.userPhone}</span>
                      </div>
                    )}
                    {selectedLog.details?.payload &&
                      Object.entries(selectedLog.details.payload).map(([k, v]) => {
                        if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) return null;
                        const formattedKey = k.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
                        const formattedVal = typeof v === "object" ? JSON.stringify(v) : String(v);
                        return (
                          <div key={k}>
                            <span className="text-muted-foreground">{formattedKey}: </span>
                            <span className="font-medium text-foreground">{formattedVal}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Error Details if present */}
              {selectedLog.errorMessage && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg space-y-1">
                  <p className="text-xs font-bold text-rose-600 uppercase flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Validation Error
                  </p>
                  <p className="text-xs text-rose-700 dark:text-rose-300 font-mono leading-relaxed pt-1">
                    {selectedLog.errorMessage}
                  </p>
                </div>
              )}

              {/* Timestamp & IP */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(selectedLog.createdAt), "dd MMMM yyyy, hh:mm:ss a")}
                </span>
                <span>IP: {selectedLog.ipAddress || "Internal"}</span>
              </div>

              {/* Collapsible Technical Details */}
              <div className="border-t border-border/50 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="text-xs gap-1.5 text-muted-foreground w-full justify-between"
                >
                  <span className="flex items-center gap-1">
                    <Code className="w-3.5 h-3.5" /> Technical System Code & Payload
                  </span>
                  <span>{showRawJson ? "Hide" : "Show"}</span>
                </Button>

                {showRawJson && (
                  <div className="mt-2 space-y-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded block text-primary font-mono">
                      {selectedLog.action}
                    </code>
                    {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                      <pre className="p-3 bg-slate-950 text-slate-100 rounded text-xs overflow-x-auto font-mono">
                        {JSON.stringify(selectedLog.details, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
