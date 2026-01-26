import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateBannerAsync, clearBannerError } from "@/store/slices/bannerSlice";
import { Banner, UpdateBannerPayload } from "@/services/bannerService";
import { useState, useEffect } from "react";
import { Loader2, Upload, X } from "lucide-react";

interface BannerEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
}

export function BannerEditDialog({ open, onOpenChange, banner }: BannerEditDialogProps) {
  const dispatch = useAppDispatch();
  const { updateLoading, error } = useAppSelector((state) => state.banner);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    targetUrl: "",
    startDate: "",
    endDate: "",
    status: "Active" as "Active" | "Inactive",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (open && banner) {
      dispatch(clearBannerError());
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle,
        targetUrl: banner.targetUrl,
        startDate: banner.startDate?.split('T')[0] || "",
        endDate: banner.endDate?.split('T')[0] || "",
        status: banner.status,
        image: null,
      });
      setImagePreview(banner.imageUrl);
    }
  }, [open, banner, dispatch]);

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
    if (!banner) return;

    const payload: UpdateBannerPayload = {
      title: formData.title,
      subtitle: formData.subtitle,
      targetUrl: formData.targetUrl,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
    };

    if (formData.image) {
      payload.image = formData.image;
    }

    const result = await dispatch(updateBannerAsync({ id: banner._id, payload }));

    if (updateBannerAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  if (!banner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Banner</DialogTitle>
          <DialogDescription>
            Update banner details and image.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Summer Sale"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subtitle">Subtitle</Label>
              <Input
                id="edit-subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Up to 50% off"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-targetUrl">Target URL</Label>
            <Input
              id="edit-targetUrl"
              value={formData.targetUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, targetUrl: e.target.value }))}
              placeholder="/promotions/summer-sale"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Start Date</Label>
              <Input
                id="edit-startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-endDate">End Date</Label>
              <Input
                id="edit-endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "Active" | "Inactive") => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Banner Image</Label>
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
                  id="edit-banner-image"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="edit-banner-image"
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
