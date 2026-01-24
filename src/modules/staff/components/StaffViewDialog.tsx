import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Building2, Shield, Calendar, Activity } from "lucide-react";
import { Staff } from "@/services/staffService";
import { useAppSelector } from "@/store/hooks";

interface StaffViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
}

export function StaffViewDialog({ open, onOpenChange, staff }: StaffViewDialogProps) {
  const { branches } = useAppSelector((state) => state.branch);

  if (!staff) return null;

  // Get branch name from branch ID
  const branchName = branches.find((b) => b._id === staff.branch)?.name || staff.branch;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Staff Profile</DialogTitle>
          <DialogDescription>
            View staff member details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Profile Header */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(staff.fullName)}&background=random`} />
              <AvatarFallback className="text-lg">{staff.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{staff.fullName}</h3>
              <Badge variant="outline" className="mt-1">{staff.role}</Badge>
              <Badge
                variant="outline"
                className={`ml-2 ${staff.status === "Active"
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

            {staff.phone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{staff.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Branch</p>
                <p className="font-medium">{branchName}</p>
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

          {/* Activity */}
          <div className="p-3 bg-muted/30 rounded-lg text-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Created
              </span>
              <span className="font-medium">
                {new Date(staff.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            {staff.updatedAt && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Last Updated
                </span>
                <span className="font-medium">
                  {new Date(staff.updatedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
