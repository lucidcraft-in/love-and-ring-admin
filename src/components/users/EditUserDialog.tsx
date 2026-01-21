import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import Axios from "../../axios/axios";
import { useToast } from "@/hooks/use-toast";

interface User {
  _id: string;
  accountFor?: string;
  fullName?: string;
  email: string;
  countryCode?: string;
  mobile?: string;
  gender?: string;
  dateOfBirth?: string;
  preferredLanguage?: string;
  heightCm?: number;
  weightKg?: number;
  maritalStatus?: string;
  bodyType?: string;
  physicallyChallenged?: boolean;
  livingWithFamily?: boolean;
  course?: string;
  highestEducation?: string;
  profession?: string;
  income?: {
    amount?: number;
    type?: string;
  };
  interests?: string[];
  personalityTraits?: string[];
  dietPreference?: string[];
  city?: string;
  religion?: string;
  caste?: string;
  motherTongue?: string;
  approvalStatus?: string;
  branch?: string;
  referredBy?: string;
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onUserUpdated?: () => void;
}

export const EditUserDialog = ({ open, onOpenChange, user, onUserUpdated }: EditUserDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");

  const [formData, setFormData] = useState({
    accountFor: "",
    fullName: "",
    email: "",
    countryCode: "+91",
    mobile: "",
    gender: "",
    dateOfBirth: "",
    preferredLanguage: "English",
    heightCm: "",
    weightKg: "",
    maritalStatus: "",
    bodyType: "",
    physicallyChallenged: false,
    livingWithFamily: false,
    course: "",
    highestEducation: "",
    profession: "",
    incomeAmount: "",
    incomeType: "Yearly",
    interests: "",
    personalityTraits: "",
    dietPreference: "",
    city: "",
    religion: "",
    caste: "",
    motherTongue: "",
    approvalStatus: "PENDING",
    branch: "",
    referredBy: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        accountFor: user.accountFor || "",
        fullName: user.fullName || "",
        email: user.email || "",
        countryCode: user.countryCode || "+91",
        mobile: user.mobile || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        preferredLanguage: user.preferredLanguage || "English",
        heightCm: user.heightCm?.toString() || "",
        weightKg: user.weightKg?.toString() || "",
        maritalStatus: user.maritalStatus || "",
        bodyType: user.bodyType || "",
        physicallyChallenged: user.physicallyChallenged || false,
        livingWithFamily: user.livingWithFamily || false,
        course: user.course || "",
        highestEducation: user.highestEducation || "",
        profession: user.profession || "",
        incomeAmount: user.income?.amount?.toString() || "",
        incomeType: user.income?.type || "Yearly",
        interests: user.interests?.join(", ") || "",
        personalityTraits: user.personalityTraits?.join(", ") || "",
        dietPreference: user.dietPreference?.join(", ") || "",
        city: user.city || "",
        religion: user.religion || "",
        caste: user.caste || "",
        motherTongue: user.motherTongue || "",
        approvalStatus: user.approvalStatus || "PENDING",
        branch: user.branch || "",
        referredBy: user.referredBy || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const userData = {
        accountFor: formData.accountFor,
        fullName: formData.fullName,
        email: formData.email,
        countryCode: formData.countryCode,
        mobile: formData.mobile,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        preferredLanguage: formData.preferredLanguage,
        heightCm: formData.heightCm ? Number(formData.heightCm) : undefined,
        weightKg: formData.weightKg ? Number(formData.weightKg) : undefined,
        maritalStatus: formData.maritalStatus,
        bodyType: formData.bodyType,
        physicallyChallenged: formData.physicallyChallenged,
        livingWithFamily: formData.livingWithFamily,
        course: formData.course,
        highestEducation: formData.highestEducation || undefined,
        profession: formData.profession || undefined,
        income: formData.incomeAmount
          ? {
            amount: Number(formData.incomeAmount),
            type: formData.incomeType,
          }
          : undefined,
        interests: formData.interests ? formData.interests.split(",").map((i) => i.trim()) : [],
        personalityTraits: formData.personalityTraits
          ? formData.personalityTraits.split(",").map((p) => p.trim())
          : [],
        dietPreference: formData.dietPreference
          ? formData.dietPreference.split(",").map((d) => d.trim())
          : [],
        city: formData.city || undefined,
        religion: formData.religion || undefined,
        caste: formData.caste || undefined,
        motherTongue: formData.motherTongue || undefined,
        approvalStatus: formData.approvalStatus,
        branch: formData.branch || undefined,
        referredBy: formData.referredBy || undefined,
      };

      await Axios.put(`/api/users/${user._id}`, userData);

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      onUserUpdated?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User - {user.fullName || user.email}</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          {/* STEP 1: BASIC DETAILS */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountFor">Account For</Label>
                <Select value={formData.accountFor} onValueChange={(val) => handleInputChange("accountFor", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <div className="flex gap-2">
                  <Input
                    className="w-20"
                    value={formData.countryCode}
                    onChange={(e) => handleInputChange("countryCode", e.target.value)}
                  />
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(val) => handleInputChange("gender", val)}>
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

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Input
                  id="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={(e) => handleInputChange("preferredLanguage", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* STEP 2-3: PERSONAL DETAILS */}
          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heightCm">Height (cm)</Label>
                <Input
                  id="heightCm"
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => handleInputChange("heightCm", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightKg">Weight (kg)</Label>
                <Input
                  id="weightKg"
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => handleInputChange("weightKg", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select value={formData.maritalStatus} onValueChange={(val) => handleInputChange("maritalStatus", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyType">Body Type</Label>
                <Select value={formData.bodyType} onValueChange={(val) => handleInputChange("bodyType", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Slim">Slim</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                    <SelectItem value="Athletic">Athletic</SelectItem>
                    <SelectItem value="Heavy">Heavy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="physicallyChallenged"
                  checked={formData.physicallyChallenged}
                  onCheckedChange={(checked) => handleInputChange("physicallyChallenged", checked)}
                />
                <Label htmlFor="physicallyChallenged">Physically Challenged</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="livingWithFamily"
                  checked={formData.livingWithFamily}
                  onCheckedChange={(checked) => handleInputChange("livingWithFamily", checked)}
                />
                <Label htmlFor="livingWithFamily">Living With Family</Label>
              </div>
            </div>
          </TabsContent>

          {/* STEP 4: EDUCATION & WORK */}
          <TabsContent value="education" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="highestEducation">Highest Education (ID)</Label>
                <Input
                  id="highestEducation"
                  value={formData.highestEducation}
                  onChange={(e) => handleInputChange("highestEducation", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession (ID)</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleInputChange("profession", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incomeAmount">Income Amount</Label>
                <Input
                  id="incomeAmount"
                  type="number"
                  value={formData.incomeAmount}
                  onChange={(e) => handleInputChange("incomeAmount", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incomeType">Income Type</Label>
                <Select value={formData.incomeType} onValueChange={(val) => handleInputChange("incomeType", val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* STEP 5: ADDITIONAL DETAILS */}
          <TabsContent value="additional" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="interests">Interests (comma-separated)</Label>
                <Textarea
                  id="interests"
                  value={formData.interests}
                  onChange={(e) => handleInputChange("interests", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personalityTraits">Personality Traits (comma-separated)</Label>
                <Textarea
                  id="personalityTraits"
                  value={formData.personalityTraits}
                  onChange={(e) => handleInputChange("personalityTraits", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietPreference">Diet Preference (comma-separated)</Label>
                <Input
                  id="dietPreference"
                  value={formData.dietPreference}
                  onChange={(e) => handleInputChange("dietPreference", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City (ID)</Label>
                  <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="religion">Religion (ID)</Label>
                  <Input
                    id="religion"
                    value={formData.religion}
                    onChange={(e) => handleInputChange("religion", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caste">Caste (ID)</Label>
                  <Input id="caste" value={formData.caste} onChange={(e) => handleInputChange("caste", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherTongue">Mother Tongue (ID)</Label>
                  <Input
                    id="motherTongue"
                    value={formData.motherTongue}
                    onChange={(e) => handleInputChange("motherTongue", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approvalStatus">Approval Status</Label>
                  <Select
                    value={formData.approvalStatus}
                    onValueChange={(val) => handleInputChange("approvalStatus", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch">Branch (ID)</Label>
                  <Input id="branch" value={formData.branch} onChange={(e) => handleInputChange("branch", e.target.value)} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
