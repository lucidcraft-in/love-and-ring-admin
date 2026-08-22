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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { EmailTemplate, emailTemplateService, SendBulkEmailResponse } from "@/services/emailTemplateService";
import { userService, User } from "@/services/userService";
import { Send, Users, UserCheck, Loader2, AlertTriangle, CheckCircle2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SendTemplateEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate | null;
}

export const SendTemplateEmailDialog = ({
  open,
  onOpenChange,
  template,
}: SendTemplateEmailDialogProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"individual" | "bulk">("individual");
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [comboOpen, setComboOpen] = useState(false);
  const [customEmail, setCustomEmail] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [bulkResult, setBulkResult] = useState<SendBulkEmailResponse | null>(null);

  useEffect(() => {
    if (open) {
      setBulkResult(null);
      setSelectedUserId("");
      setComboOpen(false);
      setCustomEmail("");
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await userService.getUsers({ skip: 0, take: 500 });
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users list", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const selectedUser = users.find((u) => u._id === selectedUserId);

  const handleSendIndividual = async () => {
    if (!template?._id) return;
    const recipient = selectedUser?.email || customEmail.trim();
    if (!recipient) {
      toast({
        title: "Validation Error",
        description: "Please select a user or enter a recipient email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);
      await emailTemplateService.sendIndividualEmail({
        templateId: template._id,
        userId: selectedUserId || undefined,
        recipientEmail: recipient,
      });

      toast({
        title: "Email Sent Successfully! 🎉",
        description: `Template "${template.name}" has been sent to ${recipient}`,
      });
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Failed to Send Email",
        description: err?.response?.data?.message || err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendBulk = async () => {
    if (!template?._id) return;

    try {
      setSending(true);
      const res = await emailTemplateService.sendBulkEmail({
        templateId: template._id,
      });
      setBulkResult(res);
      toast({
        title: "Bulk Campaign Completed 🎉",
        description: res.message,
      });
    } catch (err: any) {
      toast({
        title: "Bulk Campaign Error",
        description: err?.response?.data?.message || err.message || "Failed to execute bulk campaign",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Send Email Template: {template.name}
          </DialogTitle>
          <DialogDescription>
            Subject: <span className="font-semibold text-foreground">{template.subject}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Send Individual User
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Send Bulk to All Users
            </TabsTrigger>
          </TabsList>

          {/* INDIVIDUAL */}
          <TabsContent value="individual" className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Select Registered User</Label>
              <Popover open={comboOpen} onOpenChange={setComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboOpen}
                    className="w-full justify-between font-normal text-left h-10 px-3 border-input bg-background hover:bg-accent"
                  >
                    <span className="truncate">
                      {selectedUser
                        ? `${selectedUser.fullName || "Unnamed User"} (${selectedUser.email})`
                        : loadingUsers
                        ? "Loading users..."
                        : "Search and select user by name or email..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Type name or email to search..." />
                    <CommandList className="max-h-60 overflow-y-auto">
                      <CommandEmpty>No matching user found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((u) => (
                          <CommandItem
                            key={u._id}
                            value={`${u.fullName || ""} ${u.email} ${u.mobile || ""}`}
                            onSelect={() => {
                              setSelectedUserId(u._id === selectedUserId ? "" : u._id);
                              setComboOpen(false);
                            }}
                            className="flex items-center justify-between text-xs py-2 px-3 cursor-pointer"
                          >
                            <div className="flex flex-col truncate">
                              <span className="font-medium text-foreground">{u.fullName || "Unnamed User"}</span>
                              <span className="text-muted-foreground">{u.email}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-2 h-4 w-4 shrink-0 text-primary",
                                selectedUserId === u._id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="relative flex items-center my-2">
              <div className="flex-grow border-t border-muted"></div>
              <span className="flex-shrink mx-3 text-xs text-muted-foreground uppercase font-medium">OR Manual Recipient Email</span>
              <div className="flex-grow border-t border-muted"></div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customEmail">Direct Email Address</Label>
              <Input
                id="customEmail"
                type="email"
                placeholder="user@example.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                disabled={!!selectedUserId}
              />
              {selectedUserId && (
                <p className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>Using selected user's email: <strong>{selectedUser?.email}</strong></span>
                  <button
                    type="button"
                    onClick={() => setSelectedUserId("")}
                    className="text-primary hover:underline text-xs"
                  >
                    Clear Selection
                  </button>
                </p>
              )}
            </div>

            <div className="p-3 bg-muted/40 rounded-lg border text-xs space-y-1">
              <span className="font-semibold text-foreground">Dynamic Replacement Preview:</span>
              <div className="text-muted-foreground">
                <p>• Full Name: <strong>{selectedUser?.fullName || customEmail || "Member"}</strong></p>
                <p>• Email: <strong>{selectedUser?.email || customEmail || "-"}</strong></p>
                <p>• Mobile: <strong>{selectedUser?.mobile || "-"}</strong></p>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
                Cancel
              </Button>
              <Button onClick={handleSendIndividual} disabled={sending}>
                {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                Send Individual Email
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* BULK */}
          <TabsContent value="bulk" className="space-y-4 pt-2">
            <div className="p-4 bg-chart-orange/10 border border-chart-orange/30 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-chart-orange font-semibold text-sm">
                <AlertTriangle className="w-5 h-5" />
                Confirm Bulk Campaign Action
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You are about to send personalized emails to <strong>all registered users</strong> in the database. Each recipient's email body will automatically inject their name, email, mobile, and profile parameters.
              </p>
            </div>

            {bulkResult && (
              <div className="p-4 bg-chart-green/10 border border-chart-green/30 rounded-lg space-y-2 text-xs">
                <div className="flex items-center gap-2 text-chart-green font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  Campaign Execution Summary
                </div>
                <div className="grid grid-cols-3 gap-2 py-2">
                  <div className="p-2 bg-background rounded border text-center">
                    <span className="text-muted-foreground block text-[10px]">TOTAL USERS</span>
                    <span className="font-bold text-base">{bulkResult.totalUsers}</span>
                  </div>
                  <div className="p-2 bg-background rounded border text-center text-chart-green">
                    <span className="text-muted-foreground block text-[10px]">SUCCESS</span>
                    <span className="font-bold text-base">{bulkResult.successCount}</span>
                  </div>
                  <div className="p-2 bg-background rounded border text-center text-destructive">
                    <span className="text-muted-foreground block text-[10px]">FAILED</span>
                    <span className="font-bold text-base">{bulkResult.failCount}</span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
                Close
              </Button>
              <Button onClick={handleSendBulk} disabled={sending} variant="default" className="bg-chart-rose hover:bg-chart-rose/90">
                {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
                Send Bulk Email to All Users
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
