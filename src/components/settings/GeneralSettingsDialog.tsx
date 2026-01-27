import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateGeneralSettingsAsync } from "@/store/slices/settingsSlice";
import { useState, useEffect } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { GeneralSettings } from "@/services/settingsService";

interface GeneralSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: GeneralSettings;
}

export function GeneralSettingsDialog({ open, onOpenChange, initialData }: GeneralSettingsDialogProps) {
  const dispatch = useAppDispatch();
  const { actionLoading } = useAppSelector((state) => state.settings);

  const [formData, setFormData] = useState<GeneralSettings>(initialData);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setFormData(initialData);
      setLogoFile(null);
      setFaviconFile(null);
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use FormData for file upload
    const data = new FormData();
    data.append("appName", formData.appName);
    if (formData.tagline) data.append("tagline", formData.tagline);
    if (formData.supportEmail) data.append("supportEmail", formData.supportEmail);
    if (formData.supportPhone) data.append("supportPhone", formData.supportPhone);
    data.append("defaultCountry", formData.defaultCountry);
    data.append("defaultCurrency", formData.defaultCurrency);
    if (formData.logoUrl) data.append("logoUrl", formData.logoUrl);
    if (formData.faviconUrl) data.append("faviconUrl", formData.faviconUrl);

    if (logoFile) data.append("logo", logoFile);
    if (faviconFile) data.append("favicon", faviconFile);

    const result = await dispatch(updateGeneralSettingsAsync(data));
    if (updateGeneralSettingsAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit General Settings</DialogTitle>
          <DialogDescription>
            Update basic platform information and branding.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appName">App Name</Label>
              <Input
                id="appName"
                value={formData.appName}
                onChange={(e) => setFormData(prev => ({ ...prev, appName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={formData.supportEmail || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, supportEmail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input
                id="supportPhone"
                value={formData.supportPhone || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, supportPhone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Default Country</Label>
              <Select value={formData.defaultCountry} onValueChange={(val) => setFormData(prev => ({ ...prev, defaultCountry: val }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={formData.defaultCurrency} onValueChange={(val) => setFormData(prev => ({ ...prev, defaultCurrency: val }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex items-center gap-4">
              {formData.logoUrl && !logoFile && (
                <img src={formData.logoUrl} alt="Logo" className="w-16 h-16 object-contain border rounded p-1" />
              )}
              {logoFile && (
                <div className="flex items-center gap-2 border p-2 rounded">
                  <span className="text-sm truncate max-w-[150px]">{logoFile.name}</span>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setLogoFile(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"
                  onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  {logoFile || formData.logoUrl ? "Change Logo" : "Upload Logo"}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Favicon</Label>
            <div className="flex items-center gap-4">
              {formData.faviconUrl && !faviconFile && (
                <img src={formData.faviconUrl} alt="Favicon" className="w-10 h-10 object-contain border rounded p-1" />
              )}
              {faviconFile && (
                <div className="flex items-center gap-2 border p-2 rounded">
                  <span className="text-sm truncate max-w-[150px]">{faviconFile.name}</span>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFaviconFile(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="favicon-upload"
                  onChange={(e) => e.target.files && setFaviconFile(e.target.files[0])}
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById('favicon-upload')?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  {faviconFile || formData.faviconUrl ? "Change Favicon" : "Upload Favicon"}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={actionLoading}>
              {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
