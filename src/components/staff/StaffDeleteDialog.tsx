import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StaffMember {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
  branch: string;
  profilesHandled: number;
  matchesSuggested: number;
  status: string;
  lastLogin: string;
}

interface StaffDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
}

export function StaffDeleteDialog({ open, onOpenChange, staff }: StaffDeleteDialogProps) {
  if (!staff) return null;

  const handleDelete = () => {
    toast({
      title: "Staff Removed",
      description: `${staff.name} has been removed from the system.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Remove Staff Member
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please confirm.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Staff Info */}
          <div className="flex items-center gap-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <Avatar className="w-12 h-12">
              <AvatarImage src={staff.avatar} />
              <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{staff.name}</p>
              <p className="text-sm text-muted-foreground">{staff.email}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{staff.role}</Badge>
                <Badge variant="outline" className="text-xs">{staff.branch}</Badge>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-muted rounded-lg text-sm space-y-2">
            <p className="font-medium">Removing this staff member will:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Revoke their access to the admin portal</li>
              <li>Unassign them from all active tasks</li>
              <li>Archive their activity history</li>
              <li>Remove them from branch assignments</li>
            </ul>
          </div>

          <div className="p-3 bg-chart-orange/10 rounded-lg text-sm text-chart-orange flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>This staff member has handled {staff.profilesHandled} profiles and made {staff.matchesSuggested} matches. Consider reassigning their work before removal.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Staff
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
