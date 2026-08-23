import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, FileText, Heart, Plus, MoreHorizontal, Eye, Edit, Trash2, Upload, Video, Camera, Youtube, ExternalLink, Power } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBannersAsync, setCurrentBanner, dataCountAsync } from "@/store/slices/bannerSlice";
import { fetchStoriesAsync, setCurrentStory } from "@/store/slices/successStorySlice";
import { fetchPagesAsync, setCurrentPage } from "@/store/slices/staticPageSlice";
import { Banner } from "@/services/bannerService";
import { SuccessStory } from "@/services/successStoryService";
import { StaticPage } from "@/services/staticPageService";
import { BannerAddDialog } from "@/components/cms/banners/BannerAddDialog";
import { BannerEditDialog } from "@/components/cms/banners/BannerEditDialog";
import { BannerDeleteDialog } from "@/components/cms/banners/BannerDeleteDialog";
import { StoryAddDialog } from "@/components/cms/stories/StoryAddDialog";
import { StoryEditDialog } from "@/components/cms/stories/StoryEditDialog";
import { StoryDeleteDialog } from "@/components/cms/stories/StoryDeleteDialog";
import { StaticPageAddDialog } from "@/components/cms/pages/StaticPageAddDialog";
import { StaticPageEditDialog } from "@/components/cms/pages/StaticPageEditDialog";
import { StaticPageDeleteDialog } from "@/components/cms/pages/StaticPageDeleteDialog";

