import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DeleteUserReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onConfirmDelete: (reason: string) => void | Promise<void>;
  loading?: boolean;
}

export function DeleteUserReasonDialog({
  open,
  onOpenChange,
  user,
  onConfirmDelete,
  loading = false,
}: DeleteUserReasonDialogProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for deleting this account.");
      return;
    }

    setError("");
    await onConfirmDelete(reason.trim());
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-destructive/10 text-destructive">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Delete User Account</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Specify the reason for deleting this user profile.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2">
          {/* Selected User Quick Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/60">
            <Avatar className="w-10 h-10 border border-border">
              {user.photos && user.photos.length > 0 ? (
                <AvatarImage
                  src={user.photos.find((p: any) => p.isPrimary)?.url || user.photos[0].url}
                  className="object-cover"
                />
              ) : (
                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName || user.email}&size=64`} />
              )}
              <AvatarFallback>{(user.fullName?.charAt(0) || user.email?.charAt(0) || "?").toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">{user.fullName || "Unnamed User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              This action cannot be undone. An email with the deletion reason will automatically be sent to <strong>{user.email}</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deletionReason" className="text-xs font-semibold">
              Reason for Deletion <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="deletionReason"
              placeholder="e.g. Violation of terms of service, duplicate profile created, user requested account removal..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
              rows={4}
              className="resize-none text-sm"
              required
            />
            {error && <p className="text-xs font-medium text-destructive mt-1">{error}</p>}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading}
              className="gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
