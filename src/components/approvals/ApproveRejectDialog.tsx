import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

interface ApproveRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "approve" | "reject";
  onConfirm: (reason?: string) => void;
  isSubmitting: boolean;
}

export function ApproveRejectDialog({ open, onOpenChange, type, onConfirm, isSubmitting }: ApproveRejectDialogProps) {
  const { selectedProfile: profile } = useAppSelector((state) => state.approvals);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open, type]);

  if (!profile) return null;

  const isApprove = type === "approve";

  const handleConfirm = () => {
    onConfirm(isApprove ? undefined : reason);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <CheckCircle className="w-5 h-5 text-chart-green" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            )}
            {isApprove ? "Approve Consultant" : "Reject Consultant"}
          </DialogTitle>
          <DialogDescription>
            {isApprove
              ? `Are you sure you want to approve ${profile.fullName}? They will be granted consultant access.`
              : `Are you sure you want to reject ${profile.fullName}? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>

        {!isApprove && (
          <div className="space-y-2 py-2">
            <Label htmlFor="rejectionReason" className="text-sm font-medium">
              Rejection Reason <span className="text-muted-foreground">(Optional, will be sent in email)</span>
            </Label>
            <Textarea
              id="rejectionReason"
              placeholder="Specify reason for rejection (e.g. Invalid document, Incomplete profile details...)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[90px] text-sm resize-none"
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant={isApprove ? "default" : "destructive"}
            className={isApprove ? "bg-chart-green hover:bg-chart-green/90" : ""}
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isApprove ? "Confirm Approval" : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
