import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConsultantCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: () => void;
}

export function ConsultantCreateDialog({ open, onOpenChange, onCreate }: ConsultantCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Consultant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Username</Label>
              <Input placeholder="broker_name" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="email@agency.com" />
            </div>
          </div>
          <div>
            <Label>Full Name</Label>
            <Input placeholder="Full Name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input placeholder="+91..." />
            </div>
            <div>
              <Label>Agency Name</Label>
              <Input placeholder="Agency" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
