import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

interface ApproveRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "approve" | "reject";
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function ApproveRejectDialog({ open, onOpenChange, type, onConfirm, isSubmitting }: ApproveRejectDialogProps) {
  const { selectedProfile: profile } = useAppSelector((state) => state.approvals);

  if (!profile) return null;

  const isApprove = type === "approve";

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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant={isApprove ? "default" : "destructive"}
            className={isApprove ? "bg-chart-green hover:bg-chart-green/90" : ""}
            onClick={onConfirm}
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
