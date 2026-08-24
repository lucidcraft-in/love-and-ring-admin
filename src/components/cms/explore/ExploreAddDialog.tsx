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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { exploreService } from "@/services/exploreService";
import { successStoryService, SuccessStory } from "@/services/successStoryService";
import { Upload, Video, Image as ImageIcon, Loader2, Youtube, Heart } from "lucide-react";

interface ExploreAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const extractYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const ExploreAddDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: ExploreAddDialogProps) => {
  const { toast } = useToast();
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coupleName, setCoupleName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [successStoryId, setSuccessStoryId] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Success Stories list for reference
  const [stories, setStories] = useState<SuccessStory[]>([]);

  useEffect(() => {
    if (open) {
      fetchSuccessStories();
    } else {
      setTitle("");
      setDescription("");
      setCoupleName("");
      setWeddingDate("");
      setYoutubeUrl("");
      setSuccessStoryId("");
      setImageFile(null);
      setImagePreview("");
    }
  }, [open]);

  const fetchSuccessStories = async () => {
    try {
      const data = await successStoryService.getStories();
      setStories(data || []);
    } catch (err) {
      console.error("Failed to load success stories for dropdown:", err);
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
      if (file.size > 100 * 1024 * 1024) {
        toast({ title: "Error", description: "Image size must be up to 100 MB", variant: "destructive" });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const youtubeVideoId = extractYoutubeId(youtubeUrl);
  const youtubeThumbnail = youtubeVideoId ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg` : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }

    if (mediaType === "image" && !imageFile) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    if (mediaType === "video" && !youtubeUrl.trim()) {
      toast({ title: "Error", description: "Please enter a valid YouTube Shorts URL", variant: "destructive" });
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
      formData.append("type", mediaType);

      if (mediaType === "video") {
        formData.append("youtubeUrl", youtubeUrl);
        if (imageFile) {
          formData.append("file", imageFile);
        }
      } else {
        if (imageFile) {
          formData.append("file", imageFile);
        }
      }

      await exploreService.createExploreItem(formData);

      toast({
        title: "Success! 🎉",
        description: `Explore ${mediaType === "image" ? "Photo" : "Video"} added successfully`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Failed to Add Item",
        description: err?.response?.data?.message || err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Add Item to Explore / Wedding Gallery
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={mediaType} onValueChange={(v: any) => setMediaType(v)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Marriage Photo
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                YouTube Shorts Video
              </TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="space-y-4 pt-3">
              <div className="space-y-2">
                <Label>Upload Marriage Photo *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded object-cover" />
                      <Button type="button" variant="outline" size="sm" onClick={() => { setImageFile(null); setImagePreview(""); }}>
                        Change Photo
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer space-y-2 block">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground block">Click to select photo file</span>
                      <span className="text-xs text-muted-foreground block">PNG, JPG, WEBP up to 100MB (Uploaded to S3)</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4 pt-3">
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube Shorts / Video URL *</Label>
                <div className="relative">
                  <Youtube className="w-4 h-4 absolute left-3 top-3 text-red-500" />
                  <Input
                    id="youtubeUrl"
                    placeholder="https://www.youtube.com/shorts/abcd123"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Paste YouTube Shorts link or regular YouTube video URL.
                </p>
              </div>

              {youtubeThumbnail && (
                <div className="p-3 bg-muted/40 rounded-lg border space-y-2">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Youtube className="w-4 h-4 text-red-500" />
                    Detected YouTube Video Thumbnail Preview:
                  </span>
                  <div className="relative w-48 h-32 rounded overflow-hidden bg-black mx-auto">
                    <img src={youtubeThumbnail} alt="YouTube Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
                        ▶
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Linked Success Story Reference */}
          <div className="space-y-2 bg-muted/30 p-3 rounded-lg border">
            <Label htmlFor="add-successStoryId" className="flex items-center gap-1.5 font-semibold text-xs">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              Link Reference to Success Story (Optional)
            </Label>
            <Select value={successStoryId || "none"} onValueChange={handleSelectStory}>
              <SelectTrigger id="add-successStoryId" className="w-full bg-background">
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
              <Label htmlFor="title">Title / Headline *</Label>
              <Input
                id="title"
                placeholder="e.g. Rahul &amp; Ananya's Royal Wedding"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coupleName">Couple Names</Label>
              <Input
                id="coupleName"
                placeholder="e.g. Rahul &amp; Ananya"
                value={coupleName}
                onChange={(e) => setCoupleName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weddingDate">Wedding Date</Label>
            <Input
              id="weddingDate"
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Caption / Description</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="e.g. Found their soulmate on Love &amp; Ring in 2025. Here are the wedding highlights!"
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
              Save &amp; Publish to Explore
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
