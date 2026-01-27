import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateNotificationsAsync } from "@/store/slices/settingsSlice";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { NotificationsSettings } from "@/services/settingsService";

interface NotificationSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: NotificationsSettings;
}

export function NotificationSettingsDialog({ open, onOpenChange, initialData }: NotificationSettingsDialogProps) {
  const dispatch = useAppDispatch();
  const { actionLoading } = useAppSelector((state) => state.settings);
  const [formData, setFormData] = useState<NotificationsSettings>(initialData);

  useEffect(() => {
    if (open) {
      setFormData(initialData);
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updateNotificationsAsync(formData));
    if (updateNotificationsAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  const handleToggle = (key: keyof NotificationsSettings, val: boolean) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Notification Settings</DialogTitle>
          <DialogDescription>
            Configure which notifications users receive.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email notifications to users</p>
              </div>
              <Switch checked={formData.email} onCheckedChange={(c) => handleToggle('email', c)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Send SMS notifications to users</p>
              </div>
              <Switch checked={formData.sms} onCheckedChange={(c) => handleToggle('sms', c)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Send push notifications to app users</p>
              </div>
              <Switch checked={formData.push} onCheckedChange={(c) => handleToggle('push', c)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Match Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify users about new matches</p>
              </div>
              <Switch checked={formData.matchAlerts} onCheckedChange={(c) => handleToggle('matchAlerts', c)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Profile Views</Label>
                <p className="text-sm text-muted-foreground">Notify users when someone views their profile</p>
              </div>
              <Switch checked={formData.profileViews} onCheckedChange={(c) => handleToggle('profileViews', c)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Interest Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify users when they receive interests</p>
              </div>
              <Switch checked={formData.interests} onCheckedChange={(c) => handleToggle('interests', c)} />
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