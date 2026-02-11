import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateStaffAsync, clearStaffError, fetchStaffListAsync } from "@/store/slices/staffSlice";
import { fetchBranchesAsync } from "@/store/slices/branchSlice";
import { Staff } from "@/services/staffService";
import { useState, useEffect } from "react";
import { fetchRolesAsync } from "@/store/slices/roleSlice";
import { Loader2 } from "lucide-react";

interface StaffEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
}

export function StaffEditDialog({ open, onOpenChange, staff }: StaffEditDialogProps) {
  const dispatch = useAppDispatch();
  const { updateLoading, error } = useAppSelector((state) => state.staff);
  // const { branches } = useAppSelector((state) => state.branch);
  const { roles } = useAppSelector((state) => state.role);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    // branch: "",
    password: "",
    status: "",
  });

  // Fetch branches when dialog opens
  // useEffect(() => {
  //   if (open && branches.length === 0) {
  //     dispatch(fetchBranchesAsync({ take: 100 }));
  //   }
  // Fetch roles when dialog opens
  useEffect(() => {
    if (open && roles.length === 0) {
      dispatch(fetchRolesAsync());
    }
  }, [open, roles.length, dispatch]);

  // Populate form when staff changes
  useEffect(() => {
    if (staff) {
      setFormData({
        fullName: staff.fullName,
        email: staff.email,
        phone: staff.phone || "",
        role: typeof staff.role === 'object' ? staff.role._id : staff.role as string,
        // branch: staff.branch,
        password: "",
        status: staff.status,
      });
    }
  }, [staff]);

  // Clear error when dialog closes
  useEffect(() => {
    if (!open) {
      dispatch(clearStaffError());
    }
  }, [open, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!staff) return;

    // Only include password if it's been changed
    const payload: any = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      // branch: formData.branch,
      status: formData.status,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    const result = await dispatch(updateStaffAsync({ id: staff._id, payload }));

    if (updateStaffAsync.fulfilled.match(result)) {
      dispatch(fetchStaffListAsync({ take: 100 }));
      onOpenChange(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>
            Update staff information and role assignment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-fullName">Full Name *</Label>
            <Input
              id="edit-fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="staff@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              type="number"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
            <Input
              id="edit-password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role">Role *</Label>
            <Select value={formData.role} onValueChange={(value) => handleChange("role", value)} required>
              <SelectTrigger id="edit-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role._id} value={role._id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)} required>
              <SelectTrigger id="edit-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="edit-branch">Branch *</Label>
            <Select value={formData.branch} onValueChange={(value) => handleChange("branch", value)} required>
              <SelectTrigger id="edit-branch">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches
                  .filter((branch) => branch.status === "Active")
                  .map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div> */}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateLoading}>
              {updateLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Staff
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
