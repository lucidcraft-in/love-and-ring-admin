import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Trash2, Star, X, Camera } from "lucide-react";
import Axios from "../../axios/axios";
import { masterDataService } from "@/services/masterDataService";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMasterDataAsync,
} from "@/store/slices/masterDataSlice";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getFriendlyActionName, getFriendlyDetails, getStepInfo } from "@/utils/activityLogUtils";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface User {
  photos?: {
    url: string;
    isPrimary: boolean;
    _id?: string;
  }[];
  _id: string;
  accountFor?: string;
  fullName?: string;
  email: string;
  countryCode?: string;
  mobile?: string;
  alternateMobile?: string;
  gender?: string;
  dateOfBirth?: string;
  preferredLanguage?: string;
  heightCm?: number;
  weightKg?: number;
  maritalStatus?: string;
  bodyType?: string;
  physicallyChallenged?: boolean;
  livingWithFamily?: boolean;
  // course?: string;
  primaryEducation?: any;
  highestEducation?: any;
  profession?: any;
  income?: {
    amount?: number;
    type?: string;
  };
  interests?: string[];
  personalityTraits?: string[];
  dietPreference?: string[];
  city?: any;
  religion?: any;
  caste?: any;
  motherTongue?: any;
  approvalStatus?: string;
  // branch?: string;
  referredBy?: string;
  address?: string;
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onUserUpdated?: () => void;
}

