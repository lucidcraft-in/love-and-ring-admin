import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Search, Filter, Plus, UserCheck, Clock, XCircle, Users, MoreHorizontal, Eye, CheckCircle, Ban, Shield, MapPin } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const consultants = [
  { id: "1", username: "broker1", email: "broker1@agency.com", fullName: "Ravi Kumar", phone: "+91 98765 43210", agencyName: "Shubh Matches", regions: ["Mumbai", "Pune"], status: "ACTIVE", permissions: { create_profile: true, edit_profile: true, view_profile: true, delete_profile: false }, profilesCreated: 45, createdAt: "2024-03-10", lastLogin: "2 hours ago" },
  { id: "2", username: "consultant_priya", email: "priya@matchmakers.com", fullName: "Priya Sharma", phone: "+91 98765 43211", agencyName: "Divine Matches", regions: ["Delhi", "Noida"], status: "PENDING", permissions: { create_profile: false, edit_profile: false, view_profile: true, delete_profile: false }, profilesCreated: 0, createdAt: "2024-03-14", lastLogin: "-" },
  { id: "3", username: "suresh_broker", email: "suresh@weddings.com", fullName: "Suresh Reddy", phone: "+91 98765 43212", agencyName: "Perfect Match", regions: ["Hyderabad", "Bangalore"], status: "ACTIVE", permissions: { create_profile: true, edit_profile: true, view_profile: true, delete_profile: true }, profilesCreated: 89, createdAt: "2024-02-20", lastLogin: "1 day ago" },
  { id: "4", username: "meena_consultant", email: "meena@rishtey.com", fullName: "Meena Patel", phone: "+91 98765 43213", agencyName: "Rishtey.com", regions: ["Ahmedabad", "Surat"], status: "REJECTED", permissions: { create_profile: false, edit_profile: false, view_profile: false, delete_profile: false }, profilesCreated: 0, createdAt: "2024-03-12", lastLogin: "-" },
  { id: "5", username: "anand_broker", email: "anand@vivah.com", fullName: "Anand Singh", phone: "+91 98765 43214", agencyName: "Vivah Services", regions: ["Chennai"], status: "SUSPENDED", permissions: { create_profile: true, edit_profile: true, view_profile: true, delete_profile: false }, profilesCreated: 23, createdAt: "2024-01-15", lastLogin: "1 week ago" },
];

type Consultant = typeof consultants[0];

