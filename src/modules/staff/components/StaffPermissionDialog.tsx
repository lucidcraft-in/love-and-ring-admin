import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePermissionsAsync } from "@/store/slices/staffSlice";
import { toast } from "@/hooks/use-toast";
import type { Staff, StaffPermissions } from "@/services/staffService";

interface StaffPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
  onSave?: () => void;
}

const permissionLabels = [
  { key: "createProfile", label: "Create Profiles" },
  { key: "editProfile", label: "Edit Profiles" },
  { key: "viewProfile", label: "View Profiles" },
  { key: "deleteProfile", label: "Delete Profiles" },
];

export function StaffPermissionsDialog({ open, onOpenChange, staff, onSave }: StaffPermissionsDialogProps) {
  const dispatch = useAppDispatch();
  const { permissionsLoading } = useAppSelector((state) => state.staff);

  const [permissions, setPermissions] = useState<StaffPermissions>({
    createProfile: false,
    editProfile: false,
    viewProfile: true,
    deleteProfile: false,
  });

  useEffect(() => {
    if (staff && staff.permissions) {
      setPermissions(staff.permissions);
    } else {
      // Reset or set defaults if permissions are missing in staff object
      setPermissions({
        createProfile: false,
        editProfile: false,
        viewProfile: true,
        deleteProfile: false,
      });
    }
  }, [staff]);

  if (!staff) return null;

  const handleSave = async () => {
    try {
      await dispatch(updatePermissionsAsync({
        id: staff._id,
        permissions,
      })).unwrap();

      toast({
        title: "Permissions Updated",
        description: `Permissions for ${staff.fullName} have been updated.`,
      });

      if (onSave) onSave();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to update permissions",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Permissions</DialogTitle>
          <DialogDescription>Update permissions for {staff.fullName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {permissionLabels.map((p) => (
            <div key={p.key} className="flex items-center justify-between">
              <Label>{p.label}</Label>
              <Switch
                checked={permissions[p.key as keyof StaffPermissions]}
                onCheckedChange={(v) => setPermissions({ ...permissions, [p.key]: v })}
                disabled={permissionsLoading}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={permissionsLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={permissionsLoading}>
            {permissionsLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
