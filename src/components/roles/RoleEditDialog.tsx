import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateRoleAsync, clearRoleError } from "@/store/slices/roleSlice";
import { Role } from "@/services/roleService";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface RoleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}

const permissionLabels: Record<string, string> = {
  viewProfiles: "View Profiles",
  editProfiles: "Edit Profiles",
  deleteProfiles: "Delete Profiles",
  approveProfiles: "Approve Profiles",
  managePayments: "Manage Payments",
  manageBranches: "Manage Branches",
  viewReports: "View Reports",
  manageStaff: "Manage Staff",
  manageAdmins: "Manage Admins",
  manageSettings: "Manage Settings",
};

export function RoleEditDialog({ open, onOpenChange, role }: RoleEditDialogProps) {
  const dispatch = useAppDispatch();
  const { updateLoading, error } = useAppSelector((state) => state.role);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: {} as Record<string, boolean>,
  });

  // Populate form when role changes
  useEffect(() => {
    if (role) {
      // Initialize permissions with all keys
      const initialPermissions: Record<string, boolean> = {};
      Object.keys(permissionLabels).forEach((key) => {
        initialPermissions[key] = role.permissions?.[key] || false;
      });

      setFormData({
        name: role.name,
        description: role.description || "",
        permissions: initialPermissions,
      });
    }
  }, [role]);

  // Clear error when dialog closes
  useEffect(() => {
    if (!open) {
      dispatch(clearRoleError());
    }
  }, [open, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) return;

    const result = await dispatch(updateRoleAsync({ id: role._id, payload: formData }));

    if (updateRoleAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked,
      },
    }));
  };

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update role information and permissions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-name">Role Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Branch Manager"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this role"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg">
              {Object.entries(permissionLabels).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${key}`}
                    checked={formData.permissions[key] || false}
                    onCheckedChange={(checked) => handlePermissionChange(key, checked as boolean)}
                  />
                  <label
                    htmlFor={`edit-${key}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateLoading}>
              {updateLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
