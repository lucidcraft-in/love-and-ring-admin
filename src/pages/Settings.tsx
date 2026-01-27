import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Bell, Mail, CreditCard, Globe, Upload, Save, Pencil, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSettingsAsync } from "@/store/slices/settingsSlice";
import { useEffect, useState } from "react";
import { GeneralSettingsDialog } from "@/components/settings/GeneralSettingsDialog";
import { NotificationSettingsDialog } from "@/components/settings/NotificationSettingsDialog";
import { EmailTemplateDialog } from "@/components/settings/EmailTemplateDialog";
import { PaymentGatewayDialog } from "@/components/settings/PaymentGatewayDialog";
import { SocialLoginDialog } from "@/components/settings/SocialLoginDialog";

const Settings = () => {
  const dispatch = useAppDispatch();
  const { data: settings, loading } = useAppSelector((state) => state.settings);

  const [generalOpen, setGeneralOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSettingsAsync());
  }, [dispatch]);

  if (loading && !settings) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!settings) {
    return <div className="p-8">Failed to load settings.</div>;
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
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="payment">Payment Gateway</TabsTrigger>
          <TabsTrigger value="social">Social Login</TabsTrigger>
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
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="p-4 border border-dashed rounded flex items-center justify-center bg-muted/20">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="App Logo" className="h-16 object-contain" />
                  ) : (
                    <span className="text-muted-foreground text-sm">No logo uploaded</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="p-4 border border-dashed rounded flex items-center justify-center bg-muted/20">
                  {settings.faviconUrl ? (
                    <img src={settings.faviconUrl} alt="App Favicon" className="h-10 w-10 object-contain" />
                  ) : (
                    <span className="text-muted-foreground text-sm">No favicon uploaded</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATION SETTINGS */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="stat-card-shadow border-0 relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute right-4 top-4"
              onClick={() => setNotificationOpen(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Read-only view of simple toggles */}
              <div className="space-y-4 pointer-events-none opacity-90">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications to users</p>
                  </div>
                  <Switch checked={settings.notifications.email} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send SMS notifications to users</p>
                  </div>
                  <Switch checked={settings.notifications.sms} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send push notifications to app users</p>
                  </div>
                  <Switch checked={settings.notifications.push} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Match Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify users about new matches</p>
                  </div>
                  <Switch checked={settings.notifications.matchAlerts} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Profile Views</Label>
                    <p className="text-sm text-muted-foreground">Notify users when someone views their profile</p>
                  </div>
                  <Switch checked={settings.notifications.profileViews} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Interest Notifications</Label>
                    <p className="text-sm text-muted-foreground">Notify users when they receive interests</p>
                  </div>
                  <Switch checked={settings.notifications.interests} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EMAIL TEMPLATES */}
        <TabsContent value="email" className="space-y-4">
          <Card className="stat-card-shadow border-0 relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute right-4 top-4"
              onClick={() => setEmailOpen(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Templates
            </Button>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Email Templates
              </CardTitle>
              <CardDescription>View and customize email templates. (Click Edit to modify specific templates)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto opacity-20 mb-3" />
                <p>Select "Edit Templates" to modify Welcome, Verification, and other system emails.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAYMENT GATEWAY */}
        <TabsContent value="payment" className="space-y-4">
          <Card className="stat-card-shadow border-0 relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute right-4 top-4"
              onClick={() => setPaymentOpen(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Configure
            </Button>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Gateway Settings
              </CardTitle>
              <CardDescription>Configure payment gateway integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 pointer-events-none">
                <div className="p-4 border border-border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">RZP</span>
                      </div>
                      <div>
                        <p className="font-medium">Razorpay</p>
                        <p className={`text-sm ${settings.paymentGateway.razorpay.enabled ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                          {settings.paymentGateway.razorpay.enabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <Switch checked={settings.paymentGateway.razorpay.enabled} />
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">STR</span>
                      </div>
                      <div>
                        <p className="font-medium">Stripe</p>
                        <p className={`text-sm ${settings.paymentGateway.stripe.enabled ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                          {settings.paymentGateway.stripe.enabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <Switch checked={settings.paymentGateway.stripe.enabled} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SOCIAL LOGIN */}
        <TabsContent value="social" className="space-y-4">
          <Card className="stat-card-shadow border-0 relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute right-4 top-4"
              onClick={() => setSocialOpen(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Configure
            </Button>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Social Login Settings
              </CardTitle>
              <CardDescription>Configure social login integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 pointer-events-none">
                {[
                  { key: 'google', name: 'Google', color: 'bg-red-100', text: 'text-red-600', label: 'G' },
                  { key: 'facebook', name: 'Facebook', color: 'bg-blue-100', text: 'text-blue-600', label: 'F' },
                  { key: 'apple', name: 'Apple', color: 'bg-gray-100', text: 'text-gray-600', label: 'A' },
                ].map((provider) => (
                  <div key={provider.key} className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${provider.color} rounded-lg flex items-center justify-center`}>
                          <span className={`${provider.text} font-bold text-sm`}>{provider.label}</span>
                        </div>
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          <p className={`text-sm ${settings.socialLogin[provider.key as keyof typeof settings.socialLogin].enabled ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                            {settings.socialLogin[provider.key as keyof typeof settings.socialLogin].enabled ? "Enabled" : "Disabled"}
                          </p>
                        </div>
                      </div>
                      <Switch checked={settings.socialLogin[provider.key as keyof typeof settings.socialLogin].enabled} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <GeneralSettingsDialog
        open={generalOpen}
        onOpenChange={setGeneralOpen}
        initialData={settings}
      />
      <NotificationSettingsDialog
        open={notificationOpen}
        onOpenChange={setNotificationOpen}
        initialData={settings.notifications}
      />
      <EmailTemplateDialog
        open={emailOpen}
        onOpenChange={setEmailOpen}
        initialData={settings.emailTemplates}
      />
      <PaymentGatewayDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        initialData={settings.paymentGateway}
      />
      <SocialLoginDialog
        open={socialOpen}
        onOpenChange={setSocialOpen}
        initialData={settings.socialLogin}
      />

    </div>
  );
};

export default Settings;
