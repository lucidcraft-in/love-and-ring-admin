import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, UserCheck, Clock, XCircle, Users, MoreHorizontal, Eye, CheckCircle, Ban, Shield, MapPin } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { ConsultantViewDialog } from "../components/ConsultantViewDialog";
import { ConsultantApproveDialog } from "../components/ConsultantApproveDialog";
import { ConsultantRejectDialog } from "../components/ConsultantRejectDialog";
import { ConsultantPermissionsDialog } from "../components/ConsultantPermissionsDialog";
import { ConsultantCreateDialog } from "../components/ConsultantCreateDialog";
import { useConsultantData } from "../hooks/useConsultantData";
import type { Consultant } from "../types";

export default function ConsultantList() {
  const { consultants, stats } = useConsultantData();
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: "bg-chart-green/10 text-chart-green",
      PENDING: "bg-chart-orange/10 text-chart-orange",
      REJECTED: "bg-destructive/10 text-destructive",
      SUSPENDED: "bg-muted text-muted-foreground"
    };
    return <Badge variant="secondary" className={styles[status]}>{status}</Badge>;
  };

  const handleApprove = () => {
    toast({ title: "Consultant Approved", description: `${selectedConsultant?.fullName} has been approved. Password setup email sent.` });
    setApproveOpen(false);
  };

  const handleReject = (reason: string) => {
    toast({ title: "Consultant Rejected", description: `${selectedConsultant?.fullName} has been rejected.` });
    setRejectOpen(false);
  };

  const handleSavePermissions = (permissions: Consultant['permissions']) => {
    toast({ title: "Permissions Updated", description: `Permissions for ${selectedConsultant?.fullName} have been updated.` });
    setPermissionsOpen(false);
  };

  const handleCreate = () => {
    toast({ title: "Consultant Created", description: "Notification email sent." });
    setCreateOpen(false);
  };

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
              <Input placeholder="Search consultants..." className="pl-10" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="stat-card-shadow border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Consultant</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Regions</TableHead>
                <TableHead>Profiles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultants.map((c) => (
                <TableRow key={c.id} className="border-border/50">
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
                  <TableCell className="text-sm">{c.agencyName}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {c.regions.slice(0, 2).map(r => (
                        <Badge key={r} variant="outline" className="text-xs">
                          <MapPin className="w-3 h-3 mr-1" />{r}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{c.profilesCreated}</TableCell>
                  <TableCell>{getStatusBadge(c.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.lastLogin}</TableCell>
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
    </div>
  );
}
