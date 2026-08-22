import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateBannerAsync, clearBannerError } from "@/store/slices/bannerSlice";
import { Banner, UpdateBannerPayload } from "@/services/bannerService";
import { useState, useEffect } from "react";
import { Loader2, Upload } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface BannerEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
}

export function BannerEditDialog({ open, onOpenChange, banner }: BannerEditDialogProps) {
  const dispatch = useAppDispatch();
  const { updateLoading, error } = useAppSelector((state) => state.banner);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    targetUrl: "",
    status: "Active" as "Active" | "Inactive",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (open && banner) {
      dispatch(clearBannerError());
      setFormData({
        title: banner.title || "",
        subtitle: banner.subtitle || "",
        targetUrl: banner.targetUrl || "",
        status: banner.status,
        image: null,
      });
      setImagePreview(banner.imageUrl);
      setShowConfirm(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner || !formData.title) return;
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    if (!banner) return;

    const payload: UpdateBannerPayload = {
      title: formData.title,
      subtitle: formData.subtitle,
      targetUrl: formData.targetUrl,
      status: formData.status,
    };

    if (formData.image) {
      payload.image = formData.image;
    }

    const result = await dispatch(updateBannerAsync({ id: banner._id, payload }));

    if (updateBannerAsync.fulfilled.match(result)) {
      setShowConfirm(false);
      onOpenChange(false);
    }
  };

  if (!banner) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>
              Update banner title, link, or image.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Banner Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-title">Banner Title <span className="text-destructive">*</span></Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Summer Offer"
                required
              />
            </div>

            {/* Target URL */}
            <div className="space-y-2">
              <Label htmlFor="edit-targetUrl">Click Link / Target URL <span className="text-xs text-muted-foreground">(Optional)</span></Label>
              <Input
                id="edit-targetUrl"
                value={formData.targetUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, targetUrl: e.target.value }))}
                placeholder="e.g. /pricing"
              />
            </div>

            {/* Status */}
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
                  <SelectItem value="Active">Active (Visible in Dashboard)</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Banner Image */}
            <div className="space-y-2">
              <Label>Banner Image</Label>
              <div className="flex gap-4 items-start">
                {imagePreview && (
                  <div className="relative rounded-lg overflow-hidden border border-border w-36 h-24 shrink-0">
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
                    className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="w-5 h-5 text-primary mb-1" />
                      <span className="text-xs font-medium text-foreground">Change Image</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, WEBP</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateLoading || !formData.title}>
                {updateLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm Banner Edit"
        description={`Are you sure you want to save changes to banner "${banner.title}"?`}
        confirmText="Save Changes"
        loading={updateLoading}
        onConfirm={handleConfirmSave}
      />
    </>
  );
}

