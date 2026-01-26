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
import { deleteStoryAsync } from "@/store/slices/successStorySlice";
import { SuccessStory } from "@/services/successStoryService";
import { Loader2 } from "lucide-react";

interface StoryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story: SuccessStory | null;
}

export function StoryDeleteDialog({ open, onOpenChange, story }: StoryDeleteDialogProps) {
  const dispatch = useAppDispatch();
  const { deleteLoading } = useAppSelector((state) => state.successStory);

  const handleDelete = async () => {
    if (!story) return;

    const result = await dispatch(deleteStoryAsync(story._id));

    if (deleteStoryAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  if (!story) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Story?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the success story of <span className="font-medium text-foreground">"{story.coupleNames}"</span>.
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