import { ExploreAddDialog } from "@/components/cms/explore/ExploreAddDialog";
import { ExploreEditDialog } from "@/components/cms/explore/ExploreEditDialog";
import { ExploreDeleteDialog } from "@/components/cms/explore/ExploreDeleteDialog";
import { ExploreItem, exploreService } from "@/services/exploreService";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const CMS = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { banners, listLoading: bannersLoading, currentBanner, dataCount } = useAppSelector((state) => state.banner);
  const { stories, listLoading: storiesLoading, currentStory } = useAppSelector((state) => state.successStory);
  const { pages, listLoading: pagesLoading, currentPage } = useAppSelector((state) => state.staticPage);

  const [addBannerOpen, setAddBannerOpen] = useState(false);
  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [deleteBannerOpen, setDeleteBannerOpen] = useState(false);

  const [addStoryOpen, setAddStoryOpen] = useState(false);
  const [editStoryOpen, setEditStoryOpen] = useState(false);
  const [deleteStoryOpen, setDeleteStoryOpen] = useState(false);

  const [addPageOpen, setAddPageOpen] = useState(false);
  const [editPageOpen, setEditPageOpen] = useState(false);
  const [deletePageOpen, setDeletePageOpen] = useState(false);

  // Explore Gallery State
  const [exploreItems, setExploreItems] = useState<ExploreItem[]>([]);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [addExploreOpen, setAddExploreOpen] = useState(false);
  const [editExploreOpen, setEditExploreOpen] = useState(false);
  const [deleteExploreOpen, setDeleteExploreOpen] = useState(false);
  const [currentExploreItem, setCurrentExploreItem] = useState<ExploreItem | null>(null);

  const [activeTab, setActiveTab] = useState("banners");

  useEffect(() => {
    dispatch(dataCountAsync());
    fetchExploreItems();
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === "banners") {
      dispatch(fetchBannersAsync());
    } else if (activeTab === "stories") {
      dispatch(fetchStoriesAsync(undefined));
    } else if (activeTab === "pages") {
      dispatch(fetchPagesAsync());
    } else if (activeTab === "explore") {
      fetchExploreItems();
    }
  }, [activeTab, dispatch]);

  const fetchExploreItems = async () => {
    try {
      setExploreLoading(true);
      const data = await exploreService.getExploreItems();
      setExploreItems(data);
    } catch (err) {
      console.error("Failed to load explore items", err);
    } finally {
      setExploreLoading(false);
    }
  };

  const handleToggleExploreStatus = async (id: string) => {
    try {
      await exploreService.toggleExploreStatus(id);
      toast({ title: "Status Updated", description: "Explore item status changed" });
      fetchExploreItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update status", variant: "destructive" });
    }
  };

  const handleEditBanner = (banner: Banner) => {
    dispatch(setCurrentBanner(banner));
    setEditBannerOpen(true);
  };

  const handleDeleteBanner = (banner: Banner) => {
    dispatch(setCurrentBanner(banner));
    setDeleteBannerOpen(true);
  };

  const handleEditStory = (story: SuccessStory) => {
    dispatch(setCurrentStory(story));
    setEditStoryOpen(true);
  };

  const handleDeleteStory = (story: SuccessStory) => {
    dispatch(setCurrentStory(story));
    setDeleteStoryOpen(true);
  };

  const handleEditPage = (page: StaticPage) => {
    dispatch(setCurrentPage(page));
    setEditPageOpen(true);
  };

  const handleDeletePage = (page: StaticPage) => {
    dispatch(setCurrentPage(page));
    setDeletePageOpen(true);
  };

  const handleEditExplore = (item: ExploreItem) => {
    setCurrentExploreItem(item);
    setEditExploreOpen(true);
  };

  const handleDeleteExplore = (item: ExploreItem) => {
    setCurrentExploreItem(item);
    setDeleteExploreOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Content Management</h1>
          <p className="text-sm text-muted-foreground">Manage banners, static pages, success stories, and explore gallery</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50 p-1 flex-wrap h-auto gap-1">
          <TabsTrigger value="banners" className="flex items-center gap-2">
            Banners
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-semibold">
              {dataCount?.data?.banners || banners.length || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            Static Pages
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-semibold">
              {dataCount?.data?.staticPages || pages.length || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex items-center gap-2">
            Success Stories
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-semibold">
              {dataCount?.data?.successStories || stories.length || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="explore" className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            Explore Gallery
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-semibold">
              {exploreItems.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* BANNERS */}
        <TabsContent value="banners" className="space-y-4">
          <div className="flex justify-end">
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddBannerOpen(true)}>
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
                  {bannersLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : banners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No banners found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    banners.map((banner) => (
                      <TableRow key={banner._id} className="border-border/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-10 rounded overflow-hidden bg-muted">
                              {banner.imageUrl ? (
                                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{banner.title}</p>
                              <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{banner.targetUrl}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {banner.createdAt ? new Date(banner.createdAt).toLocaleDateString() : "Always Active"}
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
                              <DropdownMenuItem onClick={() => handleEditBanner(banner)}>
                                <Edit className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteBanner(banner)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STATIC PAGES */}
        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-end">
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddPageOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Page
            </Button>
          </div>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Page Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagesLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : pages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No static pages found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pages.map((page) => (
                      <TableRow key={page._id} className="border-border/50">
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell className="text-muted-foreground">{page.slug}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal text-xs">
                            {page.category || "Support"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              page.status !== "DRAFT"
                                ? "border-chart-green text-chart-green"
                                : "border-chart-orange text-chart-orange"
                            }
                          >
                            {page.status || "PUBLISHED"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{new Date(page.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEditPage(page)}>
                              <Edit className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeletePage(page)}>
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUCCESS STORIES */}
        <TabsContent value="stories" className="space-y-4">
          <div className="flex justify-end">
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddStoryOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Story
            </Button>
          </div>

          {storiesLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : stories.length === 0 ? (
            <div className="flex items-center justify-center p-12 text-muted-foreground border border-dashed rounded-lg">
              No success stories found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.map((story) => (
                <Card key={story._id} className="stat-card-shadow border-0 overflow-hidden group flex flex-col justify-between">
                  <div className="h-64 sm:h-72 overflow-hidden bg-muted flex items-center justify-center relative">
                    {story.imageUrl ? (
                      <img
                        src={story.imageUrl}
                        alt={story.coupleName}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Heart className="w-10 h-10 text-muted-foreground/30" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{story.coupleName}</h3>
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
                      <span className="text-xs text-muted-foreground">{new Date(story.date).toLocaleDateString()}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditStory(story)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteStory(story)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* EXPLORE GALLERY */}
        <TabsContent value="explore" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Manage wedding photos and YouTube Shorts video highlights shown on the user Explore gallery page.</p>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddExploreOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Photo / Video
            </Button>
          </div>

          {exploreLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : exploreItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg space-y-3">
              <Camera className="w-10 h-10 text-muted-foreground" />
              <div>
                <p className="font-semibold text-foreground">No Explore Items Found</p>
                <p className="text-xs text-muted-foreground">Upload marriage photos or add YouTube Shorts links to build trust with users.</p>
              </div>
              <Button onClick={() => setAddExploreOpen(true)} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Add First Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {exploreItems.map((item) => (
                <Card key={item._id} className="stat-card-shadow border-0 overflow-hidden group flex flex-col justify-between">
                  <div>
                    <div className="relative h-32 sm:h-36 overflow-hidden bg-black flex items-center justify-center">
                      {item.thumbnailUrl || item.imageUrl ? (
                        <img
                          src={item.thumbnailUrl || item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      )}

                      {item.type === "video" && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-red-600/90 flex items-center justify-center text-white shadow-md">
                            <Youtube className="w-4 h-4 fill-current" />
                          </div>
                        </div>
                      )}

                      <div className="absolute top-1.5 left-1.5 flex gap-1">
                        <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm text-[9px] uppercase tracking-wider border-0 px-1.5 py-0.5">
                          {item.type === "video" ? "Shorts" : "Photo"}
                        </Badge>
                      </div>

                      <div className="absolute top-1.5 right-1.5">
                        <Badge
                          className={`text-[9px] border-0 px-1.5 py-0.5 ${
                            item.status === "Active" ? "bg-chart-green text-white" : "bg-muted-foreground text-white"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-2.5 space-y-1">
                      <div>
                        <h4 className="font-semibold text-xs leading-tight line-clamp-1" title={item.title}>
                          {item.title}
                        </h4>
                        {item.coupleName && (
                          <p className="text-[11px] text-primary font-medium line-clamp-1">{item.coupleName}</p>
                        )}
                      </div>
                    </CardContent>
                  </div>

                  <div className="px-2.5 pb-2.5 pt-1.5 border-t flex items-center justify-between text-xs">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1.5 text-[10px]"
                      onClick={() => handleToggleExploreStatus(item._id)}
                    >
                      <Power className={`w-3 h-3 mr-1 ${item.status === "Active" ? "text-chart-green" : "text-muted-foreground"}`} />
                      {item.status === "Active" ? "Active" : "Off"}
                    </Button>

                    <div className="flex gap-0.5">
                      {item.youtubeUrl && (
                        <a href={item.youtubeUrl} target="_blank" rel="noreferrer" title="Open YouTube Link">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </a>
                      )}
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditExplore(item)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeleteExplore(item)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Banner Dialogs */}
      <BannerAddDialog open={addBannerOpen} onOpenChange={setAddBannerOpen} />
      <BannerEditDialog open={editBannerOpen} onOpenChange={setEditBannerOpen} banner={currentBanner} />
      <BannerDeleteDialog open={deleteBannerOpen} onOpenChange={setDeleteBannerOpen} banner={currentBanner} />

      {/* Story Dialogs */}
      <StoryAddDialog open={addStoryOpen} onOpenChange={setAddStoryOpen} />
      <StoryEditDialog open={editStoryOpen} onOpenChange={setEditStoryOpen} story={currentStory} />
      <StoryDeleteDialog open={deleteStoryOpen} onOpenChange={setDeleteStoryOpen} story={currentStory} />

      {/* Static Page Dialogs */}
      <StaticPageAddDialog open={addPageOpen} onOpenChange={setAddPageOpen} />
      <StaticPageEditDialog open={editPageOpen} onOpenChange={setEditPageOpen} page={currentPage} />
      <StaticPageDeleteDialog open={deletePageOpen} onOpenChange={setDeletePageOpen} page={currentPage} />

      {/* Explore Dialogs */}
      <ExploreAddDialog open={addExploreOpen} onOpenChange={setAddExploreOpen} onSuccess={fetchExploreItems} />
      <ExploreEditDialog open={editExploreOpen} onOpenChange={setEditExploreOpen} item={currentExploreItem} onSuccess={fetchExploreItems} />
      <ExploreDeleteDialog open={deleteExploreOpen} onOpenChange={setDeleteExploreOpen} item={currentExploreItem} onSuccess={fetchExploreItems} />
    </div>
  );
};

export default CMS;
