import { useState, useEffect, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  WeddingServiceItem,
  weddingServiceService,
  weddingServiceCategories,
} from "@/services/weddingServiceService";
import { Edit, Upload, Loader2, Crop, X, Star } from "lucide-react";
import { ImageCropModal } from "@/components/common/ImageCropModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ServiceEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: WeddingServiceItem | null;
  onSuccess: () => void;
}

export const ServiceEditDialog = ({
  open,
  onOpenChange,
  item,
  onSuccess,
}: ServiceEditDialogProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Photographers");
  const [description, setDescription] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [rating, setRating] = useState<number>(5.0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setCategory(item.category || "Photographers");
      setDescription(item.description || "");
      setPriceRange(item.priceRange || "");
      setLocation(item.location || "");
      setContactEmail(item.contactEmail || "");
      setContactPhone(item.contactPhone || "");
      setStatus(item.status || "Active");
      setRating(item.rating || 5.0);
      setImagePreview(item.imageUrl || "");
      setRawImageSrc(item.imageUrl || null);
      setImageFile(null);
      setShowCropModal(false);
      setShowConfirmModal(false);
    }
  }, [item]);

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
    setImageFile(croppedFile);
    setImagePreview(croppedPreviewUrl);
    setRawImageSrc(croppedPreviewUrl);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setRawImageSrc(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    if (!title.trim()) {
      toast({ title: "Error", description: "Service title is required", variant: "destructive" });
      return;
    }

    if (!description.trim()) {
      toast({ title: "Error", description: "Description is required", variant: "destructive" });
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    if (!item) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("priceRange", priceRange);
      formData.append("location", location);
      formData.append("contactEmail", contactEmail);
      formData.append("contactPhone", contactPhone);
      formData.append("status", status);
      formData.append("rating", rating.toString());

      if (imageFile) {
        formData.append("file", imageFile);
      }

      await weddingServiceService.updateWeddingService(item._id, formData);

      toast({
        title: "Service Updated! ✨",
        description: "Wedding service details updated successfully.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Failed to Update Service",
        description: err?.response?.data?.message || err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Edit Wedding Service Details
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Service Title / Business Name *</Label>
                <Input
                  id="edit-title"
                  placeholder="e.g. Royal Wedding Photography Studio"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Service Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {weddingServiceCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Service Image / Cover Photo</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <span className="text-sm font-medium text-foreground block">Click to select new photo file</span>
                  <span className="text-xs text-muted-foreground block mt-1">PNG, JPG, WEBP up to 100MB</span>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-border group">
                  <img src={imagePreview} alt="Preview" className="max-h-52 w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {/* <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setShowCropModal(true)}
                      className="gap-1 text-xs"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      Crop &amp; Adjust
                    </Button> */}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1 text-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Change Photo
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-priceRange">Price Range / Estimate (Optional)</Label>
                <Input
                  id="edit-priceRange"
                  placeholder="e.g. ₹50,000 - ₹2,000,000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Location / City</Label>
                <Input
                  id="edit-location"
                  placeholder="e.g. Kochi, Kerala"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={status} onValueChange={(v: "Active" | "Inactive") => setStatus(v)}>
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-contactEmail">Contact Email</Label>
                <Input
                  id="edit-contactEmail"
                  type="email"
                  placeholder="info@vendor.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-contactPhone">Contact Phone / WhatsApp</Label>
                <Input
                  id="edit-contactPhone"
                  placeholder="+91 9876543210"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-service-rating">Rating (1.0 to 5.0 Stars)</Label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= Math.round(rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <Input
                  id="edit-service-rating"
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={rating}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      setRating(Math.min(5, Math.max(1, val)));
                    } else {
                      setRating(5);
                    }
                  }}
                  className="w-24 font-semibold text-center"
                />
                <span className="text-sm font-semibold text-muted-foreground">/ 5.0</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Service Description *</Label>
              <Textarea
                id="edit-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
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

      <ImageCropModal
        open={showCropModal}
        onOpenChange={setShowCropModal}
        imageSrc={rawImageSrc || imagePreview}
        onCropComplete={handleCropComplete}
      />

      <ConfirmDialog
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        title="Confirm Service Changes"
        description={`Are you sure you want to save and update the details for "${title}"? This will update the service details on the website.`}
        confirmText="Save & Publish"
        cancelText="Cancel"
        loading={loading}
        onConfirm={handleConfirmSave}
      />
    </>
  );
};
