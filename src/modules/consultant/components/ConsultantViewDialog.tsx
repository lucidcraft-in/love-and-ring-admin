import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Consultant } from "../types";

interface ConsultantViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultant: Consultant | null;
}

export function ConsultantViewDialog({ open, onOpenChange, consultant }: ConsultantViewDialogProps) {
  if (!consultant) return null;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: "bg-chart-green/10 text-chart-green",
      PENDING: "bg-chart-orange/10 text-chart-orange",
      REJECTED: "bg-destructive/10 text-destructive",
      SUSPENDED: "bg-muted text-muted-foreground"
    };
    return <Badge variant="secondary" className={styles[status]}>{status}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Consultant Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="text-lg">{consultant.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{consultant.fullName}</h3>
              <p className="text-sm text-muted-foreground">@{consultant.username}</p>
              {getStatusBadge(consultant.status)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{consultant.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{consultant.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Agency</p>
              <p className="font-medium">{consultant.agencyName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Profiles Created</p>
              <p className="font-medium">{consultant.profilesCreated}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Regions</p>
            <div className="flex gap-2 flex-wrap">
              {consultant.regions.map(r => <Badge key={r} variant="outline">{r}</Badge>)}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Permissions</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(consultant.permissions).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className={v ? "text-chart-green" : "text-muted-foreground"}>{v ? "✓" : "✗"}</span>
                  <span>{k.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
