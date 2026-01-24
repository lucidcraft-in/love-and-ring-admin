import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteRoleAsync } from "@/store/slices/roleSlice";
import { Role } from "@/services/roleService";
import { Loader2 } from "lucide-react";

interface RoleDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}

export function RoleDeleteDialog({ open, onOpenChange, role }: RoleDeleteDialogProps) {
  const dispatch = useAppDispatch();
  const { deleteLoading } = useAppSelector((state) => state.role);

  const handleDelete = async () => {
    if (!role) return;

    const result = await dispatch(deleteRoleAsync(role._id));

    if (deleteRoleAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  if (!role) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the role <strong>{role.name}</strong>.
            This action cannot be undone and may affect users assigned to this role.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
