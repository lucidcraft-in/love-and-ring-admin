import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { EmailTemplate, emailTemplateService } from "@/services/emailTemplateService";
import { Code, Loader2 } from "lucide-react";

interface TemplateAddEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: EmailTemplate | null;
  onSuccess: () => void;
}

const AVAILABLE_VARIABLES = [
  { key: "{{fullName}}", label: "Full Name" },
  { key: "{{email}}", label: "Email" },
  { key: "{{mobile}}", label: "Mobile" },
  { key: "{{alternateMobile}}", label: "Alt Mobile" },
  { key: "{{gender}}", label: "Gender" },
  { key: "{{accountFor}}", label: "Account For" },
  { key: "{{dob}}", label: "Date of Birth" },
  { key: "{{city}}", label: "City" },
  { key: "{{religion}}", label: "Religion" },
  { key: "{{caste}}", label: "Caste" },
  { key: "{{motherTongue}}", label: "Mother Tongue" },
  { key: "{{primaryEducation}}", label: "Education" },
  { key: "{{profession}}", label: "Profession" },
];

export const TemplateAddEditDialog = ({
  open,
  onOpenChange,
  template,
  onSuccess,
}: TemplateAddEditDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    category: "General",
    body: "",
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || "",
        subject: template.subject || "",
        category: template.category || "General",
        body: template.body || "",
      });
    } else {
      setFormData({
        name: "",
        subject: "",
        category: "General",
        body: "",
      });
    }
  }, [template, open]);

  const insertVariable = (varKey: string, field: "subject" | "body") => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] + " " + varKey,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.subject.trim() || !formData.body.trim()) {
      toast({
        title: "Validation Error",
        description: "Template Name, Subject, and Body are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      if (template?._id) {
        await emailTemplateService.updateTemplate(template._id, formData);
        toast({
          title: "Success",
          description: "Email template updated successfully",
        });
      } else {
        await emailTemplateService.createTemplate(formData);
        toast({
          title: "Success",
          description: "Email template created successfully",
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || err.message || "Failed to save template",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? "Edit Email Template" : "Create Email Template"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Welcome Offer Template"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Promotional, Account, General"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="subject">Email Subject *</Label>
              <span className="text-xs text-muted-foreground">Insert var into Subject:</span>
            </div>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Welcome to Love & Ring, {{fullName}}! 🎉"
              required
            />
          </div>

          {/* Quick Insert Variables list */}
          <div className="p-3 bg-muted/40 rounded-lg border space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Code className="w-3.5 h-3.5 text-primary" />
              Dynamic User Placeholders (Click to insert into Body):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_VARIABLES.map((item) => (
                <Badge
                  key={item.key}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-white transition-colors text-xs py-1"
                  onClick={() => insertVariable(item.key, "body")}
                >
                  + {item.label} ({item.key})
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Email Body (HTML supported) *</Label>
            <Textarea
              id="body"
              rows={10}
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Hello {{fullName}},\n\nWelcome to Love & Ring! Your profile details are:\nEmail: {{email}}\nMobile: {{mobile}}\n\nWarm regards,\nLove & Ring Team"
              className="font-mono text-sm"
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {template ? "Update Template" : "Create Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
