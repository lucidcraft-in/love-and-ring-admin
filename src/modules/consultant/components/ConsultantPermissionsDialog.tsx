import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePermissionsAsync } from "@/store/slices/consultantSlice";
import { toast } from "@/hooks/use-toast";
import type { Consultant, ConsultantPermissions } from "@/services/consultantService";

interface ConsultantPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultant: Consultant | null;
  onSave: () => void;
}

const permissionLabels = [
  { key: "createProfile", label: "Create Profiles" },
  { key: "editProfile", label: "Edit Profiles" },
  { key: "viewProfile", label: "View Profiles" },
  { key: "deleteProfile", label: "Delete Profiles" },
];

export function ConsultantPermissionsDialog({ open, onOpenChange, consultant, onSave }: ConsultantPermissionsDialogProps) {
  const dispatch = useAppDispatch();
  const { permissionsLoading } = useAppSelector((state) => state.consultant);

  const [permissions, setPermissions] = useState<ConsultantPermissions>({
    createProfile: false,
    editProfile: false,
    viewProfile: true,
    deleteProfile: false,
  });

  useEffect(() => {
    if (consultant) {
      setPermissions(consultant.permissions);
    }
  }, [consultant]);

  if (!consultant) return null;

  const handleSave = async () => {
    try {
      await dispatch(updatePermissionsAsync({
        id: consultant._id,
        permissions,
      })).unwrap();

      toast({
        title: "Permissions Updated",
        description: `Permissions for ${consultant.fullName} have been updated.`,
      });

      onSave();
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
          <DialogDescription>Update permissions for {consultant.fullName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {permissionLabels.map((p) => (
            <div key={p.key} className="flex items-center justify-between">
              <Label>{p.label}</Label>
              <Switch
                checked={permissions[p.key as keyof ConsultantPermissions]}
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
