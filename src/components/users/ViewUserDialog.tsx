import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Calendar, MapPin, User, Briefcase, Heart, Award, CheckCircle, XCircle, Clock } from "lucide-react";

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
  createdAt?: string;
}

interface ViewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onEdit?: () => void;
}

export const ViewUserDialog = ({ open, onOpenChange, user, onEdit }: ViewUserDialogProps) => {
  if (!user) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to extract name from object or return string
  const extractName = (field: any): string | undefined => {
    if (!field) return undefined;
    if (typeof field === "string") return field;
    if (typeof field === "object" && field.name) return field.name;
    return undefined;
  };

  // Helper function to format location
  const formatLocation = (location: any): string | undefined => {
    if (!location) return undefined;
    if (typeof location === "string") return location;
    if (typeof location === "object") {
      const { city, state, country } = location;
      return [city, state, country].filter(Boolean).join(", ");
    }
    return undefined;
  };

  const getApprovalStatusBadge = (status?: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-chart-green text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-chart-orange text-white">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value?: string | number; icon?: any }) => (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon className="w-4 h-4 text-muted-foreground mt-0.5" />}
      <div className="flex-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium mt-0.5">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              {user.photos?.[0]?.url ? (
                <AvatarImage src={user.photos[0].url} />
              ) : (
                <AvatarFallback>{user.fullName?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{user.fullName || "Unnamed User"}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-3 h-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="mt-2">{getApprovalStatusBadge(user.approvalStatus)}</div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="education">Education & Work</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          {/* BASIC INFO */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-6">
              <InfoRow label="Account For" value={user.accountFor} icon={User} />
              <InfoRow label="Full Name" value={user.fullName} icon={User} />
              <InfoRow label="Email" value={user.email} icon={Mail} />
              <InfoRow
                label="Mobile"
                value={user.mobile ? `${user.countryCode || ""} ${user.mobile}` : undefined}
                icon={Phone}
              />
              <InfoRow label="Gender" value={user.gender} icon={User} />
              <InfoRow label="Date of Birth" value={formatDate(user.dateOfBirth)} icon={Calendar} />
              <InfoRow label="Preferred Language" value={user.preferredLanguage} />
              <InfoRow label="Member Since" value={formatDate(user.createdAt)} icon={Calendar} />
            </div>
          </TabsContent>

          {/* PERSONAL DETAILS */}
          <TabsContent value="personal" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-6">
              <InfoRow label="Height" value={user.heightCm ? `${user.heightCm} cm` : undefined} />
              <InfoRow label="Weight" value={user.weightKg ? `${user.weightKg} kg` : undefined} />
              <InfoRow label="Marital Status" value={user.maritalStatus} icon={Heart} />
              <InfoRow label="Body Type" value={user.bodyType} />
              <div className="col-span-2 space-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${user.physicallyChallenged ? "bg-primary border-primary" : "border-muted-foreground"
                        }`}
                    >
                      {user.physicallyChallenged && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm">Physically Challenged</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${user.livingWithFamily ? "bg-primary border-primary" : "border-muted-foreground"
                        }`}
                    >
                      {user.livingWithFamily && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm">Living With Family</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* EDUCATION & WORK */}
          <TabsContent value="education" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-6">
              {/* <InfoRow label="Course" value={user.course} icon={Award} /> */}
              <InfoRow label="Highest Education" value={extractName(user.highestEducation)} icon={Award} />
              <InfoRow label="Profession" value={extractName(user.profession)} icon={Briefcase} />
              <InfoRow
                label="Income"
                value={
                  user.income?.amount
                    ? `₹${user.income.amount.toLocaleString("en-IN")} ${user.income.type || ""}`
                    : undefined
                }
                icon={Briefcase}
              />
            </div>
          </TabsContent>

          {/* ADDITIONAL DETAILS */}
          <TabsContent value="additional" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {user.interests && user.interests.length > 0 ? (
                    user.interests.map((interest, idx) => (
                      <Badge key={idx} variant="secondary">
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No interests listed</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Personality Traits</p>
                <div className="flex flex-wrap gap-2">
                  {user.personalityTraits && user.personalityTraits.length > 0 ? (
                    user.personalityTraits.map((trait, idx) => (
                      <Badge key={idx} variant="secondary">
                        {trait}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No personality traits listed</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Diet Preference</p>
                <div className="flex flex-wrap gap-2">
                  {user.dietPreference && user.dietPreference.length > 0 ? (
                    user.dietPreference.map((diet, idx) => (
                      <Badge key={idx} variant="secondary">
                        {diet}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No diet preferences listed</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                <InfoRow label="City" value={formatLocation(user.city)} icon={MapPin} />
                <InfoRow label="Religion" value={extractName(user.religion)} />
                <InfoRow label="Caste" value={extractName(user.caste)} />
                <InfoRow label="Mother Tongue" value={extractName(user.motherTongue)} />
                {/* <InfoRow label="Branch" value={user.branch} /> */}
                <InfoRow label="Referred By" value={user.referredBy} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onEdit && (
            <Button onClick={onEdit}>
              Edit User
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
