import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deletePageAsync, clearPageError } from "@/store/slices/staticPageSlice";
import { StaticPage } from "@/services/staticPageService";
import { Loader2, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface StaticPageDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: StaticPage | null;
}

export function StaticPageDeleteDialog({ open, onOpenChange, page }: StaticPageDeleteDialogProps) {
  const dispatch = useAppDispatch();
  const { deleteLoading, error } = useAppSelector((state) => state.staticPage);

  useEffect(() => {
    if (!open) {
      dispatch(clearPageError());
    }
  }, [open, dispatch]);

  const handleDelete = async () => {
    if (!page) return;
    const result = await dispatch(deletePageAsync(page._id));
    if (deletePageAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-3 text-destructive mb-2">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle>Delete Static Page</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold text-foreground">"{page.title}"</span>? This action cannot be undone and will remove the page from the website footer and site navigation.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete Page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
