import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Branch } from "@/services/branchService";
import { Building2, User, Mail, Phone, MapPin, Calendar, Users, IndianRupee } from "lucide-react";

interface ViewBranchModalProps {
  open: boolean;
  onClose: () => void;
  branch: Branch | null;
}

export const ViewBranchModal = ({ open, onClose, branch }: ViewBranchModalProps) => {
  if (!branch) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Branch Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header with Status */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold">{branch.name}</h3>
              <p className="text-muted-foreground">{branch.city}, {branch.state}</p>
            </div>
            <Badge
              variant="outline"
              className={
                branch.status === "Active"
                  ? "border-chart-green text-chart-green"
                  : "border-muted-foreground text-muted-foreground"
              }
            >
              {branch.status}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs">Total Users</span>
              </div>
              <p className="text-2xl font-semibold">{branch.totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs">Premium Users</span>
              </div>
              <p className="text-2xl font-semibold text-chart-orange">{branch.premiumUsers.toLocaleString()}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <IndianRupee className="w-4 h-4" />
                <span className="text-xs">Revenue</span>
              </div>
              <p className="text-2xl font-semibold text-chart-green">₹{(branch.monthlyRevenue / 1000).toFixed(0)}K</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Manager</p>
                  <p className="font-medium">{branch.managerName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{branch.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{branch.phone}</p>
                </div>
              </div>

              {branch.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{branch.address}</p>
                    {branch.pincode && <p className="text-sm text-muted-foreground">PIN: {branch.pincode}</p>}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Created On</p>
                  <p className="font-medium">{formatDate(branch.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
