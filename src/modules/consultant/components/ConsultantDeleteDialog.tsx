import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Loader2 } from "lucide-react";
import type { Consultant } from "../types";

interface ConsultantDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultant: Consultant | null;
  onDelete: (reason: string) => void;
  loading?: boolean;
}

export function ConsultantDeleteDialog({ open, onOpenChange, consultant, onDelete, loading }: ConsultantDeleteDialogProps) {
  const [deleteReason, setDeleteReason] = useState("");

  if (!consultant) return null;

  const handleDelete = () => {
    onDelete(deleteReason);
    setDeleteReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Delete Consultant Account
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{consultant.fullName}</strong> ({consultant.email})? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Label htmlFor="deleteReason">Reason for Deletion (Will be emailed to consultant)</Label>
          <Textarea
            id="deleteReason"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            placeholder="Enter reason for account deletion..."
            rows={3}
            disabled={loading}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
