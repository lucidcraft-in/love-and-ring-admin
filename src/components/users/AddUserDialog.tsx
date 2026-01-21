import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendEmailOtpAsync, verifyEmailOtpAsync, resetOtpState } from "@/store/slices/usersSlice";
import { Mail, KeyRound, CheckCircle2 } from "lucide-react";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded?: () => void;
}

export const AddUserDialog = ({ open, onOpenChange, onUserAdded }: AddUserDialogProps) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { otpSent, otpLoading, verificationLoading, error } = useAppSelector((state) => state.users);

  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    accountFor: "Self",
    fullName: "",
    mobile: "",
    countryCode: "+91",
    gender: "",
  });

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStep("email");
      setEmail("");
      setOtp("");
      setFormData({
        password: "",
        accountFor: "Self",
        fullName: "",
        mobile: "",
        countryCode: "+91",
        gender: "",
      });
      dispatch(resetOtpState());
    }
  }, [open, dispatch]);

  // Move to verification step when OTP is sent
  useEffect(() => {
    if (otpSent) {
      setStep("verify");
    }
  }, [otpSent]);

  const handleSendOtp = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(sendEmailOtpAsync({ email })).unwrap();
      toast({
        title: "Success",
        description: "OTP sent to your email address",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err || "Failed to send OTP",
        variant: "destructive",
      });
    }
  };

  const handleVerifyAndCreate = async () => {
    if (!otp || !formData.password) {
      toast({
        title: "Error",
        description: "OTP and password are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(
        verifyEmailOtpAsync({
          email,
          otp,
          password: formData.password,
          accountFor: formData.accountFor,
          fullName: formData.fullName,
          mobile: formData.mobile,
          countryCode: formData.countryCode,
          gender: formData.gender,
        })
      ).unwrap();

      toast({
        title: "Success",
        description: "User created successfully",
      });

      onUserAdded?.();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err || "Failed to verify OTP and create user",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "email" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
            >
              {otpSent ? <CheckCircle2 className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
            </div>
            <span className={step === "email" ? "font-medium" : "text-muted-foreground"}>Email</span>
          </div>
          <div className="w-12 h-0.5 bg-border"></div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "verify" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
            >
              <KeyRound className="w-4 h-4" />
            </div>
            <span className={step === "verify" ? "font-medium" : "text-muted-foreground"}>Verify & Create</span>
          </div>
        </div>

        {/* Step 1: Email Entry */}
        {step === "email" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                disabled={otpLoading}
              />
              <p className="text-sm text-muted-foreground">We'll send a verification code to this email</p>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification + User Details */}
        {step === "verify" && (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <p className="text-sm">
                OTP sent to <span className="font-medium">{email}</span>
              </p>
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto"
                onClick={() => {
                  setStep("email");
                  dispatch(resetOtpState());
                }}
              >
                Change email
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="otp">Verification Code *</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  disabled={verificationLoading}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Minimum 6 characters"
                  disabled={verificationLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountFor">Account For</Label>
                <Select
                  value={formData.accountFor}
                  onValueChange={(val) => handleInputChange("accountFor", val)}
                  disabled={verificationLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Self">Self</SelectItem>
                    <SelectItem value="Son">Son</SelectItem>
                    <SelectItem value="Daughter">Daughter</SelectItem>
                    <SelectItem value="Brother">Brother</SelectItem>
                    <SelectItem value="Sister">Sister</SelectItem>
                    <SelectItem value="Relative">Relative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter full name"
                  disabled={verificationLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="flex gap-2">
                  <Input
                    className="w-20"
                    value={formData.countryCode}
                    onChange={(e) => handleInputChange("countryCode", e.target.value)}
                    disabled={verificationLoading}
                  />
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    placeholder="Mobile number"
                    disabled={verificationLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(val) => handleInputChange("gender", val)}
                  disabled={verificationLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={otpLoading || verificationLoading}>
            Cancel
          </Button>
          {step === "email" ? (
            <Button onClick={handleSendOtp} disabled={otpLoading}>
              {otpLoading ? "Sending..." : "Send OTP"}
            </Button>
          ) : (
            <Button onClick={handleVerifyAndCreate} disabled={verificationLoading}>
              {verificationLoading ? "Creating..." : "Verify & Create User"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
