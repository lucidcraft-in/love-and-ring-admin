import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Mail, Phone, MapPin, Calendar, Building2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { format } from "date-fns";

interface ApprovalDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApprovalDetailsDialog({ open, onOpenChange, onApprove, onReject }: ApprovalDetailsDialogProps) {
  const { selectedProfile: profile } = useAppSelector((state) => state.approvals);

  if (!profile) return null;

  let formattedDate = "-";
  try {
    if (profile.createdAt) {
      formattedDate = format(new Date(profile.createdAt), "PPP p");
    }
  } catch (e) {
    formattedDate = profile.createdAt || "-";
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Consultant Profile</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Review the consultant's application details below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Top Profile Summary Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {profile.fullName?.charAt(0)?.toUpperCase() || "C"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-foreground truncate">{profile.fullName}</h3>
                {profile.username && (
                  <span className="text-xs text-muted-foreground font-medium">(@{profile.username})</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-primary/70" />
                  {profile.email}
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-primary/70" />
                    {profile.phone}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-medium">
                  Pending Approval
                </Badge>
                <Badge variant="secondary" className="text-[11px] font-medium">
                  Consultant
                </Badge>
              </div>
            </div>
          </div>

          {/* Key Application Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Regions */}
            <div className="p-3.5 rounded-lg border bg-card space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <MapPin className="w-4 h-4" />
                <span>Service Regions</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.regions && profile.regions.length > 0 ? (
                  profile.regions.map((region) => (
                    <Badge key={region} variant="secondary" className="text-xs font-normal">
                      {region}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No specific regions listed</span>
                )}
              </div>
            </div>

            {/* Submission Info */}
            <div className="p-3.5 rounded-lg border bg-card space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Calendar className="w-4 h-4" />
                <span>Submission Info</span>
              </div>
              <div className="pt-1">
                <span className="text-xs text-muted-foreground block">Submitted At</span>
                <span className="text-xs font-medium text-foreground">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Agency / Company Info (If available) */}
          {profile.agencyName && (
            <div className="p-3.5 rounded-lg border bg-card space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Building2 className="w-4 h-4" />
                <span>Agency Details</span>
              </div>
              <p className="text-xs font-medium text-foreground">{profile.agencyName}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between gap-2 border-t pt-4 mt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs px-4">
            Close
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onReject(profile._id);
              }}
              className="text-xs px-4 flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onApprove(profile._id);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
