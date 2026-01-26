import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePageAsync, clearPageError } from "@/store/slices/staticPageSlice";
import { StaticPage, UpdatePagePayload } from "@/services/staticPageService";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface StaticPageEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: StaticPage | null;
}

export function StaticPageEditDialog({ open, onOpenChange, page }: StaticPageEditDialogProps) {
  const dispatch = useAppDispatch();
  const { updateLoading, error } = useAppSelector((state) => state.staticPage);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
  });

  useEffect(() => {
    if (open && page) {
      dispatch(clearPageError());
      setFormData({
        title: page.title,
        slug: page.slug,
        content: page.content,
      });
    }
  }, [open, page, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) return;

    const payload: UpdatePagePayload = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
    };

    const result = await dispatch(updatePageAsync({ id: page._id, payload }));

    if (updatePageAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Static Page</DialogTitle>
          <DialogDescription>
            Update page content and details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Page Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Terms of Service"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="terms-of-service"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Enter page content..."
              className="min-h-[300px] font-mono text-sm"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateLoading}>
              {updateLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
