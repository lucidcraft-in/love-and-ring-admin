import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createStoryAsync, clearStoryError } from "@/store/slices/successStorySlice";
import { ServiceUsedItem } from "@/services/successStoryService";
import { weddingServiceService, WeddingServiceItem } from "@/services/weddingServiceService";
import { useState, useEffect, useRef } from "react";
import { Loader2, Upload, X, Crop, Youtube, Video, Briefcase, Plus, ImageIcon } from "lucide-react";
import { ImageCropModal } from "@/components/common/ImageCropModal";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { useToast } from "@/hooks/use-toast";

interface StoryAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoryAddDialog({ open, onOpenChange }: StoryAddDialogProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { createLoading, error } = useAppSelector((state) => state.successStory);

  const [formData, setFormData] = useState({
    coupleNames: "",
    story: "",
    date: "",
    status: "Published" as "Published" | "Pending",
    image: null as File | null,
    videoUrl: "",
    galleryPhotos: [] as string[],
    servicesUsed: [] as ServiceUsedItem[],
    isPrimary: false,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  // Wedding Services selector state
  const [availableServices, setAvailableServices] = useState<WeddingServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      fetchAvailableServices();
    } else {
      dispatch(clearStoryError());
      setFormData({
        coupleNames: "",
        story: "",
        date: "",
        status: "Published",
        image: null,
        videoUrl: "",
        galleryPhotos: [],
        servicesUsed: [],
        isPrimary: false,
      });
      setImagePreview(null);
      setRawImageSrc(null);
      setShowCropModal(false);
      setGalleryUrlInput("");
    }
  }, [open, dispatch]);

  const fetchAvailableServices = async () => {
    try {
      setServicesLoading(true);
      const services = await weddingServiceService.getWeddingServices();
      setAvailableServices(services || []);
    } catch (err) {
      console.error("Failed to load services for dropdown:", err);
    } finally {
      setServicesLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Image size must be up to 100 MB",
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }
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

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    setRawImageSrc(null);
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      galleryPhotos: [...prev.galleryPhotos, galleryUrlInput.trim()],
    }));
    setGalleryUrlInput("");
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryPhotos: prev.galleryPhotos.filter((_, i) => i !== index),
    }));
  };

  const handleSelectService = (serviceId: string) => {
    if (!serviceId) return;
    const selected = availableServices.find((s) => s._id === serviceId);
    if (!selected) return;

    if (formData.servicesUsed.some((s) => s.serviceId === selected._id || s.title === selected.title)) {
      toast({ title: "Already Added", description: "This service is already in the list." });
      return;
    }

    const newItem: ServiceUsedItem = {
      serviceId: selected._id,
      title: selected.title,
      category: selected.category,
      priceRange: selected.priceRange,
      location: selected.location,
      imageUrl: selected.imageUrl,
    };

    setFormData((prev) => ({
      ...prev,
      servicesUsed: [...prev.servicesUsed, newItem],
    }));
  };

  const handleRemoveService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      servicesUsed: prev.servicesUsed.filter((_, i) => i !== index),
    }));
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
        videoUrl: formData.videoUrl,
        galleryPhotos: formData.galleryPhotos,
        servicesUsed: formData.servicesUsed,
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
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Success Story</DialogTitle>
            <DialogDescription>
              Share a new success story with photos, video highlights, and service references.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="coupleNames">Couple Names *</Label>
              <Input
                id="coupleNames"
                value={formData.coupleNames}
                onChange={(e) => setFormData((prev) => ({ ...prev, coupleNames: e.target.value }))}
                placeholder="Rahul & Priya"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="story">Story Content *</Label>
              <RichTextEditor
                value={formData.story}
                onChange={(story) => setFormData((prev) => ({ ...prev, story }))}
                placeholder="Tell us about their journey..."
                minHeight="160px"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
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

            {/* Primary Couple Image */}
            <div className="space-y-2">
              <Label>Primary Cover Photo *</Label>
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
                  <span className="text-sm font-medium">Click to upload cover photo</span>
                  <span className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 100MB</span>
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

            {/* Video Link Field */}
            <div className="space-y-2 border-t pt-4">
              <Label htmlFor="videoUrl" className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                Couple Video Link / YouTube Shorts URL (Optional)
              </Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://www.youtube.com/shorts/... or https://youtu.be/..."
              />
              <p className="text-[11px] text-muted-foreground">
                Attach a YouTube Shorts or video link for the couple's wedding highlights.
              </p>
            </div>

            {/* Additional Gallery Photos */}
            <div className="space-y-2 border-t pt-4">
              <Label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Additional Gallery Photos
              </Label>
              <div className="flex gap-2">
                <Input
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  placeholder="Paste image URL..."
                  className="text-xs"
                />
                <Button type="button" size="sm" onClick={handleAddGalleryUrl} variant="outline">
                  <Plus className="w-4 h-4 mr-1" /> Add URL
                </Button>
              </div>

              {formData.galleryPhotos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {formData.galleryPhotos.map((url, idx) => (
                    <div key={idx} className="relative rounded border overflow-hidden group h-20 bg-muted">
                      <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryPhoto(idx)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mentioned Wedding Services */}
            <div className="space-y-3 border-t pt-4">
              <Label className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Mention Services & Partners Used
              </Label>
              <p className="text-xs text-muted-foreground">
                Select catering teams, photographers, event planners, venues, or anchors that catered for this couple.
              </p>

              <Select onValueChange={handleSelectService}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- Select a Wedding Service --" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No services available
                    </SelectItem>
                  ) : (
                    availableServices.map((svc) => (
                      <SelectItem key={svc._id} value={svc._id}>
                        {svc.title} ({svc.category})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {formData.servicesUsed.length > 0 && (
                <div className="space-y-2 pt-2">
                  {formData.servicesUsed.map((svc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/30 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {svc.imageUrl && (
                          <img src={svc.imageUrl} alt={svc.title} className="w-9 h-9 rounded object-cover" />
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{svc.title}</p>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {svc.category}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => handleRemoveService(idx)}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
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