import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle } from "lucide-react";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Consultant Profile</DialogTitle>
          <DialogDescription>
            Review the consultant's application details
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-xl">{profile.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{profile.fullName}</h3>
                <p className="text-muted-foreground">{profile.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">Pending Approval</Badge>
                  <Badge variant="secondary">Consultant</Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {/* <h4 className="font-medium mb-2 text-primary">Agency Details</h4>
                 <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground block">Agency Name</span>
                    <span className="text-sm font-medium">{profile.agencyName || "N/A"}</span>
                  </div>
                </div> */}
              </div>

              <div>
                <h4 className="font-medium mb-2 text-primary">Service Regions</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.regions && profile.regions.length > 0 ? (
                    profile.regions.map(region => (
                      <Badge key={region} variant="secondary">{region}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No specific regions listed</span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2 text-primary">Submission Info</h4>
              <div>
                <span className="text-xs text-muted-foreground block">Submitted At</span>
                <span className="text-sm">{format(new Date(profile.createdAt), "PPP p")}</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={() => { onOpenChange(false); onReject(profile._id); }}>
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button className="bg-chart-green hover:bg-chart-green/90" onClick={() => { onOpenChange(false); onApprove(profile._id); }}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
