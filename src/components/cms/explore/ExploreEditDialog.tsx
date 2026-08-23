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
import { useToast } from "@/hooks/use-toast";
import { ExploreItem, exploreService } from "@/services/exploreService";
import { extractYoutubeId } from "./ExploreAddDialog";
import { Edit, Loader2, Youtube, Upload } from "lucide-react";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDescription(item.description || "");
      setCoupleName(item.coupleName || "");
      setWeddingDate(item.weddingDate ? new Date(item.weddingDate).toISOString().split("T")[0] : "");
      setYoutubeUrl(item.youtubeUrl || "");
      setImagePreview(item.thumbnailUrl || item.imageUrl || "");
      setImageFile(null);
    }
  }, [item, open]);

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
