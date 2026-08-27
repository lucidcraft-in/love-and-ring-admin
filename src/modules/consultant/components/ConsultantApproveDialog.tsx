import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import type { Consultant } from "../types";

interface ConsultantApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultant: Consultant | null;
  onApprove: () => void;
  loading?: boolean;
}

export function ConsultantApproveDialog({ open, onOpenChange, consultant, onApprove, loading }: ConsultantApproveDialogProps) {
  if (!consultant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-chart-green">
            <CheckCircle className="w-5 h-5" />
            Approve Consultant
          </DialogTitle>
          <DialogDescription>
            Approve {consultant.fullName}'s account?
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          An approval email with login credentials will be sent to {consultant.email}.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onApprove} disabled={loading} className="bg-chart-green hover:bg-chart-green/90 text-white">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              "Approve"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
