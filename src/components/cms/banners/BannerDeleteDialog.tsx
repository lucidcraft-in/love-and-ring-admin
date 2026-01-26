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
import { deleteBannerAsync } from "@/store/slices/bannerSlice";
import { Banner } from "@/services/bannerService";
import { Loader2 } from "lucide-react";

interface BannerDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
}

export function BannerDeleteDialog({ open, onOpenChange, banner }: BannerDeleteDialogProps) {
  const dispatch = useAppDispatch();
  const { deleteLoading } = useAppSelector((state) => state.banner);

  const handleDelete = async () => {
    if (!banner) return;

    const result = await dispatch(deleteBannerAsync(banner._id));

    if (deleteBannerAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  if (!banner) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Banner?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will deactivate the banner <span className="font-medium text-foreground">"{banner.title}"</span>.
            It will no longer be visible on the website.
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
