import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Pencil, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSettingsAsync } from "@/store/slices/settingsSlice";
import { useEffect, useState } from "react";
import { GeneralSettingsDialog } from "@/components/settings/GeneralSettingsDialog";
// import { NotificationSettingsDialog } from "@/components/settings/NotificationSettingsDialog";
// import { PaymentGatewayDialog } from "@/components/settings/PaymentGatewayDialog";
// import { SocialLoginDialog } from "@/components/settings/SocialLoginDialog";

const Settings = () => {
  const dispatch = useAppDispatch();
  const { data: settings, loading } = useAppSelector((state) => state.settings);

  const [generalOpen, setGeneralOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSettingsAsync());
  }, [dispatch]);

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
          <p className="text-sm text-muted-foreground">Configure platform settings and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted/50 flex-wrap h-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          {/* 
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment Gateway</TabsTrigger>
          <TabsTrigger value="social">Social Login</TabsTrigger>
          */}
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

        {/* 
        <TabsContent value="notifications" className="space-y-4">
          ...
        </TabsContent>
        <TabsContent value="payment" className="space-y-4">
          ...
        </TabsContent>
        <TabsContent value="social" className="space-y-4">
          ...
        </TabsContent>
        */}
      </Tabs>

      {/* Dialogs */}
      <GeneralSettingsDialog
        open={generalOpen}
        onOpenChange={setGeneralOpen}
        initialData={settings}
      />
    </div>
  );
};

export default Settings;
