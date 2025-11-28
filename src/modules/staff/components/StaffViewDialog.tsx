import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Building2, Shield, Calendar, Activity, Users, Award } from "lucide-react";

interface StaffMember {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
  branch: string;
  profilesHandled: number;
  matchesSuggested: number;
  status: string;
  lastLogin: string;
  joinDate?: string;
}

interface StaffViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
}

export function StaffViewDialog({ open, onOpenChange, staff }: StaffViewDialogProps) {
  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Staff Profile</DialogTitle>
          <DialogDescription>
            View staff member details and performance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Profile Header */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Avatar className="w-16 h-16">
              <AvatarImage src={staff.avatar} />
              <AvatarFallback className="text-lg">{staff.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{staff.name}</h3>
              <Badge variant="outline" className="mt-1">{staff.role}</Badge>
              <Badge
                variant="outline"
                className={`ml-2 ${
                  staff.status === "Active"
                    ? "border-chart-green text-chart-green"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {staff.status}
              </Badge>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{staff.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{staff.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Branch</p>
                <p className="font-medium">{staff.branch}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{staff.role}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Performance Stats */}
          <div>
            <h4 className="font-medium mb-3">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-chart-orange/10 rounded-lg text-center">
                <Users className="w-5 h-5 text-chart-orange mx-auto mb-1" />
                <p className="text-2xl font-bold text-chart-orange">{staff.profilesHandled}</p>
                <p className="text-xs text-muted-foreground">Profiles Handled</p>
              </div>
              <div className="p-3 bg-chart-green/10 rounded-lg text-center">
                <Award className="w-5 h-5 text-chart-green mx-auto mb-1" />
                <p className="text-2xl font-bold text-chart-green">{staff.matchesSuggested}</p>
                <p className="text-xs text-muted-foreground">Matches Made</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity */}
          <div className="p-3 bg-muted/30 rounded-lg text-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" /> Last Login
              </span>
              <span className="font-medium">{staff.lastLogin}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Join Date
              </span>
              <span className="font-medium">{staff.joinDate || "Jan 2023"}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
