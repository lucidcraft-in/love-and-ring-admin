import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ExploreItem, exploreService } from "@/services/exploreService";
import { successStoryService, SuccessStory } from "@/services/successStoryService";
import { extractYoutubeId } from "./ExploreAddDialog";
import { Edit, Loader2, Youtube, Upload, Heart, Link as LinkIcon } from "lucide-react";

interface ExploreEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ExploreItem | null;
  onSuccess: () => void;
}

export const ExploreEditDialog = ({
  open,
  onOpenChange,
  item,
  onSuccess,
}: ExploreEditDialogProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coupleName, setCoupleName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [successStoryId, setSuccessStoryId] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Success Stories for Dropdown
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchSuccessStories();
    }
  }, [open]);

  useEffect(() => {
    if (item && open) {
      setTitle(item.title || "");
      setDescription(item.description || "");
      setCoupleName(item.coupleName || "");
      setWeddingDate(item.weddingDate ? new Date(item.weddingDate).toISOString().split("T")[0] : "");
      setYoutubeUrl(item.youtubeUrl || "");
      
      const sId = typeof item.successStoryId === "object" && item.successStoryId
        ? item.successStoryId._id
        : (item.successStoryId as string) || "";
      setSuccessStoryId(sId);

      setImagePreview(item.thumbnailUrl || item.imageUrl || "");
      setImageFile(null);
    }
  }, [item, open]);

  const fetchSuccessStories = async () => {
    try {
      setStoriesLoading(true);
      const data = await successStoryService.getStories();
      setStories(data || []);
    } catch (err) {
      console.error("Failed to load success stories for dropdown:", err);
    } finally {
      setStoriesLoading(false);
    }
  };

  const handleSelectStory = (storyId: string) => {
    if (storyId === "none") {
      setSuccessStoryId("");
      return;
    }

    setSuccessStoryId(storyId);
    const selected = stories.find((s) => s._id === storyId);
    if (selected) {
      if (!coupleName.trim()) setCoupleName(selected.coupleName);
      if (!title.trim()) setTitle(`${selected.coupleName}'s Wedding Highlight`);
      if (!weddingDate && selected.date) {
        try {
          setWeddingDate(new Date(selected.date).toISOString().split("T")[0]);
        } catch (e) {}
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item?._id) return;

    if (!title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("coupleName", coupleName);
      formData.append("successStoryId", successStoryId);
      if (weddingDate) formData.append("weddingDate", weddingDate);

      if (item.type === "video" && youtubeUrl) {
        formData.append("youtubeUrl", youtubeUrl);
      }

      if (imageFile) {
        formData.append("file", imageFile);
      }

      await exploreService.updateExploreItem(item._id, formData);

      toast({
        title: "Updated Successfully 🎉",
        description: `Explore item "${title}" has been updated`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Failed to Update Item",
        description: err?.response?.data?.message || err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  const videoId = extractYoutubeId(youtubeUrl);
  const detectedYoutubeThumb = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            Edit Explore Item
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Linked Success Story Dropdown */}
          <div className="space-y-2 bg-muted/30 p-3 rounded-lg border">
            <Label htmlFor="edit-successStoryId" className="flex items-center gap-1.5 font-semibold text-xs">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              Link Reference to Success Story (Optional)
            </Label>
            <Select value={successStoryId || "none"} onValueChange={handleSelectStory}>
              <SelectTrigger id="edit-successStoryId" className="w-full bg-background">
                <SelectValue placeholder="-- Select a Success Story Reference --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-- No Linked Success Story --</SelectItem>
                {stories.map((story) => (
                  <SelectItem key={story._id} value={story._id}>
                    {story.coupleName} ({new Date(story.date).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Select a couple's success story to link this explore photo/video directly to their story page.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title / Headline *</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-coupleName">Couple Names</Label>
              <Input
                id="edit-coupleName"
                value={coupleName}
                onChange={(e) => setCoupleName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-weddingDate">Wedding Date</Label>
            <Input
              id="edit-weddingDate"
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
            />
          </div>

          {item.type === "video" && (
            <div className="space-y-2">
              <Label htmlFor="edit-youtubeUrl">YouTube Shorts / Video URL</Label>
              <div className="relative">
                <Youtube className="w-4 h-4 absolute left-3 top-3 text-red-500" />
                <Input
                  id="edit-youtubeUrl"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Update Image / Custom Thumbnail (Upload to S3)</Label>
            <div className="flex items-center gap-4 border p-3 rounded-lg">
              {(imagePreview || detectedYoutubeThumb) && (
                <img
                  src={imagePreview || detectedYoutubeThumb!}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded border"
                />
              )}
              <label className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Replace Image File
                  </span>
                </Button>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Caption / Description</Label>
            <Textarea
              id="edit-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
