import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ExploreItem, exploreService } from "@/services/exploreService";
import { Loader2 } from "lucide-react";

interface ExploreDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ExploreItem | null;
  onSuccess: () => void;
}

export const ExploreDeleteDialog = ({
  open,
  onOpenChange,
  item,
  onSuccess,
}: ExploreDeleteDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!item?._id) return;

    try {
      setLoading(true);
      await exploreService.deleteExploreItem(item._id);
      toast({
        title: "Deleted",
        description: `Item "${item.title}" deleted successfully`,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err?.response?.data?.message || err.message || "Could not delete item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this item?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove <strong>"{item.title}"</strong> from the Explore Gallery section. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete Item
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
