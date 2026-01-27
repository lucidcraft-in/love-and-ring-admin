import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateSocialLoginAsync } from "@/store/slices/settingsSlice";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { SocialLoginSettings } from "@/services/settingsService";

interface SocialLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: SocialLoginSettings;
}

export function SocialLoginDialog({ open, onOpenChange, initialData }: SocialLoginDialogProps) {
  const dispatch = useAppDispatch();
  const { actionLoading } = useAppSelector((state) => state.settings);
  const [formData, setFormData] = useState<SocialLoginSettings>(initialData);

  useEffect(() => {
    if (open) {
      setFormData(initialData);
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updateSocialLoginAsync(formData));
    if (updateSocialLoginAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  const updateGoogle = (field: string, val: any) => {
    setFormData(prev => ({ ...prev, google: { ...prev.google, [field]: val } }));
  };
  const updateFacebook = (field: string, val: any) => {
    setFormData(prev => ({ ...prev, facebook: { ...prev.facebook, [field]: val } }));
  };
  const updateApple = (field: string, val: any) => {
    setFormData(prev => ({ ...prev, apple: { ...prev.apple, [field]: val } }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Social Login Settings</DialogTitle>
          <DialogDescription>
            Configure Google, Facebook, and Apple logins.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Google */}
          <div className="p-4 border border-border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">G</span>
                </div>
                <div>
                  <p className="font-medium">Google</p>
                  <p className="text-sm text-muted-foreground">Sign in with Google</p>
                </div>
              </div>
              <Switch checked={formData.google?.enabled} onCheckedChange={(c) => updateGoogle('enabled', c)} />
            </div>
            {formData.google?.enabled && (
              <div className="grid grid-cols-1 gap-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Client ID</Label>
                  <Input
                    value={formData.google?.clientId || ""}
                    onChange={(e) => updateGoogle('clientId', e.target.value)}
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Client Secret</Label>
                  <Input
                    value={formData.google?.clientSecret || ""}
                    onChange={(e) => updateGoogle('clientSecret', e.target.value)}
                    type="password"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Facebook */}
          <div className="p-4 border border-border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">F</span>
                </div>
                <div>
                  <p className="font-medium">Facebook</p>
                  <p className="text-sm text-muted-foreground">Sign in with Facebook</p>
                </div>
              </div>
              <Switch checked={formData.facebook?.enabled} onCheckedChange={(c) => updateFacebook('enabled', c)} />
            </div>
            {formData.facebook?.enabled && (
              <div className="grid grid-cols-1 gap-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>App ID</Label>
                  <Input
                    value={formData.facebook?.appId || ""}
                    onChange={(e) => updateFacebook('appId', e.target.value)}
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label>App Secret</Label>
                  <Input
                    value={formData.facebook?.appSecret || ""}
                    onChange={(e) => updateFacebook('appSecret', e.target.value)}
                    type="password"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Apple */}
          <div className="p-4 border border-border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">A</span>
                </div>
                <div>
                  <p className="font-medium">Apple</p>
                  <p className="text-sm text-muted-foreground">Sign in with Apple</p>
                </div>
              </div>
              <Switch checked={formData.apple?.enabled} onCheckedChange={(c) => updateApple('enabled', c)} />
            </div>
            {formData.apple?.enabled && (
              <div className="grid grid-cols-1 gap-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Service ID</Label>
                  <Input
                    value={formData.apple?.serviceId || ""}
                    onChange={(e) => updateApple('serviceId', e.target.value)}
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Team ID</Label>
                  <Input
                    value={formData.apple?.teamId || ""}
                    onChange={(e) => updateApple('teamId', e.target.value)}
                    type="password"
                  />
                </div>
              </div>
            )}
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
