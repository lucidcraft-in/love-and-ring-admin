import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Pencil, Loader2, Mail, Plus, Trash2, Send, FileText } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSettingsAsync } from "@/store/slices/settingsSlice";
import { useEffect, useState } from "react";
import { GeneralSettingsDialog } from "@/components/settings/GeneralSettingsDialog";
import { TemplateAddEditDialog } from "@/components/settings/TemplateAddEditDialog";
import { SendTemplateEmailDialog } from "@/components/settings/SendTemplateEmailDialog";
import { EmailTemplate, emailTemplateService } from "@/services/emailTemplateService";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { data: settings, loading } = useAppSelector((state) => state.settings);

  const [generalOpen, setGeneralOpen] = useState(false);

  // Email Templates State
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  // Send Email Dialog State
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [templateToSend, setTemplateToSend] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    dispatch(fetchSettingsAsync());
    fetchTemplates();
  }, [dispatch]);

  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const data = await emailTemplateService.getTemplates();
      setTemplates(data);
    } catch (err: any) {
      console.error("Failed to load email templates", err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setTemplateDialogOpen(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setTemplateDialogOpen(true);
  };

  const handleDeleteTemplate = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete template "${name}"?`)) {
      return;
    }
    try {
      await emailTemplateService.deleteTemplate(id);
      toast({
        title: "Deleted",
        description: `Template "${name}" has been deleted`,
      });
      fetchTemplates();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = (template: EmailTemplate) => {
    setTemplateToSend(template);
    setSendDialogOpen(true);
  };

  if (loading && !settings) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return <div className="p-8 text-muted-foreground">Failed to load settings.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure platform settings, preferences, and email templates</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted/50 flex-wrap h-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1.5">
            <Mail className="w-4 h-4" />
            Email Templates
          </TabsTrigger>
        </TabsList>

        {/* GENERAL SETTINGS */}
        <TabsContent value="general" className="space-y-4">
          <Card className="stat-card-shadow border-0 relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute right-4 top-4"
              onClick={() => setGeneralOpen(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-primary" />
                Platform Settings
              </CardTitle>
              <CardDescription>Configure basic platform information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>App Name</Label>
                  <div className="p-2 bg-muted rounded border">{settings.appName}</div>
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <div className="p-2 bg-muted rounded border">{settings.tagline || "-"}</div>
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <div className="p-2 bg-muted rounded border">{settings.supportEmail || "-"}</div>
                </div>
                <div className="space-y-2">
                  <Label>Support Phone</Label>
                  <div className="p-2 bg-muted rounded border">{settings.supportPhone || "-"}</div>
                </div>
                <div className="space-y-2">
                  <Label>Default Country</Label>
                  <div className="p-2 bg-muted rounded border">{settings.defaultCountry}</div>
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <div className="p-2 bg-muted rounded border">{settings.defaultCurrency}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EMAIL TEMPLATES */}
        <TabsContent value="templates" className="space-y-4">
          <Card className="stat-card-shadow border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Email Templates &amp; Campaigns
                </CardTitle>
                <CardDescription>
                  Manage email templates with dynamic parameter placeholders (e.g. &#123;&#123;fullName&#125;&#125;, &#123;&#123;email&#125;&#125;, &#123;&#123;mobile&#125;&#125;) and send individual or bulk emails.
                </CardDescription>
              </div>
              <Button onClick={handleCreateTemplate} className="gap-2">
                <Plus className="w-4 h-4" />
                Add New Template
              </Button>
            </CardHeader>
            <CardContent>
              {loadingTemplates ? (
                <div className="flex py-12 justify-center items-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg space-y-3">
                  <FileText className="w-10 h-10 mx-auto text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">No Email Templates Found</p>
                    <p className="text-xs text-muted-foreground">Create your first email template to get started with individual and bulk user campaigns.</p>
                  </div>
                  <Button onClick={handleCreateTemplate} size="sm" variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Template
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Template Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {templates.map((tmpl) => (
                        <TableRow key={tmpl._id}>
                          <TableCell className="font-medium text-foreground">
                            {tmpl.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-normal text-xs">
                              {tmpl.category || "General"}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-muted-foreground">
                            {tmpl.subject}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {tmpl.createdAt ? new Date(tmpl.createdAt).toLocaleDateString() : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                className="h-8 gap-1 text-xs"
                                onClick={() => handleSendEmail(tmpl)}
                              >
                                <Send className="w-3.5 h-3.5" />
                                Send Email
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditTemplate(tmpl)}
                                title="Edit Template"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteTemplate(tmpl._id, tmpl.name)}
                                title="Delete Template"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* General Settings Dialog */}
      <GeneralSettingsDialog
        open={generalOpen}
        onOpenChange={setGeneralOpen}
        initialData={settings}
      />

      {/* Template Create/Edit Dialog */}
      <TemplateAddEditDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        template={selectedTemplate}
        onSuccess={fetchTemplates}
      />

      {/* Send Email Dialog */}
      <SendTemplateEmailDialog
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
        template={templateToSend}
      />
    </div>
  );
};

export default Settings;
