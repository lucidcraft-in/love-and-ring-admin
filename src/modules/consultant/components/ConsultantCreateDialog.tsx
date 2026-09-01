import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createConsultantAsync } from "@/store/slices/consultantSlice";
import { fetchBranchesAsync } from "@/store/slices/branchSlice";
import { toast } from "@/hooks/use-toast";

interface ConsultantCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: () => void;
}

export function ConsultantCreateDialog({ open, onOpenChange, onCreate }: ConsultantCreateDialogProps) {
  const dispatch = useAppDispatch();
  const { createLoading } = useAppSelector((state) => state.consultant);
  const { branches, listLoading: branchesLoading } = useAppSelector((state) => state.branch);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    // branch: "",
    licenseNumber: "",
    regions: "",
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return {
      minLength,
      hasUppercase,
      hasDigit,
      hasSpecial,
      isValid: minLength && hasUppercase && hasDigit && hasSpecial,
    };
  };

  const passwordValidation = validatePassword(formData.password);

  // Fetch branches when dialog opens
  useEffect(() => {
    if (open) {
      dispatch(fetchBranchesAsync({ skip: 0, take: 100 }));
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [dispatch, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordValidation.isValid) {
      toast({
        title: "Error",
        description: "Password does not meet strong password requirements.",
        variant: "destructive",
      });
      return;
    }

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
        email: "",
        fullName: "",
        phone: "",
        // branch: "",
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
                <Label>Full Name *</Label>
                <Input
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                <Label>License Number</Label>
                <Input
                  placeholder="License #"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  disabled={createLoading}
                />
              </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Password *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={createLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <Label>Confirm Password *</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    disabled={createLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {formData.password && (
                <div className="col-span-2 text-xs space-y-1 bg-muted/40 p-2.5 rounded border">
                  <p className="font-semibold text-muted-foreground mb-1">Password Requirements:</p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <div className={passwordValidation.minLength ? "text-green-600 dark:text-green-400 font-medium flex items-center gap-1" : "text-muted-foreground flex items-center gap-1"}>
                      <span>{passwordValidation.minLength ? "✓" : "○"}</span> At least 8 characters
                    </div>
                    <div className={passwordValidation.hasUppercase ? "text-green-600 dark:text-green-400 font-medium flex items-center gap-1" : "text-muted-foreground flex items-center gap-1"}>
                      <span>{passwordValidation.hasUppercase ? "✓" : "○"}</span> One uppercase letter (A-Z)
                    </div>
                    <div className={passwordValidation.hasDigit ? "text-green-600 dark:text-green-400 font-medium flex items-center gap-1" : "text-muted-foreground flex items-center gap-1"}>
                      <span>{passwordValidation.hasDigit ? "✓" : "○"}</span> One number (0-9)
                    </div>
                    <div className={passwordValidation.hasSpecial ? "text-green-600 dark:text-green-400 font-medium flex items-center gap-1" : "text-muted-foreground flex items-center gap-1"}>
                      <span>{passwordValidation.hasSpecial ? "✓" : "○"}</span> Special character (!@#$%^&*)
                    </div>
                  </div>
                </div>
              )}
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
