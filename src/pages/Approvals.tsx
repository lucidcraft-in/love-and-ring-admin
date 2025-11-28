import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, CheckCircle, XCircle, Eye, Clock, ImageIcon, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const pendingProfiles = [
  {
    id: 1,
    name: "Meera Krishnan",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face",
    age: 25,
    location: "Chennai, India",
    education: "MBA",
    occupation: "Marketing Manager",
    submittedAt: "2 hours ago",
    type: "New Profile",
  },
  {
    id: 2,
    name: "Arjun Nair",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    age: 29,
    location: "Kochi, India",
    education: "B.Tech",
    occupation: "Software Engineer",
    submittedAt: "4 hours ago",
    type: "Profile Update",
  },
  {
    id: 3,
    name: "Divya Sharma",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    age: 27,
    location: "Jaipur, India",
    education: "B.Com",
    occupation: "Chartered Accountant",
    submittedAt: "6 hours ago",
    type: "New Profile",
  },
];

const pendingPhotos = [
  {
    id: 1,
    user: "Rahul Mehta",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    photoCount: 3,
    submittedAt: "1 hour ago",
  },
  {
    id: 2,
    user: "Pooja Singh",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    photoCount: 5,
    submittedAt: "3 hours ago",
  },
];

const pendingDocuments = [
  {
    id: 1,
    user: "Karthik Reddy",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    docType: "ID Proof",
    submittedAt: "5 hours ago",
  },
  {
    id: 2,
    user: "Lakshmi Iyer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    docType: "Education Certificate",
    submittedAt: "8 hours ago",
  },
];

const Approvals = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Approvals</h1>
            <p className="text-sm text-muted-foreground">Review and approve pending submissions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-chart-orange" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Profiles</p>
                <p className="text-xl font-semibold text-foreground">156</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Photos</p>
                <p className="text-xl font-semibold text-foreground">89</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Documents</p>
                <p className="text-xl font-semibold text-foreground">34</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-chart-green" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Approved Today</p>
                <p className="text-xl font-semibold text-foreground">245</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profiles" className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="new">New Profile</SelectItem>
                  <SelectItem value="update">Profile Update</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="profiles" className="space-y-4">
            {pendingProfiles.map((profile) => (
              <Card key={profile.id} className="stat-card-shadow border-0">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{profile.name}</h3>
                          <Badge variant="outline" className="text-xs">{profile.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{profile.age} years • {profile.location}</p>
                        <p className="text-sm text-muted-foreground">{profile.education} • {profile.occupation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground mr-2">{profile.submittedAt}</span>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button size="sm" className="bg-chart-green hover:bg-chart-green/90">
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            {pendingPhotos.map((item) => (
              <Card key={item.id} className="stat-card-shadow border-0">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{item.user}</h3>
                        <p className="text-sm text-muted-foreground">{item.photoCount} photos pending</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground mr-2">{item.submittedAt}</span>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" /> Review
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                        <XCircle className="w-4 h-4 mr-1" /> Reject All
                      </Button>
                      <Button size="sm" className="bg-chart-green hover:bg-chart-green/90">
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            {pendingDocuments.map((item) => (
              <Card key={item.id} className="stat-card-shadow border-0">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{item.user}</h3>
                        <p className="text-sm text-muted-foreground">{item.docType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground mr-2">{item.submittedAt}</span>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" /> View Document
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button size="sm" className="bg-chart-green hover:bg-chart-green/90">
                        <CheckCircle className="w-4 h-4 mr-1" /> Verify
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Approvals;
