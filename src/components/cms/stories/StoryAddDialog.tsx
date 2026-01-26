import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createStoryAsync, clearStoryError } from "@/store/slices/successStorySlice";
import { useState, useEffect } from "react";
import { Loader2, Upload, X } from "lucide-react";

interface StoryAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoryAddDialog({ open, onOpenChange }: StoryAddDialogProps) {
  const dispatch = useAppDispatch();
  const { createLoading, error } = useAppSelector((state) => state.successStory);

  const [formData, setFormData] = useState({
    coupleNames: "",
    story: "",
    date: "",
    status: "Published" as "Published" | "Pending",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      dispatch(clearStoryError());
      setFormData({
        coupleNames: "",
        story: "",
        date: "",
        status: "Published",
        image: null,
      });
      setImagePreview(null);
    }
  }, [open, dispatch]);

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

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return;

    const result = await dispatch(createStoryAsync({
      coupleNames: formData.coupleNames,
      story: formData.story,
      date: formData.date,
      status: formData.status,
      image: formData.image,
    }));

    if (createStoryAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  return (
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
            <Label htmlFor="story">Story</Label>
            <Textarea
              id="story"
              value={formData.story}
              onChange={(e) => setFormData((prev) => ({ ...prev, story: e.target.value }))}
              placeholder="Tell us about their journey..."
              className="min-h-[100px]"
              required
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
            <Label>Couple Image</Label>
            {!imagePreview ? (
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="story-image"
                  onChange={handleImageChange}
                  required
                />
                <label htmlFor="story-image" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">Click to upload image</span>
                  <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</span>
                </label>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={removeImage}
                >
                  <X className="w-3 h-3" />
                </Button>
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
  );
}
