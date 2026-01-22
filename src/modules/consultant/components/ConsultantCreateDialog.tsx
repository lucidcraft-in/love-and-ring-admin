import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createConsultantAsync } from "@/store/slices/consultantSlice";
import { toast } from "@/hooks/use-toast";

interface ConsultantCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: () => void;
}

export function ConsultantCreateDialog({ open, onOpenChange, onCreate }: ConsultantCreateDialogProps) {
  const dispatch = useAppDispatch();
  const { createLoading } = useAppSelector((state) => state.consultant);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
    agencyName: "",
    licenseNumber: "",
    regions: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(createConsultantAsync(formData)).unwrap();

      toast({
        title: "Consultant Created",
        description: "Notification email sent to the consultant.",
      });

      // Reset form
      setFormData({
        username: "",
        email: "",
        fullName: "",
        phone: "",
        agencyName: "",
        licenseNumber: "",
        regions: "",
        password: "",
        confirmPassword: "",
      });

      onCreate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to create consultant",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Consultant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Username *</Label>
                <Input
                  placeholder="broker_name"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={createLoading}
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="email@agency.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={createLoading}
                />
              </div>
            </div>
            <div>
              <Label>Full Name *</Label>
              <Input
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={createLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  placeholder="+91..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={createLoading}
                />
              </div>
              <div>
                <Label>Agency Name</Label>
                <Input
                  placeholder="Agency"
                  value={formData.agencyName}
                  onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                  disabled={createLoading}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>License Number</Label>
                <Input
                  placeholder="License #"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  disabled={createLoading}
                />
              </div>
              <div>
                <Label>Regions (comma-separated)</Label>
                <Input
                  placeholder="Mumbai, Delhi, Bangalore"
                  value={formData.regions}
                  onChange={(e) => setFormData({ ...formData, regions: e.target.value })}
                  disabled={createLoading}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Password *</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  disabled={createLoading}
                />
              </div>
              <div>
                <Label>Confirm Password *</Label>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  disabled={createLoading}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createLoading}>
              {createLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
