import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, CheckCircle, XCircle, Eye, Clock, ImageIcon, FileText, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPendingProfilesAsync, fetchApprovalStatsAsync, approveProfileAsync, rejectProfileAsync, setSelectedProfile } from "@/store/slices/approvalSlice";
import { PendingProfile } from "@/services/approvalService";
import { formatDistanceToNow } from "date-fns";
import { ApprovalDetailsDialog } from "@/components/approvals/ApprovalDetailsDialog";
import { ApproveRejectDialog } from "@/components/approvals/ApproveRejectDialog";
import { toast } from "@/components/ui/use-toast";


const Approvals = () => {
  const dispatch = useAppDispatch();
  const { pendingProfiles, stats, loading } = useAppSelector((state) => state.approvals);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchPendingProfilesAsync({ take: 50, skip: 0 }));
    dispatch(fetchApprovalStatsAsync());
  }, [dispatch]);

  const handleViewDetails = (profile: PendingProfile) => {
    dispatch(setSelectedProfile(profile));
    setDetailsOpen(true);
  };

  const handleApproveClick = (profile: PendingProfile) => {
    dispatch(setSelectedProfile(profile));
    setActionType("approve");
    setActionDialogOpen(true);
  };

  const handleRejectClick = (profile: PendingProfile) => {
    dispatch(setSelectedProfile(profile));
    setActionType("reject");
    setActionDialogOpen(true);
  };

  const handleActionConfirm = async () => {
    // Redux state has selectedProfile
    // We need ID from state or pass it. The dialog uses selectedProfile from state.
    // But for thunk dispatch we need ID.
    // Let's get it from the store state inside the component for safety, 
    // OR rely on the dialog triggering this which implies selectedProfile is set.

    // We can access it via a selector hook update or just assume it's there
    // Since we are inside the component loop, we can't easily grab state without useSelector
    // But we already have it in the details dialog logic? 
    // Wait, ApproveRejectDialog is separate.
    // Let's rely on the store's selectedProfile.
  };

  // Better implementation: pass ID or rely on global state.
  // I need access to the selectedProfile ID here to dispatch action.
  // I can get it from the store hook.
  const { selectedProfile } = useAppSelector(state => state.approvals);

  const onConfirmAction = async () => {
    if (!selectedProfile) return;
    setIsSubmitting(true);
    try {
      if (actionType === "approve") {
        await dispatch(approveProfileAsync(selectedProfile._id)).unwrap();
        toast({ title: "Approved", description: "Consultant approved successfully." });
      } else {
        await dispatch(rejectProfileAsync(selectedProfile._id)).unwrap();
        toast({ title: "Rejected", description: "Consultant rejected." });
      }
      setActionDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Action failed. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // To support approving/rejecting directly from Details Dialog
  const onApproveFromDetails = (id: string) => {
    // If coming from Details, selectedProfile is already set.
    setActionType("approve");
    setActionDialogOpen(true);
  };

  const onRejectFromDetails = (id: string) => {
    setActionType("reject");
    setActionDialogOpen(true);
  };


  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Approvals</h1>
          <p className="text-sm text-muted-foreground">Review and approve pending submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-chart-orange" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Profiles</p>
              <p className="text-xl font-semibold text-foreground">{stats?.pendingConsultants || 0}</p>
            </div>
          </CardContent>
        </Card>
        {/* <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Photos</p>
              <p className="text-xl font-semibold text-foreground">89</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Documents</p>
              <p className="text-xl font-semibold text-foreground">34</p>
            </div>
          </CardContent>
        </Card> */}
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-chart-green" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Approved Today</p>
              <p className="text-xl font-semibold text-foreground">{stats?.approvedToday || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profiles" className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            {/* <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger> */}
          </TabsList>
          <div className="flex gap-2">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="new">New Profile</SelectItem>
                <SelectItem value="update">Profile Update</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="profiles" className="space-y-4">
          {loading && (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          )}
          {!loading && pendingProfiles.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">No pending profiles found.</div>
          )}
          {pendingProfiles.map((profile) => (
            <Card key={profile._id} className="stat-card-shadow border-0">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-xl">{profile.fullName?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{profile.fullName || "Unknown"}</h3>
                        <Badge variant="outline" className="text-xs">New Profile</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                      <p className="text-sm text-muted-foreground">{profile.agencyName || "No Agency"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-2">
                      {profile.createdAt ? formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true }) : ''}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(profile)}>
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => handleRejectClick(profile)}>
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button size="sm" className="bg-chart-green hover:bg-chart-green/90" onClick={() => handleApproveClick(profile)}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* <TabsContent value="photos" className="space-y-4">
          {pendingPhotos.map((item) => (
            <Card key={item.id} className="stat-card-shadow border-0">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={item.avatar} />
                      <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{item.user}</h3>
                      <p className="text-sm text-muted-foreground">{item.photoCount} photos pending</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-2">{item.submittedAt}</span>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" /> Review
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                      <XCircle className="w-4 h-4 mr-1" /> Reject All
                    </Button>
                    <Button size="sm" className="bg-chart-green hover:bg-chart-green/90">
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent> */}

        {/* <TabsContent value="documents" className="space-y-4">
          {pendingDocuments.map((item) => (
            <Card key={item.id} className="stat-card-shadow border-0">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={item.avatar} />
                      <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{item.user}</h3>
                      <p className="text-sm text-muted-foreground">{item.docType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-2">{item.submittedAt}</span>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" /> View Document
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button size="sm" className="bg-chart-green hover:bg-chart-green/90">
                      <CheckCircle className="w-4 h-4 mr-1" /> Verify
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent> */}
      </Tabs>

      <ApprovalDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onApprove={onApproveFromDetails}
        onReject={onRejectFromDetails}
      />

      <ApproveRejectDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        type={actionType}
        onConfirm={onConfirmAction}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Approvals;
