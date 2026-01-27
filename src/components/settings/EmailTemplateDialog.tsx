import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateEmailTemplateAsync } from "@/store/slices/settingsSlice";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { EmailTemplatesSettings } from "@/services/settingsService";

interface EmailTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: EmailTemplatesSettings;
}

export function EmailTemplateDialog({ open, onOpenChange, initialData }: EmailTemplateDialogProps) {
  const dispatch = useAppDispatch();
  const { actionLoading } = useAppSelector((state) => state.settings);

  const [selectedKey, setSelectedKey] = useState<string>("welcome");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (open && initialData) {
      // Load initial data for the selected key
      const template = initialData[selectedKey as keyof EmailTemplatesSettings];
      if (template) {
        setSubject(template.subject || "");
        setBody(template.body || "");
      } else {
        setSubject("");
        setBody("");
      }
    }
  }, [open, initialData, selectedKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updateEmailTemplateAsync({ templateKey: selectedKey, subject, body }));
    if (updateEmailTemplateAsync.fulfilled.match(result)) {
      // Don't close immediately, maybe user wants to edit another template? 
      // User experience choice: Close it for now to signify 'saved'.
      // Or just toast. Let's close it as per standard dialog generic behavior.
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Email Templates</DialogTitle>
          <DialogDescription>
            Customize content for system emails.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Template</Label>
            <Select value={selectedKey} onValueChange={setSelectedKey}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="welcome">Welcome Email</SelectItem>
                <SelectItem value="verification">Email Verification</SelectItem>
                <SelectItem value="passwordReset">Password Reset</SelectItem>
                <SelectItem value="matchAlert">Match Alert</SelectItem>
                <SelectItem value="interestReceived">Interest Received</SelectItem>
                <SelectItem value="subscription">Subscription Confirmation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailSubject">Email Subject</Label>
            <Input
              id="emailSubject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailBody">Email Body</Label>
            <Textarea
              id="emailBody"
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter email body (plain text or basic HTML)"
              className="font-mono text-sm"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={actionLoading}>
              {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Template
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
