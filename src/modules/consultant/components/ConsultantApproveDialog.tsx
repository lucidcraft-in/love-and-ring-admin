import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { Consultant } from "../types";

interface ConsultantApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultant: Consultant | null;
  onApprove: () => void;
}

export function ConsultantApproveDialog({ open, onOpenChange, consultant, onApprove }: ConsultantApproveDialogProps) {
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
          A password setup email will be sent to {consultant.email}.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onApprove} className="bg-chart-green hover:bg-chart-green/90 text-white">
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
