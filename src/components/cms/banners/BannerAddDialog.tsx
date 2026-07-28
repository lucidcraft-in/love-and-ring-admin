import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createBannerAsync, clearBannerError } from "@/store/slices/bannerSlice";
import { useState, useEffect } from "react";
import { Loader2, Upload, X } from "lucide-react";

interface BannerAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BannerAddDialog({ open, onOpenChange }: BannerAddDialogProps) {
  const dispatch = useAppDispatch();
  const { createLoading, error } = useAppSelector((state) => state.banner);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    targetUrl: "",
    status: "Active" as "Active" | "Inactive",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Clear state when dialog closes
  useEffect(() => {
    if (!open) {
      dispatch(clearBannerError());
      setFormData({
        title: "",
        subtitle: "",
        targetUrl: "",
        status: "Active",
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

    const result = await dispatch(createBannerAsync({
      title: formData.title || "Banner",
      subtitle: formData.subtitle || undefined,
      targetUrl: formData.targetUrl || "#",
      status: formData.status,
      image: formData.image,
    }));

    if (createBannerAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Banner</DialogTitle>
          <DialogDescription>
            Upload a banner image to showcase on the user dashboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Banner Image Upload (Required & Prominent) */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Banner Image <span className="text-destructive">*</span>
            </Label>
            {!imagePreview ? (
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="banner-image"
                  onChange={handleImageChange}
                  required
                />
                <label htmlFor="banner-image" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-primary mb-2" />
                  <span className="text-sm font-medium">Click to upload image</span>
                  <span className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</span>
                </label>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 rounded-full"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Banner Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Banner Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Special Offer or Event Title"
              required
            />
          </div>

          {/* Target URL (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="targetUrl">Click Link / Target URL <span className="text-xs text-muted-foreground">(Optional)</span></Label>
            <Input
              id="targetUrl"
              value={formData.targetUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, targetUrl: e.target.value }))}
              placeholder="e.g. /pricing or https://..."
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "Active" | "Inactive") => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active (Visible in Dashboard)</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={createLoading || !formData.image || !formData.title}>
              {createLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save & Add Banner
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