export const EditUserDialog = ({ open, onOpenChange, user, onUserUpdated }: EditUserDialogProps) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  // const { religions, castes, locations, languages, educations, occupations } = useAppSelector((state) => state.masterData); // This selector likely doesn't exist anymore for all at once.

  const [religions, setReligions] = useState<any[]>([]);
  const [castes, setCastes] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [primaryEducations, setPrimaryEducations] = useState<any[]>([]);
  const [higherEducations, setHigherEducations] = useState<any[]>([]);
  const [occupations, setOccupations] = useState<any[]>([]);
  const [masterInterests, setMasterInterests] = useState<any[]>([]);

  // We can import masterDataService
  // console.log("educations", educations);
  console.log("occupations", occupations);
  console.log("locations", locations);
  console.log("languages", languages);
  console.log("castes", castes);
  console.log("religions", religions);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    accountFor: "",
    fullName: "",
    email: "",
    countryCode: "+91",
    mobile: "",
    alternateMobile: "",
    gender: "",
    dateOfBirth: "",
    preferredLanguage: "English",
    heightCm: "",
    weightKg: "",
    maritalStatus: "",
    bodyType: "",
    physicallyChallenged: false,
    livingWithFamily: false,
    // course: "",
    primaryEducation: "",
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
    // branch: "",
    referredBy: "",
    address: "",
  });

  const filteredCastes = formData.religion
    ? castes.filter((caste) => {
      const casteReligionId = typeof caste.religion === "object" ? caste.religion?._id : caste.religion;
      return casteReligionId === formData.religion;
    })
    : castes;

  const [photos, setPhotos] = useState<any[]>([]);

  // Fetch master data when dialog opens
  useEffect(() => {
    if (open) {
      // Fetch all needed dropdown data
      const fetchData = async () => {
        try {
          const [r, c, l, lang, pe, he, o, intr] = await Promise.all([
            masterDataService.getSimpleList('religions'),
            masterDataService.getSimpleList('castes'),
            masterDataService.getSimpleList('locations'),
            masterDataService.getSimpleList('languages'),
            masterDataService.getSimpleList('primaryEducations'),
            masterDataService.getSimpleList('higherEducations'),
            masterDataService.getSimpleList('occupations'),
            masterDataService.getSimpleList('interests'),
          ]);

          setReligions(r.data);
          setCastes(c.data);
          setLocations(l.data);
          setLanguages(lang.data);
          setPrimaryEducations(pe.data);
          setHigherEducations(he.data);
          setOccupations(o.data);
          setMasterInterests(intr.data);
        } catch (err) {
          console.error("Failed to fetch dropdown data", err);
        }
      };
      fetchData();
    }
  }, [open]);

  // Helper function to extract ID from object or string
  const extractId = (field: any): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object" && field._id) return field._id;
    return "";
  };

  // Helper function to extract city text from object or string
  const extractCityText = (field: any): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object") {
      if (field.city) {
        return [field.city, field.state, field.country].filter(Boolean).join(", ");
      }
      if (field.name) return field.name;
    }
    return "";
  };

  const [userActivityLogs, setUserActivityLogs] = useState<any[]>([]);
  const [loadingActivityLogs, setLoadingActivityLogs] = useState(false);

  useEffect(() => {
    if (user?.email && open) {
      const fetchUserLogs = async () => {
        setLoadingActivityLogs(true);
        try {
          const token = localStorage.getItem("token");
          const res = await Axios.get("/api/admin/activity-logs", {
            headers: { Authorization: `Bearer ${token}` },
            params: { userEmail: user.email, limit: 50 },
          });
          if (res.data?.logs) {
            setUserActivityLogs(res.data.logs);
          }
        } catch (err) {
          console.error("Failed to load user activity logs:", err);
        } finally {
          setLoadingActivityLogs(false);
        }
      };
      fetchUserLogs();
    }
  }, [user?.email, open]);

  const [isCustomProfession, setIsCustomProfession] = useState(false);
  const [customProfessionName, setCustomProfessionName] = useState("");
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);

  useEffect(() => {
    if (user && open) {
      const draftKey = `admin_edit_user_draft_${user._id}`;
      const savedDraft = localStorage.getItem(draftKey);
      let loadedFromDraft = false;

      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.formData) {
            setFormData(draft.formData);
            if (draft.isCustomProfession !== undefined) setIsCustomProfession(draft.isCustomProfession);
            if (draft.customProfessionName) setCustomProfessionName(draft.customProfessionName);
            loadedFromDraft = true;
          }
        } catch (e) {
          console.error("Failed to parse edit user draft", e);
        }
      }

      if (!loadedFromDraft) {
        const profId = extractId(user.profession);
        const profName = typeof user.profession === "string"
          ? user.profession
          : (typeof user.profession === "object" ? user.profession?.name : "");

        const matchingOcc = occupations.find(
          (o) => o._id === profId || (profName && o.name.toLowerCase() === profName.toLowerCase())
        );

        let initialProf = "";
        if (matchingOcc) {
          initialProf = matchingOcc._id;
          setIsCustomProfession(false);
          setCustomProfessionName("");
        } else if (profName || profId) {
          initialProf = profName || profId;
          setIsCustomProfession(true);
          setCustomProfessionName(profName || profId);
        } else {
          initialProf = "";
          setIsCustomProfession(false);
          setCustomProfessionName("");
        }

        setFormData({
          accountFor: user.accountFor || "",
          fullName: user.fullName || "",
          email: user.email || "",
          countryCode: user.countryCode || "+91",
          mobile: user.mobile || "",
          alternateMobile: user.alternateMobile || "",
          gender: user.gender || "",
          dateOfBirth: user.dateOfBirth
            ? (typeof user.dateOfBirth === "string" ? user.dateOfBirth.split("T")[0] : new Date(user.dateOfBirth).toISOString().split("T")[0])
            : "",
          preferredLanguage: user.preferredLanguage || "English",
          heightCm: user.heightCm?.toString() || "",
          weightKg: user.weightKg?.toString() || "",
          maritalStatus: user.maritalStatus || "",
          bodyType: user.bodyType || "",
          physicallyChallenged: user.physicallyChallenged || false,
          livingWithFamily: user.livingWithFamily || false,
          primaryEducation: extractId(user.primaryEducation),
          profession: initialProf,
          incomeAmount: user.income?.amount?.toString() || "",
          incomeType: user.income?.type || "Yearly",
          interests: user.interests?.join(", ") || "",
          personalityTraits: user.personalityTraits?.join(", ") || "",
          dietPreference: user.dietPreference?.join(", ") || "",
          city: extractCityText(user.city),
          religion: extractId(user.religion),
          caste: extractId(user.caste),
          motherTongue: extractId(user.motherTongue),
          approvalStatus: user.approvalStatus || "PENDING",
          referredBy: extractId(user.referredBy),
          address: user.address || "",
        });
      }

      setPhotos(user.photos || []);
      setSelectedPhotoFile(null);
      setPhotoPreviewUrl(null);
      setIsPhotoRemoved(false);
      setShowConfirmModal(false);
    }
  }, [user, open, occupations]);

  // Save edit draft to localStorage on form changes
  useEffect(() => {
    if (open && user?._id) {
      const draftKey = `admin_edit_user_draft_${user._id}`;
      const draft = { formData, isCustomProfession, customProfessionName };
      localStorage.setItem(draftKey, JSON.stringify(draft));
    }
  }, [open, user?._id, formData, isCustomProfession, customProfessionName]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user?._id) return;

    if (!formData.accountFor || !formData.fullName || !formData.email || !formData.mobile || !formData.gender || !formData.dateOfBirth) {
      setCurrentTab("basic");
      toast({
        title: "Validation Error",
        description: "Please complete all required fields in the Basic tab (*).",
        variant: "destructive",
      });
      return;
    }

    if (!formData.maritalStatus || !formData.heightCm || !formData.weightKg) {
      setCurrentTab("personal");
      toast({
        title: "Validation Error",
        description: "Marital Status, Height, and Weight are required in the Personal tab (*).",
        variant: "destructive",
      });
      return;
    }

    if (!formData.primaryEducation || !formData.profession) {
      setCurrentTab("education");
      toast({
        title: "Validation Error",
        description: "Qualification Level and Profession are required in the Education tab (*).",
        variant: "destructive",
      });
      return;
    }

    if (!formData.city || !formData.religion || !formData.motherTongue) {
      setCurrentTab("additional");
      toast({
        title: "Validation Error",
        description: "City, Religion, and Mother Tongue are required in the Additional tab (*).",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const selectedRelObj = religions.find((r) => r._id === formData.religion || r.name === formData.religion);
      const isFreeThinker = selectedRelObj?.name?.toLowerCase() === "free thinker";
      const casteVal = (isFreeThinker || !formData.caste) ? null : formData.caste;
      const professionVal = isCustomProfession ? (customProfessionName || formData.profession) : formData.profession;

      const userData = {
        accountFor: formData.accountFor,
        fullName: formData.fullName,
        email: formData.email,
        countryCode: formData.countryCode,
        mobile: formData.mobile,
        alternateMobile: formData.alternateMobile,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        preferredLanguage: formData.preferredLanguage,
        heightCm: formData.heightCm ? Number(formData.heightCm) : undefined,
        weightKg: formData.weightKg ? Number(formData.weightKg) : undefined,
        maritalStatus: formData.maritalStatus,
        bodyType: formData.bodyType,
        physicallyChallenged: formData.physicallyChallenged,
        livingWithFamily: formData.livingWithFamily,
        primaryEducation: formData.primaryEducation || undefined,
        profession: professionVal || undefined,
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
        caste: casteVal,
        motherTongue: formData.motherTongue || undefined,
        approvalStatus: formData.approvalStatus,
        referredBy: formData.referredBy || undefined,
        address: formData.address || undefined,
      };

      await Axios.put(`/api/users/${user._id}`, userData);

      // Process deferred photo delete if photo was marked for removal
      if (isPhotoRemoved && photos.length > 0) {
        for (const photo of photos) {
          if (photo._id) {
            try {
              await userService.deleteUserPhoto(user._id, photo._id);
            } catch (err) {
              console.error("Failed to delete existing photo", err);
            }
          }
        }
      }

      // Process deferred photo upload if new photo file was selected
      if (selectedPhotoFile) {
        if (photos.length > 0 && !isPhotoRemoved) {
          for (const photo of photos) {
            if (photo._id) {
              try {
                await userService.deleteUserPhoto(user._id, photo._id);
              } catch (err) {
                console.error("Failed to delete old photo before upload", err);
              }
            }
          }
        }
        const photoFormData = new FormData();
        photoFormData.append("photos", selectedPhotoFile);
        await userService.uploadUserPhotos(user._id, photoFormData);
      }

      // Clear draft on successful save
      localStorage.removeItem(`admin_edit_user_draft_${user._id}`);

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      setShowConfirmModal(false);
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    setSelectedPhotoFile(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
    setIsPhotoRemoved(false);
  };

  const handleDeletePhoto = () => {
    setSelectedPhotoFile(null);
    setPhotoPreviewUrl(null);
    setIsPhotoRemoved(true);
  };

  if (!user) return null;

  const currentPhotoUrl = (!isPhotoRemoved && (photoPreviewUrl || photos?.[0]?.url)) || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User - {user.fullName || user.email}</DialogTitle>
        </DialogHeader>

        {/* Profile Photo Quick Banner */}
        <div className="flex items-center gap-4 p-3 bg-muted/40 rounded-lg border border-border/50">
          <Avatar className="w-16 h-16 border-2 border-primary/20 shadow-sm">
            <AvatarImage src={currentPhotoUrl} alt={user.fullName || user.email} />
            <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
              {(user.fullName || user.email || "?").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{formData.fullName || user.fullName || "User Profile"}</h4>
            <p className="text-xs text-muted-foreground">{formData.email || user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="relative inline-block">
                <Button size="sm" variant="outline" className="h-8 text-xs relative cursor-pointer" disabled={uploading}>
                  <Camera className="w-3.5 h-3.5 mr-1.5" />
                  {uploading ? "Uploading..." : photos.length > 0 ? "Change Profile Photo" : "Upload Profile Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                </Button>
              </div>
              {(!isPhotoRemoved && (photoPreviewUrl || photos.length > 0)) && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeletePhoto()}
                  disabled={uploading}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Remove Photo
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
            {/* <TabsTrigger value="activity">Activity History</TabsTrigger> */}
          </TabsList>

          {/* STEP 1: BASIC DETAILS */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountFor">Account For <span className="text-red-500">*</span></Label>
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
                    <SelectItem value="Friend">Friend</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile <span className="text-red-500">*</span></Label>
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
                <Label htmlFor="alternateMobile">Alternative Mobile <span className="text-muted-foreground text-xs font-normal">(Optional)</span></Label>
                <Input
                  id="alternateMobile"
                  placeholder="Alternative Mobile Number"
                  value={formData.alternateMobile}
                  onChange={(e) => handleInputChange("alternateMobile", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
                <Select value={formData.gender} onValueChange={(val) => handleInputChange("gender", val)}>
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

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
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

              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </TabsContent>

          {/* STEP 2-3: PERSONAL DETAILS */}
          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heightCm">Height (cm) <span className="text-red-500">*</span></Label>
                <Input
                  id="heightCm"
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => handleInputChange("heightCm", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightKg">Weight (kg) <span className="text-red-500">*</span></Label>
                <Input
                  id="weightKg"
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => handleInputChange("weightKg", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status <span className="text-red-500">*</span></Label>
                <Select value={formData.maritalStatus} onValueChange={(val) => handleInputChange("maritalStatus", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Awaiting Divorce">Awaiting Divorce</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Annulled">Annulled</SelectItem>
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
              {/* <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                />
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="primaryEducation">Qualification Level <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.primaryEducation}
                  onValueChange={(val) => {
                    handleInputChange("primaryEducation", val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select qualification level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(primaryEducations) &&
                      primaryEducations.map((education) => (
                        <SelectItem key={education._id} value={education._id}>
                          {education.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession <span className="text-red-500">*</span></Label>
                <SearchableSelect
                  options={occupations}
                  value={isCustomProfession ? "OTHER" : formData.profession}
                  onValueChange={(val) => {
                    if (val === "OTHER") {
                      setIsCustomProfession(true);
                      handleInputChange("profession", customProfessionName);
                    } else {
                      setIsCustomProfession(false);
                      handleInputChange("profession", val);
                    }
                  }}
                  placeholder="Select profession..."
                  searchPlaceholder="Search profession..."
                  allowCustom={true}
                  customLabel="+ Add Custom Profession"
                  isCustomSelected={isCustomProfession}
                  onCustomSelect={() => {
                    setIsCustomProfession(true);
                    handleInputChange("profession", customProfessionName);
                  }}
                />
                {isCustomProfession && (
                  <div className="pt-2">
                    <Label className="text-xs text-muted-foreground mb-1 block">Specify Custom Profession <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="Type your profession name..."
                      value={customProfessionName}
                      onChange={(e) => {
                        setCustomProfessionName(e.target.value);
                        handleInputChange("profession", e.target.value);
                      }}
                      className="h-10 text-sm"
                    />
                  </div>
                )}
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
                <Label htmlFor="interests">Interests</Label>
                {masterInterests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {masterInterests.map((item) => {
                      const currentSelected = formData.interests
                        ? formData.interests.split(",").map((s) => s.trim().toLowerCase())
                        : [];
                      const isSelected = currentSelected.includes(item.name.toLowerCase());

                      const toggleInterest = () => {
                        let list = formData.interests
                          ? formData.interests.split(",").map((s) => s.trim()).filter(Boolean)
                          : [];
                        if (isSelected) {
                          list = list.filter((i) => i.toLowerCase() !== item.name.toLowerCase());
                        } else {
                          list.push(item.name);
                        }
                        handleInputChange("interests", list.join(", "));
                      };

                      return (
                        <button
                          key={item._id}
                          type="button"
                          onClick={toggleInterest}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-xs font-medium"
                              : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          <span>{item.name}</span>
                          {isSelected && <span className="ml-0.5 text-[10px]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
                <Textarea
                  id="interests"
                  placeholder="Enter or select interests above (comma-separated)"
                  value={formData.interests}
                  onChange={(e) => handleInputChange("interests", e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>User Photos</Label>
              {(!isPhotoRemoved && (photoPreviewUrl || photos.length > 0)) ? (
                <div className="relative group aspect-square rounded-lg overflow-hidden border bg-muted w-full max-w-xs mx-auto">
                  <img
                    src={photoPreviewUrl || photos[0]?.url}
                    alt="User photo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto();
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handlePhotoUpload}
                      />
                    </div>
                  </div>
                  {(!photoPreviewUrl && photos[0]?.isPrimary) && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Primary
                    </div>
                  )}
                  {photoPreviewUrl && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                      New Photo (Unsaved)
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative w-full max-w-xs mx-auto">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handlePhotoUpload}
                  />
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-xs font-medium text-center px-2">
                    Click to select photo (saves when you click Update User)
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Personality Traits</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "friendly", name: "Friendly", icon: "😊" },
                  { id: "ambitious", name: "Ambitious", icon: "🎯" },
                  { id: "creative", name: "Creative", icon: "💡" },
                  { id: "honest", name: "Honest", icon: "✨" },
                  { id: "caring", name: "Caring", icon: "❤️" },
                  { id: "funny", name: "Funny", icon: "😄" },
                  { id: "intelligent", name: "Intelligent", icon: "🧠" },
                  { id: "patient", name: "Patient", icon: "🕊️" },
                ].map((trait) => {
                  const currentSelected = formData.personalityTraits
                    ? formData.personalityTraits.split(",").map((s) => s.trim().toLowerCase())
                    : [];
                  const isSelected = currentSelected.includes(trait.name.toLowerCase()) || currentSelected.includes(trait.id.toLowerCase());

                  const toggleTrait = () => {
                    let list = formData.personalityTraits
                      ? formData.personalityTraits.split(",").map((s) => s.trim()).filter(Boolean)
                      : [];
                    const foundIndex = list.findIndex(
                      (item) => item.toLowerCase() === trait.name.toLowerCase() || item.toLowerCase() === trait.id.toLowerCase()
                    );
                    if (foundIndex !== -1) {
                      list.splice(foundIndex, 1);
                    } else {
                      list.push(trait.name);
                    }
                    handleInputChange("personalityTraits", list.join(", "));
                  };

                  return (
                    <button
                      key={trait.id}
                      type="button"
                      onClick={toggleTrait}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary font-medium shadow-xs"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      <span>{trait.icon}</span>
                      <span>{trait.name}</span>
                      {isSelected && <span className="ml-0.5 text-[10px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Diet Preference</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "veg", name: "Vegetarian", icon: "🥗" },
                  { id: "non-veg", name: "Non-Veg", icon: "🍗" },
                  { id: "vegan", name: "Vegan", icon: "🌱" },
                  { id: "eggetarian", name: "Eggetarian", icon: "🥚" },
                  { id: "jain", name: "Jain", icon: "🙏" },
                ].map((diet) => {
                  const currentSelected = formData.dietPreference
                    ? formData.dietPreference.split(",").map((s) => s.trim().toLowerCase())
                    : [];
                  const isSelected = currentSelected.includes(diet.name.toLowerCase()) || currentSelected.includes(diet.id.toLowerCase());

                  const toggleDiet = () => {
                    let list = formData.dietPreference
                      ? formData.dietPreference.split(",").map((s) => s.trim()).filter(Boolean)
                      : [];
                    const foundIndex = list.findIndex(
                      (item) => item.toLowerCase() === diet.name.toLowerCase() || item.toLowerCase() === diet.id.toLowerCase()
                    );
                    if (foundIndex !== -1) {
                      list.splice(foundIndex, 1);
                    } else {
                      list.push(diet.name);
                    }
                    handleInputChange("dietPreference", list.join(", "));
                  };

                  return (
                    <button
                      key={diet.id}
                      type="button"
                      onClick={toggleDiet}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary font-medium shadow-xs"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      <span>{diet.icon}</span>
                      <span>{diet.name}</span>
                      {isSelected && <span className="ml-0.5 text-[10px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Input
                  id="city"
                  placeholder="Enter city name..."
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="religion">Religion <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.religion}
                  onValueChange={(val) => {
                    handleInputChange("religion", val);
                    const selectedRelObj = religions.find((r) => r._id === val || r.name === val);
                    if (selectedRelObj?.name?.toLowerCase() === "free thinker") {
                      handleInputChange("caste", "");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select religion" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(religions) &&
                      religions.map((religion) => (
                        <SelectItem key={religion._id} value={religion._id}>
                          {religion.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caste">Caste</Label>
                <Select
                  value={formData.caste}
                  onValueChange={(val) => handleInputChange("caste", val)}
                  disabled={(() => {
                    const selectedRelObj = religions.find((r) => r._id === formData.religion || r.name === formData.religion);
                    return selectedRelObj?.name?.toLowerCase() === "free thinker";
                  })()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      (() => {
                        const selectedRelObj = religions.find((r) => r._id === formData.religion || r.name === formData.religion);
                        return selectedRelObj?.name?.toLowerCase() === "free thinker" ? "N/A (Free Thinker)" : "Select caste";
                      })()
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(filteredCastes) &&
                      filteredCastes.map((caste) => (
                        <SelectItem key={caste._id} value={caste._id}>
                          {caste.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherTongue">Mother Tongue <span className="text-red-500">*</span></Label>
                <Select value={formData.motherTongue} onValueChange={(val) => handleInputChange("motherTongue", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(languages) &&
                      languages.map((language) => (
                        <SelectItem key={language._id} value={language._id}>
                          {language.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approvalStatus">Account / Approval Status</Label>
                <Select
                  value={formData.approvalStatus}
                  onValueChange={(val) => handleInputChange("approvalStatus", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPROVED">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    {/* <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                  <Label htmlFor="branch">Branch (ID)</Label>
                  <Input id="branch" value={formData.branch} onChange={(e) => handleInputChange("branch", e.target.value)} />
                </div> */}
            </div>
          </TabsContent>

          {/* STEP 5: ACTIVITY HISTORY */}
          {/* <TabsContent value="activity" className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">User Registration & Event Log History</h4>
              {loadingActivityLogs ? (
                <div className="text-center py-6 text-xs text-muted-foreground">Loading activity history...</div>
              ) : userActivityLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground border rounded-lg p-4 bg-muted/20">
                  No activity logs recorded for this user yet.
                </div>
              ) : (
                <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1">
                  {userActivityLogs.map((log: any) => {
                    const stepInfo = getStepInfo(log.step);
                    const friendlyAction = getFriendlyActionName(log.action, log.step);
                    const friendlyDetails = getFriendlyDetails(log);

                    return (
                      <div
                        key={log._id}
                        className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                          log.status === "ERROR"
                            ? "bg-rose-500/5 border-rose-500/30"
                            : log.status === "SUCCESS"
                            ? "bg-emerald-500/5 border-emerald-500/30"
                            : "bg-muted/30 border-border/50"
                        }`}
                      >
                        <div className="flex items-center justify-between font-medium">
                          <span className="font-semibold text-foreground">{friendlyAction}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {log.step && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${stepInfo.color}`}>
                              {stepInfo.shortName}
                            </span>
                          )}
                          <span
                            className={`font-semibold text-[10px] ${
                              log.status === "ERROR"
                                ? "text-rose-500"
                                : log.status === "SUCCESS"
                                ? "text-emerald-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            [{log.status}]
                          </span>
                        </div>
                        {log.errorMessage ? (
                          <div className="text-rose-600 dark:text-rose-400 font-medium bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
                            {log.errorMessage}
                          </div>
                        ) : (
                          <div className="text-[11px] text-muted-foreground leading-relaxed">
                            {friendlyDetails}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent> */}
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmit()} disabled={loading}>
            {loading ? "Updating..." : "Update User"}
          </Button>
        </DialogFooter>
      </DialogContent>

      <ConfirmDialog
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        title="Confirm User Profile Changes"
        description={`Are you sure you want to save the edited profile details for "${formData.fullName || user.email}"?`}
        confirmText="Save Changes"
        loading={loading}
        onConfirm={handleConfirmUpdate}
      />
    </Dialog>
  );
};
