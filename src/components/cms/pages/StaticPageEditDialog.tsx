import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePageAsync, clearPageError } from "@/store/slices/staticPageSlice";
import { StaticPage, UpdatePagePayload } from "@/services/staticPageService";
import { useState, useEffect, useRef } from "react";
import { Loader2, Eye, Edit3, Sparkles } from "lucide-react";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface StaticPageEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: StaticPage | null;
}

export function StaticPageEditDialog({ open, onOpenChange, page }: StaticPageEditDialogProps) {
  const dispatch = useAppDispatch();
  const { updateLoading, error } = useAppSelector((state) => state.staticPage);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    category: "Company" | "Support" | "Legal" | "General";
    status: "DRAFT" | "PUBLISHED";
    content: string;
    sections: any[];
  }>({
    title: "",
    slug: "",
    category: "Support",
    status: "PUBLISHED",
    content: "",
    sections: [],
  });

  useEffect(() => {
    if (open && page) {
      dispatch(clearPageError());
      setActiveTab("edit");
      setFormData({
        title: page.title || "",
        slug: page.slug || "",
        category: page.category || "Support",
        status: page.status || "PUBLISHED",
        content: page.content || "",
        sections: page.sections || [],
      });
      setShowConfirm(false);
    }
  }, [open, page, dispatch]);

  const insertFormatting = (prefix: string, suffix: string = "", defaultText: string = "Text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent =
      formData.content.substring(0, start) +
      replacement +
      formData.content.substring(end);

    setFormData((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) return;
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    if (!page) return;

    const payload: UpdatePagePayload = {
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      status: formData.status,
      content: formData.content,
      pageType: page.pageType,
      sections: formData.sections,
    };

    const result = await dispatch(updatePageAsync({ id: page._id, payload }));

    if (updatePageAsync.fulfilled.match(result)) {
      setShowConfirm(false);
      onOpenChange(false);
    }
  };

  const updateSection = (key: string, field: string, value: string) => {
    setFormData((prev) => {
      const newSections = [...prev.sections];
      const sectionIndex = newSections.findIndex((s) => s.key === key);

      if (sectionIndex === -1) {
        const newSection: any = { key, items: [] };
        if (key === 'contact-info' && ['email', 'phone', 'address', 'mapEmbedUrl'].includes(field)) {
          newSection.fields = { [field]: value };
        } else {
          newSection[field] = value;
        }
        newSections.push(newSection);
      } else {
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl">Edit Static Page</DialogTitle>
                <DialogDescription>
                  Update page content, category, and metadata settings.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Metadata Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-xl border border-border/60">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="edit-title" className="font-semibold">Page Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Terms of Service"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug" className="font-semibold">Slug</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="terms-of-service"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val: any) => setFormData((prev) => ({ ...prev, category: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status & Tabs Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b pb-3">
              <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
                <TabsList className="bg-muted">
                  <TabsTrigger value="edit" className="gap-2">
                    <Edit3 className="w-4 h-4" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="gap-2">
                    <Eye className="w-4 h-4" />
                    Live Preview
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Status:</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: any) => setFormData((prev) => ({ ...prev, status: val }))}
                >
                  <SelectTrigger className="h-8 text-xs w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Main Content Area */}
            {activeTab === "edit" ? (
              page.pageType === 'CONTACT' ? (
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
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                    placeholder="Enter page content..."
                    minHeight="360px"
                  />
                </div>
              )
            ) : (
              <div className="min-h-[360px] max-h-[500px] overflow-y-auto p-6 border rounded-xl bg-card shadow-sm space-y-4">
                <div className="border-b pb-4">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-full">
                    {formData.category}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-3">
                    {formData.title || "Page Title Preview"}
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    URL: /pages/{formData.slug || "page-slug"}
                  </p>
                </div>

                {formData.content ? (
                  <div
                    className="prose max-w-none dark:prose-invert text-foreground/90 leading-relaxed text-sm space-y-3 cms-content-render"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                ) : (
                  <div className="text-center py-16 text-muted-foreground italic">
                    No content entered yet. Switch to the Editor tab to add text.
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
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

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm Page Edit"
        description={`Are you sure you want to save changes to page "${formData.title}"?`}
        confirmText="Save Changes"
        loading={updateLoading}
        onConfirm={handleConfirmSave}
      />
    </>
  );
}

