import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createPageAsync, clearPageError } from "@/store/slices/staticPageSlice";
import { useState, useEffect, useRef } from "react";
import { Loader2, Eye, Edit3, Sparkles } from "lucide-react";
import { RichTextEditor } from "@/components/common/RichTextEditor";

interface StaticPageAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaticPageAddDialog({ open, onOpenChange }: StaticPageAddDialogProps) {
  const dispatch = useAppDispatch();
  const { createLoading, error } = useAppSelector((state) => state.staticPage);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [autoSlug, setAutoSlug] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Support" as "Company" | "Support" | "Legal" | "General",
    status: "PUBLISHED" as "DRAFT" | "PUBLISHED",
    content: "",
  });

  useEffect(() => {
    if (!open) {
      dispatch(clearPageError());
      setActiveTab("edit");
      setAutoSlug(true);
      setFormData({
        title: "",
        slug: "",
        category: "Support",
        status: "PUBLISHED",
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
      slug: autoSlug ? generateSlug(title) : prev.slug,
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(createPageAsync({
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      category: formData.category,
      status: formData.status,
      content: formData.content,
    }));

    if (createPageAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Create Static Page</DialogTitle>
              <DialogDescription>
                Add a new policy or informational content page to the website.
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
              <Label htmlFor="title" className="font-semibold">Page Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g., Refund Policy"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug" className="font-semibold">Slug</Label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-xs text-primary hover:underline"
                >
                  {autoSlug ? "Custom" : "Auto"}
                </button>
              </div>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                }}
                placeholder="refund-policy"
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
                  <SelectValue placeholder="Select section" />
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
            <div className="space-y-2">
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                placeholder="Enter page content..."
                minHeight="360px"
              />
            </div>
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
