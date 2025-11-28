import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Ban } from "lucide-react";
import type { Consultant } from "../types";

interface ConsultantRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultant: Consultant | null;
  onReject: (reason: string) => void;
}

export function ConsultantRejectDialog({ open, onOpenChange, consultant, onReject }: ConsultantRejectDialogProps) {
  const [rejectReason, setRejectReason] = useState("");

  if (!consultant) return null;

  const handleReject = () => {
    onReject(rejectReason);
    setRejectReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Ban className="w-5 h-5" />
            Reject Consultant
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label>Rejection Reason (Optional)</Label>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter reason..."
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReject}>
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
