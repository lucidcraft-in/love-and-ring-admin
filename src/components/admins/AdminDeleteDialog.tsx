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
import { deleteAdminAsync } from "@/store/slices/adminSlice";
import { Admin } from "@/services/adminService";
import { Loader2 } from "lucide-react";

interface AdminDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: Admin | null;
}

export function AdminDeleteDialog({ open, onOpenChange, admin }: AdminDeleteDialogProps) {
  const dispatch = useAppDispatch();
  const { deleteLoading } = useAppSelector((state) => state.admin);

  const handleDelete = async () => {
    if (!admin) return;

    const result = await dispatch(deleteAdminAsync(admin._id));

    if (deleteAdminAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  if (!admin) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the admin account
            for <span className="font-medium text-foreground">{admin.fullName}</span> and remove their data from the servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteLoading}
          >
            {deleteLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete Admin
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