const Consultants = () => {
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [permissions, setPermissions] = useState({ create_profile: false, edit_profile: false, view_profile: true, delete_profile: false });

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

  const handleReject = () => {
    toast({ title: "Consultant Rejected", description: `${selectedConsultant?.fullName} has been rejected.` });
    setRejectOpen(false);
    setRejectReason("");
  };

  const handleSavePermissions = () => {
    toast({ title: "Permissions Updated", description: `Permissions for ${selectedConsultant?.fullName} have been updated.` });
    setPermissionsOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Consultant Management</h1>
            <p className="text-sm text-muted-foreground">Manage brokers and consultants</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Consultant
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card-shadow border-0"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div><div><p className="text-xs text-muted-foreground uppercase">Total</p><p className="text-xl font-semibold">24</p></div></CardContent></Card>
          <Card className="stat-card-shadow border-0"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center"><UserCheck className="w-5 h-5 text-chart-green" /></div><div><p className="text-xs text-muted-foreground uppercase">Active</p><p className="text-xl font-semibold">18</p></div></CardContent></Card>
          <Card className="stat-card-shadow border-0"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center"><Clock className="w-5 h-5 text-chart-orange" /></div><div><p className="text-xs text-muted-foreground uppercase">Pending</p><p className="text-xl font-semibold">4</p></div></CardContent></Card>
          <Card className="stat-card-shadow border-0"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center"><XCircle className="w-5 h-5 text-destructive" /></div><div><p className="text-xs text-muted-foreground uppercase">Rejected</p><p className="text-xl font-semibold">2</p></div></CardContent></Card>
        </div>

        <Card className="stat-card-shadow border-0"><CardContent className="p-4"><div className="flex flex-col lg:flex-row gap-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search consultants..." className="pl-10" /></div><div className="flex flex-wrap gap-2"><Select defaultValue="all"><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="PENDING">Pending</SelectItem><SelectItem value="REJECTED">Rejected</SelectItem></SelectContent></Select><Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button></div></div></CardContent></Card>

        <Card className="stat-card-shadow border-0"><CardContent className="p-0">
          <Table><TableHeader><TableRow className="border-border/50"><TableHead>Consultant</TableHead><TableHead>Agency</TableHead><TableHead>Regions</TableHead><TableHead>Profiles</TableHead><TableHead>Status</TableHead><TableHead>Last Login</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {consultants.map((c) => (
                <TableRow key={c.id} className="border-border/50">
                  <TableCell><div className="flex items-center gap-3"><Avatar className="w-9 h-9"><AvatarFallback>{c.fullName.charAt(0)}</AvatarFallback></Avatar><div><p className="font-medium">{c.fullName}</p><p className="text-sm text-muted-foreground">{c.email}</p></div></div></TableCell>
                  <TableCell className="text-sm">{c.agencyName}</TableCell>
                  <TableCell><div className="flex gap-1 flex-wrap">{c.regions.slice(0, 2).map(r => <Badge key={r} variant="outline" className="text-xs"><MapPin className="w-3 h-3 mr-1" />{r}</Badge>)}</div></TableCell>
                  <TableCell className="font-medium">{c.profilesCreated}</TableCell>
                  <TableCell>{getStatusBadge(c.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedConsultant(c); setViewOpen(true); }}><Eye className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                        {c.status === "PENDING" && <><DropdownMenuItem onClick={() => { setSelectedConsultant(c); setApproveOpen(true); }}><CheckCircle className="w-4 h-4 mr-2" />Approve</DropdownMenuItem><DropdownMenuItem onClick={() => { setSelectedConsultant(c); setRejectOpen(true); }} className="text-destructive"><Ban className="w-4 h-4 mr-2" />Reject</DropdownMenuItem></>}
                        {c.status === "ACTIVE" && <DropdownMenuItem onClick={() => { setSelectedConsultant(c); setPermissions(c.permissions); setPermissionsOpen(true); }}><Shield className="w-4 h-4 mr-2" />Edit Permissions</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Consultant Details</DialogTitle></DialogHeader>{selectedConsultant && <div className="space-y-4"><div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"><Avatar className="w-14 h-14"><AvatarFallback className="text-lg">{selectedConsultant.fullName.charAt(0)}</AvatarFallback></Avatar><div><h3 className="font-semibold">{selectedConsultant.fullName}</h3><p className="text-sm text-muted-foreground">@{selectedConsultant.username}</p>{getStatusBadge(selectedConsultant.status)}</div></div><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-muted-foreground">Email</p><p className="font-medium">{selectedConsultant.email}</p></div><div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selectedConsultant.phone}</p></div><div><p className="text-muted-foreground">Agency</p><p className="font-medium">{selectedConsultant.agencyName}</p></div><div><p className="text-muted-foreground">Profiles Created</p><p className="font-medium">{selectedConsultant.profilesCreated}</p></div></div><div><p className="text-sm text-muted-foreground mb-2">Regions</p><div className="flex gap-2 flex-wrap">{selectedConsultant.regions.map(r => <Badge key={r} variant="outline">{r}</Badge>)}</div></div><div><p className="text-sm text-muted-foreground mb-2">Permissions</p><div className="grid grid-cols-2 gap-2 text-sm">{Object.entries(selectedConsultant.permissions).map(([k, v]) => <div key={k} className="flex items-center gap-2"><span className={v ? "text-chart-green" : "text-muted-foreground"}>{v ? "✓" : "✗"}</span><span>{k.replace("_", " ")}</span></div>)}</div></div></div>}</DialogContent></Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}><DialogContent><DialogHeader><DialogTitle className="flex items-center gap-2 text-chart-green"><CheckCircle className="w-5 h-5" />Approve Consultant</DialogTitle><DialogDescription>Approve {selectedConsultant?.fullName}'s account?</DialogDescription></DialogHeader><p className="text-sm text-muted-foreground">A password setup email will be sent to {selectedConsultant?.email}.</p><DialogFooter><Button variant="outline" onClick={() => setApproveOpen(false)}>Cancel</Button><Button onClick={handleApprove} className="bg-chart-green hover:bg-chart-green/90 text-white">Approve</Button></DialogFooter></DialogContent></Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}><DialogContent><DialogHeader><DialogTitle className="flex items-center gap-2 text-destructive"><Ban className="w-5 h-5" />Reject Consultant</DialogTitle></DialogHeader><div className="space-y-4"><Label>Rejection Reason (Optional)</Label><Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter reason..." rows={3} /></div><DialogFooter><Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleReject}>Reject</Button></DialogFooter></DialogContent></Dialog>

      {/* Permissions Dialog */}
      <Dialog open={permissionsOpen} onOpenChange={setPermissionsOpen}><DialogContent><DialogHeader><DialogTitle>Edit Permissions</DialogTitle><DialogDescription>Update permissions for {selectedConsultant?.fullName}</DialogDescription></DialogHeader><div className="space-y-4">{[{key: "create_profile", label: "Create Profiles"}, {key: "edit_profile", label: "Edit Profiles"}, {key: "view_profile", label: "View Profiles"}, {key: "delete_profile", label: "Delete Profiles"}].map(p => <div key={p.key} className="flex items-center justify-between"><Label>{p.label}</Label><Switch checked={permissions[p.key as keyof typeof permissions]} onCheckedChange={(v) => setPermissions({...permissions, [p.key]: v})} /></div>)}</div><DialogFooter><Button variant="outline" onClick={() => setPermissionsOpen(false)}>Cancel</Button><Button onClick={handleSavePermissions}>Save</Button></DialogFooter></DialogContent></Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogContent><DialogHeader><DialogTitle>Add New Consultant</DialogTitle></DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>Username</Label><Input placeholder="broker_name" /></div><div><Label>Email</Label><Input type="email" placeholder="email@agency.com" /></div></div><div><Label>Full Name</Label><Input placeholder="Full Name" /></div><div className="grid grid-cols-2 gap-4"><div><Label>Phone</Label><Input placeholder="+91..." /></div><div><Label>Agency Name</Label><Input placeholder="Agency" /></div></div></div><DialogFooter><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={() => { toast({ title: "Consultant Created", description: "Notification email sent." }); setCreateOpen(false); }}>Create</Button></DialogFooter></DialogContent></Dialog>
    </AdminLayout>
  );
};

export default Consultants;
