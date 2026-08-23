import { useState, useRef } from "react";
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
  weddingServiceService,
  weddingServiceCategories,
} from "@/services/weddingServiceService";
import { Upload, Plus, Loader2, Crop, X, Star } from "lucide-react";
import { ImageCropModal } from "@/components/common/ImageCropModal";

interface ServiceAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const ServiceAddDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: ServiceAddDialogProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Photographers");
  const [description, setDescription] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [rating, setRating] = useState<number>(5.0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({ title: "Error", description: "Service title is required", variant: "destructive" });
      return;
    }

    if (!description.trim()) {
      toast({ title: "Error", description: "Description is required", variant: "destructive" });
      return;
    }

    if (!imageFile) {
      toast({ title: "Error", description: "Service image photo is required", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      if (priceRange) formData.append("priceRange", priceRange);
      if (location) formData.append("location", location);
      if (contactEmail) formData.append("contactEmail", contactEmail);
      if (contactPhone) formData.append("contactPhone", contactPhone);
      formData.append("rating", rating.toString());
      formData.append("file", imageFile);

      await weddingServiceService.createWeddingService(formData);

      toast({
        title: "Service Created! 🎉",
        description: "Wedding service created successfully and is now active.",
      });

      // Reset form
      setTitle("");
      setCategory("Photographers");
      setDescription("");
      setPriceRange("");
      setLocation("");
      setContactEmail("");
      setContactPhone("");
      setRating(5.0);
      setImageFile(null);
      setImagePreview("");
      setRawImageSrc(null);
      setShowCropModal(false);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Failed to Add Service",
        description: err?.response?.data?.message || err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Wedding Service
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title / Business Name *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Royal Wedding Photography Studio"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Service Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
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
              <Label>Service Image / Cover Photo *</Label>
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
                  <span className="text-sm font-medium text-foreground block">Click to select photo file</span>
                  <span className="text-xs text-muted-foreground block mt-1">PNG, JPG, WEBP up to 100MB</span>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-border group">
                  <img src={imagePreview} alt="Preview" className="max-h-52 w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setShowCropModal(true)}
                      className="gap-1 text-xs"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      Crop &amp; Adjust
                    </Button>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceRange">Price Range / Estimate (Optional)</Label>
                <Input
                  id="priceRange"
                  placeholder="e.g. ₹50,000 - ₹2,000,000 or Contact for Quote"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location / City</Label>
                <Input
                  id="location"
                  placeholder="e.g. Kochi, Kerala / All India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="e.g. info@studioroyal.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone / WhatsApp (Optional)</Label>
                <Input
                  id="contactPhone"
                  placeholder="e.g. +91 9876543210"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-rating">Rating (1.0 to 5.0 Stars)</Label>
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
                  id="service-rating"
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
              <Label htmlFor="description">Service Description &amp; Key Offerings *</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="e.g. Premium cinematic wedding photography &amp; videography team with 10+ years experience specializing in luxury destination weddings..."
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
                Save &amp; Publish Service
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
};
