// import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, FileText, Heart, Plus, MoreHorizontal, Eye, Edit, Trash2, Upload } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const banners = [
  {
    id: 1,
    title: "Find Your Soulmate",
    subtitle: "Join thousands of happy couples",
    image: "banner-1.jpg",
    targetUrl: "/register",
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
  {
    id: 2,
    title: "Premium Membership Sale",
    subtitle: "50% off on all plans this month",
    image: "banner-2.jpg",
    targetUrl: "/pricing",
    status: "Active",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
  },
  {
    id: 3,
    title: "Valentine's Special",
    subtitle: "Celebrate love with us",
    image: "banner-3.jpg",
    targetUrl: "/valentine",
    status: "Inactive",
    startDate: "2024-02-01",
    endDate: "2024-02-14",
  },
];

const staticPages = [
  { id: 1, title: "About Us", slug: "/about-us", lastUpdated: "2024-03-10" },
  { id: 2, title: "Privacy Policy", slug: "/privacy-policy", lastUpdated: "2024-02-15" },
  { id: 3, title: "Terms & Conditions", slug: "/terms-conditions", lastUpdated: "2024-02-15" },
  { id: 4, title: "FAQ", slug: "/faq", lastUpdated: "2024-03-01" },
  { id: 5, title: "Contact Us", slug: "/contact-us", lastUpdated: "2024-01-20" },
];

const successStories = [
  {
    id: 1,
    coupleNames: "Rahul & Priya",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop",
    story: "We met on MatchMate and instantly connected. After 6 months of dating, we got married!",
    date: "2024-02-14",
    status: "Published",
  },
  {
    id: 2,
    coupleNames: "Amit & Sneha",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&h=200&fit=crop",
    story: "MatchMate's matchmaking helped us find each other. We're grateful for this platform!",
    date: "2024-01-20",
    status: "Published",
  },
  {
    id: 3,
    coupleNames: "Vikram & Anjali",
    image: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=300&h=200&fit=crop",
    story: "From a simple interest to a beautiful wedding. Thank you MatchMate!",
    date: "2024-03-05",
    status: "Pending",
  },
];

const CMS = () => {
  return (
    // <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Content Management</h1>
            <p className="text-sm text-muted-foreground">Manage banners, pages, and success stories</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Banners</p>
                <p className="text-xl font-semibold text-foreground">2</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-chart-orange" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Static Pages</p>
                <p className="text-xl font-semibold text-foreground">5</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-chart-green" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Success Stories</p>
                <p className="text-xl font-semibold text-foreground">156</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="banners" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="pages">Static Pages</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="banners" className="space-y-4">
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Banner
              </Button>
            </div>
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Banner</TableHead>
                      <TableHead>Target URL</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banners.map((banner) => (
                      <TableRow key={banner.id} className="border-border/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{banner.title}</p>
                            <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{banner.targetUrl}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {banner.startDate} - {banner.endDate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              banner.status === "Active"
                                ? "border-chart-green text-chart-green"
                                : "border-muted-foreground text-muted-foreground"
                            }
                          >
                            {banner.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" /> Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-4">
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Page Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staticPages.map((page) => (
                      <TableRow key={page.id} className="border-border/50">
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell className="text-muted-foreground">{page.slug}</TableCell>
                        <TableCell className="text-muted-foreground">{page.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories" className="space-y-4">
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Story
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {successStories.map((story) => (
                <Card key={story.id} className="stat-card-shadow border-0 overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.coupleNames}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{story.coupleNames}</h3>
                      <Badge
                        variant="outline"
                        className={
                          story.status === "Published"
                            ? "border-chart-green text-chart-green"
                            : "border-chart-orange text-chart-orange"
                        }
                      >
                        {story.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{story.story}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{story.date}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    // </AdminLayout>
  );
};

export default CMS;
