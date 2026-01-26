import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createPageAsync, clearPageError } from "@/store/slices/staticPageSlice";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface StaticPageAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaticPageAddDialog({ open, onOpenChange }: StaticPageAddDialogProps) {
  const dispatch = useAppDispatch();
  const { createLoading, error } = useAppSelector((state) => state.staticPage);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
  });

  useEffect(() => {
    if (!open) {
      dispatch(clearPageError());
      setFormData({
        title: "",
        slug: "",
        content: "",
      });
    }
  }, [open, dispatch]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(createPageAsync({
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
    }));

    if (createPageAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Static Page</DialogTitle>
          <DialogDescription>
            Add a new content page to the website.
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
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Terms of Service"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="terms-of-service"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Enter page content (HTML or Markdown supported depending on frontend implementation)..."
              className="min-h-[300px] font-mono text-sm"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLoading}>
              {createLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Page
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
