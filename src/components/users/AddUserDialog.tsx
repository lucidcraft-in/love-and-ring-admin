import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendEmailOtpAsync, verifyEmailOtpAsync, resetOtpState } from "@/store/slices/usersSlice";
import { Mail, KeyRound, CheckCircle2, Eye, EyeOff } from "lucide-react";

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
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    accountFor: "Self",
    fullName: "",
    mobile: "",
    alternateMobile: "",
    countryCode: "+91",
    gender: "",
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

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStep("email");
      setEmail("");
      setMobile("");
      setCountryCode("+91");
      setOtp("");
      setShowPassword(false);
      setFormData({
        password: "",
        accountFor: "Self",
        fullName: "",
        mobile: "",
        alternateMobile: "",
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
      const res = await dispatch(
        sendEmailOtpAsync({
          email,
          mobile,
          countryCode,
        })
      ).unwrap();

      // Sync mobile & countryCode to formData for creation step
      setFormData((prev) => ({
        ...prev,
        mobile: mobile || prev.mobile,
        countryCode: countryCode || prev.countryCode,
      }));

      const cleanMobile = mobile.replace(/[^0-9]/g, "");
      const isIndia =
        countryCode === "+91" ||
        countryCode === "91" ||
        cleanMobile.startsWith("91") ||
        cleanMobile.length === 10;

      const isSmsSent = mobile && isIndia;

      toast({
        title: "Success",
        description: isSmsSent
          ? "OTP sent to your email and Indian mobile number via SMS"
          : res?.message || "OTP sent to your email address",
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

    if (!passwordValidation.isValid) {
      toast({
        title: "Error",
        description: "Password does not meet strong password requirements.",
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
          alternateMobile: formData.alternateMobile,
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
            <span className={step === "email" ? "font-medium" : "text-muted-foreground"}>Email & Mobile</span>
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

        {/* Step 1: Email & Mobile Entry */}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="flex gap-2">
                <Input
                  className="w-20"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  placeholder="+91"
                  disabled={otpLoading}
                />
                <Input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter mobile number"
                  disabled={otpLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                We'll send an OTP to your email. If an Indian mobile number (+91) is provided, an SMS OTP will also be sent to that number.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification + User Details */}
        {step === "verify" && (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <p className="text-sm">
                OTP sent to <span className="font-medium">{email}</span>
                {mobile && (countryCode === "+91" || countryCode === "91" || mobile.length === 10) && (
                  <span> and SMS OTP sent to <span className="font-medium">{countryCode} {mobile}</span></span>
                )}
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
                Change details
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Create a strong password"
                    disabled={verificationLoading}
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

                {formData.password && (
                  <div className="text-xs space-y-1 mt-2 bg-muted/40 p-2.5 rounded border">
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
                    <SelectItem value="Friend">Friend</SelectItem>
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
                <Label htmlFor="alternateMobile">Alternative Mobile <span className="text-muted-foreground text-xs font-normal">(Optional)</span></Label>
                <Input
                  id="alternateMobile"
                  value={formData.alternateMobile}
                  onChange={(e) => handleInputChange("alternateMobile", e.target.value)}
                  placeholder="Alternative mobile number"
                  disabled={verificationLoading}
                />
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
                    <SelectItem value="Gay">Gay</SelectItem>
                    <SelectItem value="Lesbian">Lesbian</SelectItem>
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
