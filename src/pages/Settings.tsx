// import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Bell, Mail, CreditCard, Globe, Upload, Save } from "lucide-react";

const Settings = () => {
  return (
    // <AdminLayout>
      <div className="space-y-6 animate-fade-in">
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

          <TabsContent value="general" className="space-y-4">
            <Card className="stat-card-shadow border-0">
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
                    <Label htmlFor="appName">App Name</Label>
                    <Input id="appName" defaultValue="MatchMate" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input id="tagline" defaultValue="Find Your Perfect Match" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input id="supportEmail" type="email" defaultValue="support@matchmate.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportPhone">Support Phone</Label>
                    <Input id="supportPhone" defaultValue="+91 1800 123 4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Default Country</Label>
                    <Select defaultValue="india">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="inr">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inr">INR (₹)</SelectItem>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <Button variant="outline">Upload Logo</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <Upload className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Button variant="outline">Upload Favicon</Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="stat-card-shadow border-0">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send email notifications to users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send SMS notifications to users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send push notifications to app users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Match Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notify users about new matches</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Profile Views</Label>
                      <p className="text-sm text-muted-foreground">Notify users when someone views their profile</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Interest Notifications</Label>
                      <p className="text-sm text-muted-foreground">Notify users when they receive interests</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Card className="stat-card-shadow border-0">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Email Templates
                </CardTitle>
                <CardDescription>Customize email templates for various notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Template</Label>
                  <Select defaultValue="welcome">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="verification">Email Verification</SelectItem>
                      <SelectItem value="password-reset">Password Reset</SelectItem>
                      <SelectItem value="match-alert">Match Alert</SelectItem>
                      <SelectItem value="interest-received">Interest Received</SelectItem>
                      <SelectItem value="subscription">Subscription Confirmation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailSubject">Email Subject</Label>
                  <Input id="emailSubject" defaultValue="Welcome to MatchMate - Your Journey to Find Love Begins!" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailBody">Email Body</Label>
                  <Textarea
                    id="emailBody"
                    rows={10}
                    defaultValue={`Dear {{user_name}},

Welcome to MatchMate! We're thrilled to have you join our community of singles looking for meaningful connections.

Your profile has been created successfully. Here's what you can do next:

1. Complete your profile to attract more matches
2. Upload clear, recent photos
3. Set your partner preferences
4. Start browsing profiles

If you have any questions, our support team is always here to help.

Best wishes,
The MatchMate Team`}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Preview</Button>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card className="stat-card-shadow border-0">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Gateway Settings
                </CardTitle>
                <CardDescription>Configure payment gateway integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">RZP</span>
                        </div>
                        <div>
                          <p className="font-medium">Razorpay</p>
                          <p className="text-sm text-muted-foreground">Accept payments via Razorpay</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>API Key</Label>
                        <Input type="password" defaultValue="rzp_live_xxxxxxxxxxxxx" />
                      </div>
                      <div className="space-y-2">
                        <Label>Secret Key</Label>
                        <Input type="password" defaultValue="xxxxxxxxxxxxxxxxxxxxxxxx" />
                      </div>
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
                          <p className="text-sm text-muted-foreground">Accept international payments via Stripe</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Publishable Key</Label>
                        <Input type="password" placeholder="pk_live_xxxxxxxxxxxxx" />
                      </div>
                      <div className="space-y-2">
                        <Label>Secret Key</Label>
                        <Input type="password" placeholder="sk_live_xxxxxxxxxxxxx" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card className="stat-card-shadow border-0">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Social Login Settings
                </CardTitle>
                <CardDescription>Configure social login integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600 font-bold text-sm">G</span>
                        </div>
                        <div>
                          <p className="font-medium">Google</p>
                          <p className="text-sm text-muted-foreground">Allow users to sign in with Google</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Client ID</Label>
                        <Input type="password" defaultValue="xxxxxxxxxxxxx.apps.googleusercontent.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>Client Secret</Label>
                        <Input type="password" defaultValue="GOCSPX-xxxxxxxxxxxxx" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">F</span>
                        </div>
                        <div>
                          <p className="font-medium">Facebook</p>
                          <p className="text-sm text-muted-foreground">Allow users to sign in with Facebook</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>App ID</Label>
                        <Input type="password" placeholder="App ID" />
                      </div>
                      <div className="space-y-2">
                        <Label>App Secret</Label>
                        <Input type="password" placeholder="App Secret" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-600 font-bold text-sm">A</span>
                        </div>
                        <div>
                          <p className="font-medium">Apple</p>
                          <p className="text-sm text-muted-foreground">Allow users to sign in with Apple</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Service ID</Label>
                        <Input type="password" placeholder="Service ID" />
                      </div>
                      <div className="space-y-2">
                        <Label>Team ID</Label>
                        <Input type="password" placeholder="Team ID" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    // </AdminLayout>
  );
};

export default Settings;
