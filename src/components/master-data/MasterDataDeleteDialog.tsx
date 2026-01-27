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
import { deleteMasterDataAsync } from "@/store/slices/masterDataSlice";
import { MasterItem, MasterDataType } from "@/services/masterDataService";
import { Loader2 } from "lucide-react";

interface MasterDataDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: MasterDataType | null;
  item: MasterItem | null;
  title: string;
}

export function MasterDataDeleteDialog({ open, onOpenChange, type, item, title }: MasterDataDeleteDialogProps) {
  const dispatch = useAppDispatch();
  const { deleteLoading } = useAppSelector((state) => state.masterData);

  const handleDelete = async () => {
    if (!type || !item) return;

    const result = await dispatch(deleteMasterDataAsync({ type, id: item._id }));

    if (deleteMasterDataAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  if (!item) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {title}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete <span className="font-medium text-foreground">"{item.name}"</span>.
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
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
