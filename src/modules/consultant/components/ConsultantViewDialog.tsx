import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, IndianRupee, Receipt, Search, MapPin, Mail, Phone, Calendar, Loader2, CheckCircle2, Clock, XCircle, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { consultantService, type ConsultantPayment } from "@/services/consultantService";
import type { Consultant } from "../types";

interface ConsultantViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultant: Consultant | null;
}

export function ConsultantViewDialog({ open, onOpenChange, consultant }: ConsultantViewDialogProps) {
  const [detailedConsultant, setDetailedConsultant] = useState<Consultant | null>(consultant);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setDetailedConsultant(consultant);
    setSearchQuery("");

    if (open && consultant) {
      const consultantId = (consultant as any)._id || consultant.id;
      if (consultantId) {
        setLoadingPayments(true);
        consultantService
          .getConsultantById(consultantId)
          .then((data) => {
            setDetailedConsultant(data as unknown as Consultant);
          })
          .catch((err) => {
            console.error("Failed to fetch consultant payment details:", err);
          })
          .finally(() => {
            setLoadingPayments(false);
          });
      }
    }
  }, [open, consultant]);

  if (!consultant) return null;

  const activeConsultant = detailedConsultant || consultant;
  const payments: ConsultantPayment[] = (activeConsultant as any).payments || [];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: "bg-chart-green/10 text-chart-green border-chart-green/20",
      PENDING: "bg-chart-orange/10 text-chart-orange border-chart-orange/20",
      REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
      SUSPENDED: "bg-muted text-muted-foreground"
    };
    return <Badge variant="outline" className={styles[status] || ""}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3" /> Success
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" /> {status || "Failed"}
          </Badge>
        );
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const user = p.user;
    const userName = (user?.fullName || user?.name || "").toLowerCase();
    const userEmail = (user?.email || p.userEmail || "").toLowerCase();
    const planTitle = (p.plan?.title || "").toLowerCase();
    const txnId = (p.transactionId || "").toLowerCase();
    const refNo = (p.referenceNo || "").toLowerCase();
    const method = (p.paymentMethod || "").toLowerCase();

    return userName.includes(q) || userEmail.includes(q) || planTitle.includes(q) || txnId.includes(q) || refNo.includes(q) || method.includes(q);
  });

  const totalRevenue = activeConsultant.totalRevenue ?? (activeConsultant as any).revenueGenerated ?? 0;
  const successfulPaymentsCount = payments.filter((p) => p.status === "Success").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border/60">
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            <span>Consultant Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Top Profile Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/40 rounded-xl border border-border/50">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 border border-border shadow-sm">
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                  {activeConsultant.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg text-foreground">{activeConsultant.fullName}</h3>
                  {getStatusBadge(activeConsultant.status)}
                </div>
                <p className="text-sm text-muted-foreground">@{activeConsultant.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary/70 shrink-0" />
                <span className="font-medium text-foreground">{activeConsultant.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary/70 shrink-0" />
                <span className="font-medium text-foreground">{activeConsultant.phone || "N/A"}</span>
              </div>
              {activeConsultant.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
                  <span>Joined {new Date(activeConsultant.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {activeConsultant.licenseNumber && (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary/70 shrink-0" />
                  <span>Lic: {activeConsultant.licenseNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border border-border/50 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">Profiles Created</p>
                  <p className="text-2xl font-bold text-foreground">{activeConsultant.profilesCreated || 0}</p>
                  <p className="text-[11px] text-muted-foreground">Registered under consultant</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground">From member plan purchases</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">Plan Purchases</p>
                  <p className="text-2xl font-bold text-foreground">{payments.length}</p>
                  <p className="text-[11px] text-muted-foreground">{successfulPaymentsCount} successful</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regions & Permissions Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-border/40 bg-muted/20">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Operating Regions
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {activeConsultant.regions && activeConsultant.regions.length > 0 ? (
                  activeConsultant.regions.map((r) => (
                    <Badge key={r} variant="secondary" className="text-xs font-normal">
                      {r}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No specific regions assigned</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Permissions</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {activeConsultant.permissions &&
                  Object.entries(activeConsultant.permissions).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-1.5">
                      <span className={v ? "text-emerald-500 font-bold" : "text-muted-foreground font-bold"}>
                        {v ? "✓" : "✗"}
                      </span>
                      <span className="text-foreground capitalize">{k.replace(/([A-Z])/g, " $1").trim()}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Complete Payment Details & Plan Purchases Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div>
                <h4 className="font-semibold text-base flex items-center gap-2 text-foreground">
                  <Receipt className="w-4 h-4 text-primary" />
                  Plan Purchases &amp; Payment History
                  <Badge variant="secondary" className="text-xs font-normal">
                    {payments.length}
                  </Badge>
                </h4>
                <p className="text-xs text-muted-foreground">
                  Complete records of all subscription plans purchased by users under this consultant
                </p>
              </div>

              {payments.length > 0 && (
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                </div>
              )}
            </div>

            <Card className="border border-border/50 shadow-sm overflow-hidden">
              {loadingPayments ? (
                <div className="flex flex-col items-center justify-center p-10 text-muted-foreground space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <p className="text-sm">Loading payment records...</p>
                </div>
              ) : payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">No Plan Purchases Yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    When members registered under this consultant purchase a membership plan, their transactions and revenue details will automatically appear here.
                  </p>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No payment transactions matched &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                <div className="overflow-x-auto max-h-72">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow className="border-border/60">
                        <TableHead className="text-xs font-semibold">Date</TableHead>
                        <TableHead className="text-xs font-semibold">Txn ID</TableHead>
                        <TableHead className="text-xs font-semibold">Member</TableHead>
                        <TableHead className="text-xs font-semibold">Plan</TableHead>
                        <TableHead className="text-xs font-semibold">Amount</TableHead>
                        <TableHead className="text-xs font-semibold">Method</TableHead>
                        <TableHead className="text-xs font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((p) => {
                        const dateVal = p.paidAt || p.createdAt;
                        const formattedDate = dateVal ? format(new Date(dateVal), "dd MMM yyyy, hh:mm a") : "-";
                        const memberName = p.user?.fullName || p.user?.name || "Member";
                        const memberEmail = p.user?.email || p.userEmail;

                        return (
                          <TableRow key={p._id || p.transactionId} className="border-border/40 text-xs hover:bg-muted/30">
                            <TableCell className="whitespace-nowrap text-muted-foreground">
                              {formattedDate}
                            </TableCell>
                            <TableCell className="font-mono font-medium">
                              <span className="bg-muted/70 px-1.5 py-0.5 rounded text-[11px]">
                                {p.transactionId}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">{memberName}</span>
                                <span className="text-[11px] text-muted-foreground">{memberEmail}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="font-normal text-[11px]">
                                {p.plan?.title || "Membership Plan"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-bold text-foreground whitespace-nowrap">
                              ₹{Number(p.amount || 0).toLocaleString()}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-muted-foreground">
                              <div className="flex flex-col">
                                <span>{p.paymentMethod || "Online"}</span>
                                {p.paymentGateway && p.paymentGateway !== "Offline" && (
                                  <span className="text-[10px] text-muted-foreground">{p.paymentGateway}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {getPaymentStatusBadge(p.status)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
