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
import { deleteStaffAsync } from "@/store/slices/staffSlice";
import { Staff } from "@/services/staffService";
import { Loader2 } from "lucide-react";

interface StaffDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
}

export function StaffDeleteDialog({ open, onOpenChange, staff }: StaffDeleteDialogProps) {
  const dispatch = useAppDispatch();
  const { deleteLoading } = useAppSelector((state) => state.staff);

  const handleDelete = async () => {
    if (!staff) return;

    const result = await dispatch(deleteStaffAsync(staff._id));

    if (deleteStaffAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  if (!staff) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{staff.fullName}</strong> from the staff list.
            This action cannot be undone.
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
