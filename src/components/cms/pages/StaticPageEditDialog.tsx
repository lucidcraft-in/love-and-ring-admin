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

  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    content: string;
    sections: any[];
  }>({
    title: "",
    slug: "",
    content: "",
    sections: [],
  });

  useEffect(() => {
    if (open && page) {
      dispatch(clearPageError());
      setFormData({
        title: page.title,
        slug: page.slug,
        content: page.content,
        sections: page.sections || [],
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
      pageType: page.pageType,
      sections: formData.sections,
    };

    const result = await dispatch(updatePageAsync({ id: page._id, payload }));

    if (updatePageAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  const updateSection = (key: string, field: string, value: string) => {
    setFormData((prev) => {
      const newSections = [...prev.sections];
      const sectionIndex = newSections.findIndex((s) => s.key === key);

      if (sectionIndex === -1) {
        // Create section if it doesn't exist
        const newSection: any = { key, items: [] };
        if (key === 'contact-info' && ['email', 'phone', 'address', 'mapEmbedUrl'].includes(field)) {
          newSection.fields = { [field]: value };
        } else {
          newSection[field] = value;
        }
        newSections.push(newSection);
      } else {
        // Update existing section
        if (key === 'contact-info' && ['email', 'phone', 'address', 'mapEmbedUrl'].includes(field)) {
          newSections[sectionIndex] = {
            ...newSections[sectionIndex],
            fields: {
              ...(newSections[sectionIndex].fields || {}),
              [field]: value
            }
          };
        } else {
          newSections[sectionIndex] = { ...newSections[sectionIndex], [field]: value };
        }
      }
      return { ...prev, sections: newSections };
    });
  };

  const getSectionValue = (key: string, field: string) => {
    const section = formData.sections.find(s => s.key === key);
    if (!section) return "";

    if (key === 'contact-info' && ['email', 'phone', 'address', 'mapEmbedUrl'].includes(field)) {
      return section.fields?.[field] || "";
    }
    return section[field] || "";
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

          {page.pageType === 'CONTACT' ? (
            <div className="space-y-6 border-t pt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Hero Section</h3>
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    value={getSectionValue('hero', 'heading')}
                    onChange={(e) => updateSection('hero', 'heading', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={getSectionValue('hero', 'description')}
                    onChange={(e) => updateSection('hero', 'description', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={getSectionValue('contact-info', 'email')}
                      onChange={(e) => updateSection('contact-info', 'email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={getSectionValue('contact-info', 'phone')}
                      onChange={(e) => updateSection('contact-info', 'phone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={getSectionValue('contact-info', 'address')}
                    onChange={(e) => updateSection('contact-info', 'address', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Google Maps Embed URL</Label>
                  <Input
                    value={getSectionValue('contact-info', 'mapEmbedUrl')}
                    onChange={(e) => updateSection('contact-info', 'mapEmbedUrl', e.target.value)}
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                  <p className="text-xs text-muted-foreground">Paste the 'src' attribute from Google Maps Embed HTML</p>
                </div>
              </div>
            </div>
          ) : (
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
          )}

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
