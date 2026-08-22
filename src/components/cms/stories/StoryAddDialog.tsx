import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createStoryAsync, clearStoryError } from "@/store/slices/successStorySlice";
import { useState, useEffect, useRef } from "react";
import { Loader2, Upload, X, Crop } from "lucide-react";
import { ImageCropModal } from "@/components/common/ImageCropModal";
import { RichTextEditor } from "@/components/common/RichTextEditor";

interface StoryAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoryAddDialog({ open, onOpenChange }: StoryAddDialogProps) {
  const dispatch = useAppDispatch();
  const { createLoading, error } = useAppSelector((state) => state.successStory);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [formData, setFormData] = useState({
    coupleNames: "",
    story: "",
    date: "",
    status: "Published" as "Published" | "Pending",
    image: null as File | null,
    isPrimary: false,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertFormatting = (prefix: string, suffix: string = "", defaultText: string = "Text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.story.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent =
      formData.story.substring(0, start) +
      replacement +
      formData.story.substring(end);

    setFormData((prev) => ({ ...prev, story: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 50);
  };

  useEffect(() => {
    if (!open) {
      dispatch(clearStoryError());
      setFormData({
        coupleNames: "",
        story: "",
        date: "",
        status: "Published",
        image: null,
        isPrimary: false,
      });
      setImagePreview(null);
      setRawImageSrc(null);
      setShowCropModal(false);
    }
  }, [open, dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setRawImageSrc(result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleCropComplete = (croppedFile: File, croppedPreviewUrl: string) => {
    setFormData((prev) => ({ ...prev, image: croppedFile }));
    setImagePreview(croppedPreviewUrl);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    setRawImageSrc(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return;

    const result = await dispatch(
      createStoryAsync({
        coupleName: formData.coupleNames,
        story: formData.story,
        date: formData.date,
        status: formData.status,
        image: formData.image,
        isPrimary: formData.isPrimary,
      })
    );

    if (createStoryAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Success Story</DialogTitle>
            <DialogDescription>
              Share a new success story from a happy couple.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="coupleNames">Couple Names</Label>
              <Input
                id="coupleNames"
                value={formData.coupleNames}
                onChange={(e) => setFormData((prev) => ({ ...prev, coupleNames: e.target.value }))}
                placeholder="Rahul & Priya"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="story">Story Content</Label>
              <RichTextEditor
                value={formData.story}
                onChange={(story) => setFormData((prev) => ({ ...prev, story }))}
                placeholder="Tell us about their journey..."
                minHeight="160px"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "Published" | "Pending") => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isPrimary">Is Primary</Label>
              <Select
                value={formData.isPrimary ? "true" : "false"}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, isPrimary: value === "true" }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Couple Image</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                id="story-image"
                onChange={handleImageChange}
              />
              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">Click to upload image</span>
                  <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</span>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-border group">
                  <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setShowCropModal(true)}
                      className="gap-1 text-xs"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      Crop & Adjust
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1 text-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Change
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={removeImage}
                      className="gap-1 text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={createLoading || !formData.image}>
                {createLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Story
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ImageCropModal
        open={showCropModal}
        onOpenChange={setShowCropModal}
        imageSrc={rawImageSrc || imagePreview}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}