import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ServiceEnquiryItem,
  weddingServiceService,
} from "@/services/weddingServiceService";
import { Mail, Phone, Calendar, User, Briefcase, FileText, Loader2, Save, Send, AlertTriangle } from "lucide-react";

interface ServiceEnquiryDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enquiry: ServiceEnquiryItem | null;
  onSuccess: () => void;
}

export const ServiceEnquiryDetailDialog = ({
  open,
  onOpenChange,
  enquiry,
  onSuccess,
}: ServiceEnquiryDetailDialogProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<string>("Pending");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Confirmation Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notifyClient, setNotifyClient] = useState(true);

  useEffect(() => {
    if (enquiry) {
      setStatus(enquiry.status || "Pending");
      setNotes(enquiry.notes || "");
      setNotifyClient(true);
    }
  }, [enquiry]);

  if (!enquiry) return null;

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      setLoading(true);
      await weddingServiceService.updateServiceEnquiryStatus(enquiry._id, {
        status,
        notes,
        notifyClient,
      });

      toast({
        title: "Enquiry Saved & Updated! 🎉",
        description: notifyClient
          ? `Status updated to ${status}. Status notification email sent to ${enquiry.email}.`
          : `Status updated to ${status}.`,
      });

      setConfirmOpen(false);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err?.response?.data?.message || err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "Pending":
        return <Badge className="bg-amber-500 text-white">Pending</Badge>;
      case "Contacted":
        return <Badge className="bg-blue-500 text-white">Contacted</Badge>;
      case "Resolved":
        return <Badge className="bg-emerald-600 text-white">Resolved</Badge>;
      case "Cancelled":
        return <Badge className="bg-slate-500 text-white">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{st}</Badge>;
    }
  };

  return (
    <>
      {/* Main Detail Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between gap-2 pr-6">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Service Enquiry Details
              </DialogTitle>
              <Badge className="bg-primary text-primary-foreground font-mono text-xs">
                {enquiry.enquiryId}
              </Badge>
            </div>
          </DialogHeader>

          <form onSubmit={handleOpenConfirm} className="space-y-5 py-2">
            {/* Service requested banner */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block">
                Service Requested
              </span>
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                {enquiry.serviceTitle}
              </h4>
              <span className="text-xs text-muted-foreground block">
                Category: {enquiry.serviceCategory}
              </span>
            </div>

            {/* Client Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-muted/30 p-3.5 rounded-lg border">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground block">Client Name</span>
                  <strong className="text-foreground text-sm">{enquiry.name}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground block">Email</span>
                  <a href={`mailto:${enquiry.email}`} className="text-primary font-medium hover:underline">
                    {enquiry.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground block">Phone</span>
                  <strong className="text-foreground">{enquiry.phone || "Not provided"}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground block">Preferred Date</span>
                  <strong className="text-foreground">{enquiry.eventDate || "Flexible / Not specified"}</strong>
                </div>
              </div>
            </div>

            {/* Client Message */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Client Message / Notes</Label>
              <div className="p-3 bg-muted/40 rounded-lg border text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                {enquiry.message || "No custom message provided."}
              </div>
            </div>

            {/* Status and Admin Notes */}
            <div className="space-y-4 pt-2 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <Label htmlFor="enquiry-status">Update Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="enquiry-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending (New)</SelectItem>
                      <SelectItem value="Contacted">Contacted Partner / Client</SelectItem>
                      <SelectItem value="Resolved">Resolved / Booked</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">Selected Status</span>
                  {getStatusBadge(status)}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-notes">Internal Admin Notes / Client Message</Label>
                <Textarea
                  id="admin-notes"
                  rows={3}
                  placeholder="Add notes or update message to be shared in the email to the client..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Status &amp; Notes...
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Save Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Send className="w-5 h-5 text-primary" />
              Confirm Enquiry Update
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Please confirm saving changes for enquiry <strong className="font-mono text-primary">{enquiry.enquiryId}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="bg-muted/40 p-3 rounded-lg border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Client:</span>
                <span className="font-semibold text-foreground">{enquiry.name} ({enquiry.email})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium text-foreground">{enquiry.serviceTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Previous Status:</span>
                {getStatusBadge(enquiry.status)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">New Status:</span>
                {getStatusBadge(status)}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="notify-client"
                checked={notifyClient}
                onCheckedChange={(checked) => setNotifyClient(!!checked)}
              />
              <label
                htmlFor="notify-client"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Send status update notification email to <strong>{enquiry.email}</strong>
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={loading}
              className="text-xs"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSave}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving &amp; Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Confirm &amp; Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
