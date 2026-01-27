import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePaymentGatewayAsync } from "@/store/slices/settingsSlice";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { PaymentGatewaySettings } from "@/services/settingsService";

interface PaymentGatewayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: PaymentGatewaySettings;
}

export function PaymentGatewayDialog({ open, onOpenChange, initialData }: PaymentGatewayDialogProps) {
  const dispatch = useAppDispatch();
  const { actionLoading } = useAppSelector((state) => state.settings);
  const [formData, setFormData] = useState<PaymentGatewaySettings>(initialData);

  useEffect(() => {
    if (open) {
      setFormData(initialData);
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updatePaymentGatewayAsync(formData));
    if (updatePaymentGatewayAsync.fulfilled.match(result)) {
      onOpenChange(false);
    }
  };

  const updateRazorpay = (field: string, val: any) => {
    setFormData(prev => ({
      ...prev,
      razorpay: { ...prev.razorpay, [field]: val }
    }));
  };

  const updateStripe = (field: string, val: any) => {
    setFormData(prev => ({
      ...prev,
      stripe: { ...prev.stripe, [field]: val }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Payment Gateway Settings</DialogTitle>
          <DialogDescription>
            Configure Razorpay and Stripe integrations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Razorpay Section */}
          <div className="p-4 border border-border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">RZP</span>
                </div>
                <div>
                  <p className="font-medium">Razorpay</p>
                  <p className="text-sm text-muted-foreground">Accept payments via Razorpay</p>
                </div>
              </div>
              <Switch checked={formData.razorpay?.enabled} onCheckedChange={(c) => updateRazorpay('enabled', c)} />
            </div>
            {formData.razorpay?.enabled && (
              <div className="grid grid-cols-1 gap-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Key ID</Label>
                  <Input
                    value={formData.razorpay?.keyId || ""}
                    onChange={(e) => updateRazorpay('keyId', e.target.value)}
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Key Secret</Label>
                  <Input
                    value={formData.razorpay?.keySecret || ""}
                    onChange={(e) => updateRazorpay('keySecret', e.target.value)}
                    type="password"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stripe Section */}
          <div className="p-4 border border-border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">STR</span>
                </div>
                <div>
                  <p className="font-medium">Stripe</p>
                  <p className="text-sm text-muted-foreground">Accept payments via Stripe</p>
                </div>
              </div>
              <Switch checked={formData.stripe?.enabled} onCheckedChange={(c) => updateStripe('enabled', c)} />
            </div>
            {formData.stripe?.enabled && (
              <div className="grid grid-cols-1 gap-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Publishable Key</Label>
                  <Input
                    value={formData.stripe?.publishableKey || ""}
                    onChange={(e) => updateStripe('publishableKey', e.target.value)}
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <Input
                    value={formData.stripe?.secretKey || ""}
                    onChange={(e) => updateStripe('secretKey', e.target.value)}
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
