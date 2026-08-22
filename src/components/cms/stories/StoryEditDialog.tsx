import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateStoryAsync, clearStoryError } from "@/store/slices/successStorySlice";
import { SuccessStory, UpdateStoryPayload } from "@/services/successStoryService";
import { useState, useEffect, useRef } from "react";
import { Loader2, Upload, X, Crop } from "lucide-react";
import { ImageCropModal } from "@/components/common/ImageCropModal";
import { RichTextEditor } from "@/components/common/RichTextEditor";

interface StoryEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story: SuccessStory | null;
}

export function StoryEditDialog({ open, onOpenChange, story }: StoryEditDialogProps) {
  const dispatch = useAppDispatch();
  const { updateLoading, error } = useAppSelector((state) => state.successStory);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [formData, setFormData] = useState({
    coupleName: "",
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

  const formDataForInput = (isoDate: string) => {
    return new Date(isoDate).toISOString().split("T")[0];
  };

  useEffect(() => {
    if (open && story) {
      dispatch(clearStoryError());
      setFormData({
        coupleName: story.coupleName,
        story: story.story,
        date: story.date ? formDataForInput(story.date) : "",
        status: story.status,
        image: null,
        isPrimary: story.isPrimary,
      });
      setImagePreview(story.imageUrl);
      setRawImageSrc(story.imageUrl);
      setShowCropModal(false);
    }
  }, [open, story, dispatch]);

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
    setRawImageSrc(croppedPreviewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story) return;

    const payload: UpdateStoryPayload = {
      coupleName: formData.coupleName,
      story: formData.story,
      date: formData.date,
      status: formData.status,
      isPrimary: formData.isPrimary,
    };

    if (formData.image) {
      payload.image = formData.image;
    }

    const result = await dispatch(updateStoryAsync({ id: story._id, payload }));

    if (updateStoryAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  if (!story) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Success Story</DialogTitle>
            <DialogDescription>
              Update the success story details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-coupleName">Couple Name</Label>
              <Input
                id="edit-coupleName"
                value={formData.coupleName}
                onChange={(e) => setFormData((prev) => ({ ...prev, coupleName: e.target.value }))}
                placeholder="Rahul & Priya"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-story">Story Content</Label>
              <RichTextEditor
                value={formData.story}
                onChange={(story) => setFormData((prev) => ({ ...prev, story }))}
                placeholder="Tell us about their journey..."
                minHeight="160px"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
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
                id="edit-story-image"
                onChange={handleImageChange}
              />
              <div className="flex gap-4 items-start">
                {imagePreview && (
                  <div className="relative rounded-lg overflow-hidden border border-border w-36 h-24 shrink-0 group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    {/* <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setShowCropModal(true)}
                        className="h-7 text-xs px-2 gap-1"
                      >
                        <Crop className="w-3 h-3" />
                        Crop
                      </Button>
                    </div> */}
                  </div>
                )}
                <div className="flex-1 flex flex-col gap-2">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Change Image</span>
                    </div>
                  </div>
                </div>
              </div>
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

      <ImageCropModal
        open={showCropModal}
        onOpenChange={setShowCropModal}
        imageSrc={rawImageSrc || imagePreview}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}
