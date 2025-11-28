import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StaffMember { id: number; name: string; avatar: string; email: string; phone: string; role: string; branch: string; profilesHandled: number; matchesSuggested: number; status: string; lastLogin: string; }

interface StaffDeleteDialogProps { open: boolean; onOpenChange: (open: boolean) => void; staff: StaffMember | null; }

export function StaffDeleteDialog({ open, onOpenChange, staff }: StaffDeleteDialogProps) {
  if (!staff) return null;
  const handleDelete = () => { toast({ title: "Staff Removed", description: `${staff.name} has been removed.` }); onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="w-5 h-5" />Remove Staff Member</DialogTitle><DialogDescription>This action cannot be undone.</DialogDescription></DialogHeader>
        <div className="flex items-center gap-4 p-4 bg-destructive/10 rounded-lg">
          <Avatar className="w-12 h-12"><AvatarImage src={staff.avatar} /><AvatarFallback>{staff.name.charAt(0)}</AvatarFallback></Avatar>
          <div><p className="font-semibold">{staff.name}</p><p className="text-sm text-muted-foreground">{staff.email}</p></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}><Trash2 className="w-4 h-4 mr-2" />Remove</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
