import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Consultant, ConsultantPermissions } from "../types";

interface ConsultantPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultant: Consultant | null;
  onSave: (permissions: ConsultantPermissions) => void;
}

const permissionLabels = [
  { key: "create_profile", label: "Create Profiles" },
  { key: "edit_profile", label: "Edit Profiles" },
  { key: "view_profile", label: "View Profiles" },
  { key: "delete_profile", label: "Delete Profiles" },
];

export function ConsultantPermissionsDialog({ open, onOpenChange, consultant, onSave }: ConsultantPermissionsDialogProps) {
  const [permissions, setPermissions] = useState<ConsultantPermissions>({
    create_profile: false,
    edit_profile: false,
    view_profile: true,
    delete_profile: false,
  });

  useEffect(() => {
    if (consultant) {
      setPermissions(consultant.permissions);
    }
  }, [consultant]);

  if (!consultant) return null;

  const handleSave = () => {
    onSave(permissions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Permissions</DialogTitle>
          <DialogDescription>Update permissions for {consultant.fullName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {permissionLabels.map((p) => (
            <div key={p.key} className="flex items-center justify-between">
              <Label>{p.label}</Label>
              <Switch
                checked={permissions[p.key as keyof ConsultantPermissions]}
                onCheckedChange={(v) => setPermissions({ ...permissions, [p.key]: v })}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
