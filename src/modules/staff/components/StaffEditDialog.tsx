import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save } from "lucide-react";
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

interface StaffEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
}

export function StaffEditDialog({ open, onOpenChange, staff }: StaffEditDialogProps) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", role: "", branch: "", status: "" });

  useEffect(() => {
    if (staff) {
      setFormData({ name: staff.name, email: staff.email, phone: staff.phone, role: staff.role, branch: staff.branch, status: staff.status });
    }
  }, [staff]);

  if (!staff) return null;

  const handleSave = () => {
    toast({ title: "Staff Updated", description: `${formData.name}'s profile has been updated.` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Staff Profile</DialogTitle>
          <DialogDescription>Update staff member information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14"><AvatarImage src={staff.avatar} /><AvatarFallback>{staff.name.charAt(0)}</AvatarFallback></Avatar>
            <div><p className="font-medium">{staff.name}</p><p className="text-sm text-muted-foreground">Staff ID: #{staff.id}</p></div>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Role</Label><Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Branch Admin">Branch Admin</SelectItem><SelectItem value="Matchmaker">Matchmaker</SelectItem><SelectItem value="Support Staff">Support Staff</SelectItem></SelectContent></Select></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
