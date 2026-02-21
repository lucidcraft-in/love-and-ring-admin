import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Trash2, Star, X } from "lucide-react";
import Axios from "../../axios/axios";
import { masterDataService } from "@/services/masterDataService";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMasterDataAsync,
} from "@/store/slices/masterDataSlice";

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
  primaryEducation?: any,
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
    // course: "",
    primaryEducation: "",
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
    // branch: "",
    referredBy: "",
  });

  const filteredCastes = formData.religion
    ? castes.filter((caste) => {
      const casteReligionId = typeof caste.religion === "object" ? caste.religion?._id : caste.religion;
      return casteReligionId === formData.religion;
    })
    : castes;

  const [photos, setPhotos] = useState<any[]>([]);

  // Fetch master data when dialog opens
  // Fetch master data when dialog opens
  useEffect(() => {
    if (open) {
      // Fetch all needed dropdown data
      const fetchData = async () => {
        try {
          const [r, c, l, lang, pe, he, o] = await Promise.all([
            masterDataService.getSimpleList('religions'),
            masterDataService.getSimpleList('castes'),
            masterDataService.getSimpleList('locations'),
            masterDataService.getSimpleList('languages'),
            masterDataService.getSimpleList('primaryEducations'),
            masterDataService.getSimpleList('higherEducations'),
            masterDataService.getSimpleList('occupations'),
          ]);

          setReligions(r.data);
          setCastes(c.data);
          setLocations(l.data);
          setLanguages(lang.data);
          setPrimaryEducations(pe.data);
          setHigherEducations(he.data);
          setOccupations(o.data);
          // [r, c, l, lang, e, he, o]
          // The previous code had: [r, c, l, lang, e, o] = await Promise.all([
          //   masterDataService.getSimpleList('religions'),
          //   masterDataService.getSimpleList('castes'),
          //   masterDataService.getSimpleList('locations'),
          //   masterDataService.getSimpleList('languages'),
          //   masterDataService.getSimpleList('primaryEducations'),
          //   masterDataService.getSimpleList('higherEducations'),
          //   masterDataService.getSimpleList('occupations'),
          // ]);
          // So 'e' is primaryEducations, 'o' is higherEducations. Wait, the array destructuring was wrong in original code or I misread.
          // Original: [r, c, l, lang, e, o]
          // API calls: religions, castes, locations, languages, primaryEducations, higherEducations, occupations.
          // So 'e' was assigned primaryEducations, and 'o' was assigned higherEducations. Occupations was ignored?
          // Let's fix this properly.

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
        // course: user.course || ""
        primaryEducation: extractId(user.primaryEducation),
        highestEducation: extractId(user.highestEducation),
        profession: extractId(user.profession),
        incomeAmount: user.income?.amount?.toString() || "",
        incomeType: user.income?.type || "Yearly",
        interests: user.interests?.join(", ") || "",
        personalityTraits: user.personalityTraits?.join(", ") || "",
        dietPreference: user.dietPreference?.join(", ") || "",
        city: extractId(user.city),
        religion: extractId(user.religion),
        caste: extractId(user.caste),
        motherTongue: extractId(user.motherTongue),
        approvalStatus: user.approvalStatus || "PENDING",
        // branch: extractId(user.branch),
        referredBy: extractId(user.referredBy),
      });
      setPhotos(user.photos || []);
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
        // course: formData.course,
        primaryEducation: formData.primaryEducation || undefined,
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
        // branch: formData.branch || undefined,
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length || !user?._id) return;

    try {
      setUploading(true);

      // If there are existing photos, delete them first to ensure only one photo exists
      if (photos.length > 0) {
        for (const photo of photos) {
          try {
            await userService.deleteUserPhoto(user._id, photo.url);
          } catch (err) {
            console.error("Failed to delete existing photo", err);
            // Continue with upload even if delete fails, though ideally clean up
          }
        }
      }

      const formData = new FormData();
      // Only append the first file since we restrict to single photo
      if (e.target.files.length > 0) {
        formData.append("photos", e.target.files[0]);
      }

      const newPhotos = await userService.uploadUserPhotos(user._id, formData);

      // setPhotos(newPhotos); // Assuming backend returns updated list or we append. 
      // usersService.uploadUserPhotos returns User['photos'] which is the array.
      if (newPhotos) {
        setPhotos(newPhotos);
      }

      toast({
        title: "Success",
        description: "Photo updated successfully",
      });

      onUserUpdated?.();
      // onOpenChange(false); // Validated: Keep dialog open to show uploaded photos
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to upload photos",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    if (!user?._id) return;
    try {
      const updatedPhotos = await userService.deleteUserPhoto(user._id, photoUrl);
      setPhotos(updatedPhotos);
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });
      onUserUpdated?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
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
              {/* <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                />
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="primaryEducation">Qualification Level</Label>
                <Select
                  value={formData.primaryEducation}
                  onValueChange={(val) => {
                    handleInputChange("primaryEducation", val);
                    handleInputChange("highestEducation", ""); // Reset highest education when primary changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary education" />
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
                <Label htmlFor="highestEducation">Highest Education</Label>
                <Select
                  value={formData.highestEducation}
                  onValueChange={(val) => handleInputChange("highestEducation", val)}
                  disabled={!formData.primaryEducation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select highest education" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(higherEducations) &&
                      higherEducations
                        .filter(edu => {
                          if (!formData.primaryEducation) return true;
                          // Check if primaryEducation field exists and matches
                          const pId = typeof edu.primaryEducation === 'object' ? edu.primaryEducation?._id : edu.primaryEducation;
                          return pId === formData.primaryEducation;
                        })
                        .map((education) => (
                          <SelectItem key={education._id} value={education._id}>
                            {education.name}
                          </SelectItem>
                        ))
                    }

                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Select
                  value={formData.profession}
                  onValueChange={(val) => handleInputChange("profession", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(occupations) &&
                      occupations.map((occupation) => (
                        <SelectItem key={occupation._id} value={occupation._id}>
                          {occupation.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
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
            </div>

            <div className="space-y-2">
              <Label>User Photos</Label>
              {photos.length > 0 ? (
                <div className="relative group aspect-square rounded-lg overflow-hidden border bg-muted w-full max-w-xs mx-auto">
                  <img
                    src={photos[0].url}
                    alt="User photo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photos[0].url);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                    <div className="relative">
                      <Button variant="secondary" size="sm" className="pointer-events-none">
                        Change Photo
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handlePhotoUpload}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                  {photos[0].isPrimary && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Primary
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
                    disabled={uploading}
                  />
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-xs font-medium text-center px-2">
                    {uploading ? "Uploading..." : "Click to upload primary photo"}
                  </span>
                </div>
              )}
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
                <Label htmlFor="city">City</Label>
                <Select value={formData.city} onValueChange={(val) => handleInputChange("city", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(locations) &&
                      locations.map((location) => (
                        <SelectItem key={location._id} value={location._id}>
                          {location.city}, {location.state}, {location.country}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="religion">Religion</Label>
                <Select value={formData.religion} onValueChange={(val) => handleInputChange("religion", val)}>
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
                <Select value={formData.caste} onValueChange={(val) => handleInputChange("caste", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select caste" />
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
                <Label htmlFor="motherTongue">Mother Tongue</Label>
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

              {/* <div className="space-y-2">
                  <Label htmlFor="branch">Branch (ID)</Label>
                  <Input id="branch" value={formData.branch} onChange={(e) => handleInputChange("branch", e.target.value)} />
                </div> */}
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
    </Dialog >
  );
};
