import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateStoryAsync, clearStoryError } from "@/store/slices/successStorySlice";
import { SuccessStory, UpdateStoryPayload } from "@/services/successStoryService";
import { useState, useEffect } from "react";
import { Loader2, Upload, X } from "lucide-react";

interface StoryEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story: SuccessStory | null;
}

export function StoryEditDialog({ open, onOpenChange, story }: StoryEditDialogProps) {
  const dispatch = useAppDispatch();
  const { updateLoading, error } = useAppSelector((state) => state.successStory);

  const [formData, setFormData] = useState({
    coupleName: "",
    story: "",
    date: "",
    status: "Published" as "Published" | "Pending",
    image: null as File | null,
    isPrimary:false
  });

  const formDataForInput = (isoDate:string) =>{
    return new Date(isoDate).toISOString().split("T")[0];
  }

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (open && story) {
      dispatch(clearStoryError());
      setFormData({
        coupleName: story.coupleName,
        story: story.story,
        date: formDataForInput(story.date),
        status: story.status,
        image: null,
        isPrimary:story.isPrimary
      });
      setImagePreview(story.imageUrl);
    }
  }, [open, story, dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story) return;

    const payload: UpdateStoryPayload = {
      coupleName: formData.coupleName,
      story: formData.story,
      date: formData.date,
      status: formData.status,
      isPrimary:formData.isPrimary,
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
            <Label htmlFor="edit-story">Story</Label>
            <Textarea
              id="edit-story"
              value={formData.story}
              onChange={(e) => setFormData((prev) => ({ ...prev, story: e.target.value }))}
              placeholder="Tell us about their journey..."
              className="min-h-[100px]"
              required
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
            <div className="flex gap-4 items-start">
              {imagePreview && (
                <div className="relative rounded-lg overflow-hidden border border-border w-32 h-20 shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="edit-story-image"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="edit-story-image"
                  className="flex items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Change Image</span>
                  </div>
                </label>
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
  );
}
