import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userService } from "@/services/userService";
import { masterDataService, MasterItem } from "@/services/masterDataService";
import { 
  Loader2, Search, Heart, User, MapPin, Award, Trash2, PlusCircle, 
  Sparkles, CheckCircle2, XCircle, ArrowLeft,
  Calendar, Briefcase, GraduationCap, Eye, UserCheck, UserMinus, Info
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MillionClubMatchPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("suggested");
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [religions, setReligions] = useState<MasterItem[]>([]);
  const [educationLevels, setEducationLevels] = useState<MasterItem[]>([]);
  const [preferences, setPreferences] = useState<any>({
    ageRange: { min: 18, max: 50 },
    heightRangeCm: { min: 140, max: 210 },
    religions: [],
    educationLevels: [],
    interests: []
  });
  
  const [suggestedMatches, setSuggestedMatches] = useState<any[]>([]);
  const [receivedInterests, setReceivedInterests] = useState<any[]>([]);
  const [sentInterests, setSentInterests] = useState<any[]>([]);
  const [acceptedMatches, setAcceptedMatches] = useState<any[]>([]);
  
  // Detail selection states
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [interestInput, setInterestInput] = useState("");
  const [dataLoading, setDataLoading] = useState({
    user: true,
    suggested: false,
    received: false,
    sent: false,
    preferences: false
  });

  useEffect(() => {
    if (id) {
      fetchInitialData();
    }
  }, [id]);

  const fetchInitialData = async () => {
    if (!id) return;
    setDataLoading(prev => ({ ...prev, user: true }));
    try {
      const [user, rels, edus, prefs] = await Promise.all([
        userService.getUserById(id),
        masterDataService.getItems("religions", { take: 100 }),
        masterDataService.getItems("higherEducations", { take: 100 }),
        userService.getUserPreference(id)
      ]);
      
      setCurrentUser(user);
      setReligions(rels.data || []);
      setEducationLevels(edus.data || []);
      
      if (prefs) {
        setPreferences({
          ageRange: prefs.ageRange || { min: 18, max: 50 },
          heightRangeCm: prefs.heightRangeCm || { min: 140, max: 210 },
          religions: prefs.religions || [],
          educationLevels: prefs.educationLevels || [],
          interests: prefs.interests || []
        });
      }
      
      // Fetch dynamic content
      fetchSuggestedMatches();
      fetchInterests();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load matching workspace");
    } finally {
      setDataLoading(prev => ({ ...prev, user: false }));
    }
  };

  const fetchSuggestedMatches = async () => {
    if (!id) return;
    setDataLoading(prev => ({ ...prev, suggested: true }));
    try {
      const res = await userService.getUserMatches(id, { limit: 50 });
      setSuggestedMatches(res.data || []);
    } catch (error) {
      toast.error("Failed to load suggested matches");
    } finally {
      setDataLoading(prev => ({ ...prev, suggested: false }));
    }
  };

  const fetchInterests = async () => {
    if (!id) return;
    setDataLoading(prev => ({ ...prev, received: true, sent: true }));
    try {
      const [received, sent] = await Promise.all([
        userService.getUserInterests(id, 'received'),
        userService.getUserInterests(id, 'sent')
      ]);
      setReceivedInterests(received || []);
      setSentInterests(sent || []);
      
      // Filter accepted matches from interests
      const accepted = [
        ...received.filter((i: any) => i.status === "ACCEPTED").map((i: any) => ({ ...i, partner: i.fromUser })),
        ...sent.filter((i: any) => i.status === "ACCEPTED").map((i: any) => ({ ...i, partner: i.toUser }))
      ];
      setAcceptedMatches(accepted);
    } catch (error) {
      toast.error("Failed to load interests");
    } finally {
      setDataLoading(prev => ({ ...prev, received: false, sent: false }));
    }
  };

  const fetchUserDetails = async (userId: string) => {
    setDetailLoading(true);
    setIsDetailOpen(true);
    try {
      const res = await userService.getUserById(userId);
      setSelectedUserForDetail(res);
    } catch (error) {
      toast.error("Failed to load user details");
      setIsDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSendInterest = async (e: React.MouseEvent, targetUserId: string) => {
    e.stopPropagation();
    if (!id) return;
    try {
      await userService.sendInterest(id, targetUserId);
      toast.success("Interest sent successfully");
      fetchInterests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send interest");
    }
  };

  const handleManageInterest = async (e: React.MouseEvent, interestId: string, action: 'accept' | 'reject') => {
    e.stopPropagation();
    if (!id) return;
    try {
      await userService.manageInterest(id, interestId, action);
      toast.success(`Invitation ${action}ed`);
      fetchInterests();
    } catch (error) {
      toast.error(`Failed to ${action} invitation`);
    }
  };

  const handleSavePreferences = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await userService.updateUserPreference(id, preferences);
      toast.success("Preferences updated");
      fetchSuggestedMatches();
      setActiveTab("suggested");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob?: string | Date) => {
    if (!dob) return "N/A";
    const dobDate = typeof dob === 'string' ? new Date(dob) : dob;
    const age = Math.floor((Date.now() - dobDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return age;
  };

  const UserCard = ({ user, score, status, interestId, isReceived, isAccepted }: any) => {
    const age = calculateAge(user?.dateOfBirth);
    const isSelectedFiltered = selectedUserForDetail?._id === user?._id;
    
    return (
      <Card 
        className={cn(
          "overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer",
          isSelectedFiltered ? "border-primary ring-1 ring-primary/20 bg-primary/[0.02]" : "bg-card/50"
        )}
        onClick={() => fetchUserDetails(user._id)}
      >
        <div className="flex flex-col sm:flex-row h-full scale-w-full">
          <div className="w-full sm:w-32 h-40 sm:h-auto relative shrink-0">
            <Avatar className="w-full h-full rounded-none">
              {user?.photos?.[0] ? (
                <AvatarImage src={user.photos[0].url} className="object-cover" />
              ) : (
                <AvatarFallback className="rounded-none text-xl">{user?.fullName?.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            {score && (
              <div className="absolute top-1 left-1 bg-primary/90 text-primary-foreground text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg flex items-center gap-0.5 backdrop-blur-sm">
                <Sparkles className="w-2.5 h-2.5" />
                {score}%
              </div>
            )}
            {status && !isAccepted && (
              <div className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                status === 'PENDING' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              }`}>
                {status}
              </div>
            )}
          </div>
          
          <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-1">
                <h3 className="font-bold text-sm leading-tight truncate">{user?.fullName}</h3>
                {isAccepted && (
                  <Badge className="bg-emerald-500 h-4 text-[9px] px-1.5">Matched</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <User className="w-3 h-3 text-primary/70 shrink-0" />
                  <span className="truncate">{age} yrs • {user?.gender} • {user?.heightCm}cm</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3 h-3 text-primary/70 shrink-0" />
                  <span className="truncate">{user?.city?.name || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Award className="w-3 h-3 text-primary/70 shrink-0" />
                  <span className="truncate">{user?.highestEducation?.name || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-border/50 flex gap-2">
              <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1 gap-1.5 text-[10px] h-7 font-medium"
              >
                  <Eye className="w-3 h-3" /> View Profile
              </Button>
              
              {!interestId && !isAccepted ? (
                <Button 
                  size="sm" 
                  className="flex-1 gap-1.5 text-[10px] h-7 font-medium"
                  onClick={(e) => handleSendInterest(e, user._id)}
                >
                  <Heart className="w-3 h-3" /> Connect
                </Button>
              ) : isReceived && status === 'PENDING' ? (
                <div className="flex gap-1 flex-1">
                   <Button 
                    size="sm" 
                    variant="default" 
                    className="flex-1 h-7 bg-emerald-600 hover:bg-emerald-700 p-0"
                    onClick={(e) => handleManageInterest(e, interestId, 'accept')}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 h-7 border-red-200 text-red-500 hover:bg-red-50 p-0"
                    onClick={(e) => handleManageInterest(e, interestId, 'reject')}
                  >
                    <XCircle className="w-3 h-3" />
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const UserDetailPanelView = () => {
    return (
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold">User Profile Details</DialogTitle>
            <DialogDescription>Full comprehensive profile information</DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            {detailLoading ? (
              <div className="h-64 flex items-center justify-center p-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Fetching full profile...</p>
                </div>
              </div>
            ) : !selectedUserForDetail ? (
              <div className="h-64 flex flex-col items-center justify-center p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Info className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">No User Selected</h3>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-full max-h-[calc(90vh-100px)]">
                <div className="p-6 space-y-8">
                  {/* ... existing content ... */}
                  {/* Cover/Avatar */}
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="aspect-video sm:aspect-square md:aspect-[16/9] rounded-2xl overflow-hidden bg-muted border">
                        {selectedUserForDetail.photos?.[0] ? (
                          <img src={selectedUserForDetail.photos[0].url} className="w-full h-full object-cover" alt={selectedUserForDetail.fullName} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground font-bold italic bg-primary/5">
                            No Photo
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedUserForDetail.fullName}</h2>
                        <div className="flex items-center gap-2 text-primary font-medium mt-1">
                          <span>{selectedUserForDetail.profession?.name || "Professional"}</span>
                          <span className="w-1 h-1 rounded-full bg-primary/40"></span>
                          <span>{selectedUserForDetail.city?.name || selectedUserForDetail.city || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-muted/30 border-none">
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Personal</Label>
                      <div className="mt-2 text-sm font-semibold space-y-1">
                        <p className="flex justify-between"><span>Age:</span> <span className="text-primary">{calculateAge(selectedUserForDetail.dateOfBirth)} Years</span></p>
                        <p className="flex justify-between"><span>Height:</span> <span className="text-primary">{selectedUserForDetail.heightCm} cm</span></p>
                        <p className="flex justify-between"><span>Gender:</span> <span className="text-primary capitalize">{selectedUserForDetail.gender}</span></p>
                        <p className="flex justify-between"><span>Marital:</span> <span className="text-primary">{selectedUserForDetail.maritalStatus || "Single"}</span></p>
                      </div>
                    </Card>
                    <Card className="p-4 bg-muted/30 border-none">
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Background</Label>
                      <div className="mt-2 text-sm font-semibold space-y-1">
                        <p className="flex justify-between"><span>Religion:</span> <span className="text-primary">{selectedUserForDetail.religion?.name || selectedUserForDetail.religion || "N/A"}</span></p>
                        <p className="flex justify-between"><span>Caste:</span> <span className="text-primary">{selectedUserForDetail.caste?.name || selectedUserForDetail.caste || "N/A"}</span></p>
                        <p className="flex justify-between"><span>Mother Tongue:</span> <span className="text-primary">{selectedUserForDetail.motherTongue?.name || selectedUserForDetail.motherTongue || "N/A"}</span></p>
                        <p className="flex justify-between"><span>Income:</span> <span className="text-primary tracking-tighter">{selectedUserForDetail.income?.amount ? `${selectedUserForDetail.income.amount} ${selectedUserForDetail.income.type}` : "N/A"}</span></p>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6 pb-6">
                    <section className="space-y-3">
                      <h4 className="font-bold flex items-center gap-2 text-sm border-b pb-2">
                        <GraduationCap className="w-4 h-4 text-primary" /> Education & Career
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-muted/20 p-3 rounded-lg border border-border/50">
                          <p className="text-xs text-muted-foreground">Highest Qualification</p>
                          <p className="text-sm font-bold mt-0.5">{selectedUserForDetail.highestEducation?.name || "N/A"}</p>
                        </div>
                        <div className="bg-muted/20 p-3 rounded-lg border border-border/50">
                          <p className="text-xs text-muted-foreground">Current Profession</p>
                          <p className="text-sm font-bold mt-0.5">{selectedUserForDetail.profession?.name || "N/A"}</p>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-3">
                      <h4 className="font-bold flex items-center gap-2 text-sm border-b pb-2">
                        <Search className="w-4 h-4 text-primary" /> Interests & Lifestyle
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUserForDetail.interests?.length > 0 ? selectedUserForDetail.interests.map((it: string) => (
                          <Badge key={it} variant="outline" className="bg-primary/[0.03] border-primary/20 text-primary font-medium">{it}</Badge>
                        )) : <span className="text-sm text-muted-foreground italic">No interests listed</span>}
                      </div>
                    </section>
                    
                    <section className="space-y-3">
                      <h4 className="font-bold flex items-center gap-2 text-sm border-b pb-2">
                        <Info className="w-4 h-4 text-primary" /> About Personal Details
                      </h4>
                      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap italic bg-muted/10 p-4 rounded-xl">
                         {selectedUserForDetail.aboutMe || "No detailed bio available."}
                      </div>
                    </section>
                  </div>
                </div>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (dataLoading.user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6 animate-fade-in p-2 md:p-6 bg-muted/5 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 px-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/million")} className="rounded-full bg-background border shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-2 border-primary/20 shadow-md">
              {currentUser?.photos?.[0] ? (
                <AvatarImage src={currentUser.photos[0].url} className="object-cover" />
              ) : (
                <AvatarFallback className="text-xl">{currentUser?.fullName?.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {currentUser?.fullName}
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Million Club</Badge>
              </h1>
              <p className="text-sm text-muted-foreground leading-none mt-1">Assistant Matching Workspace • {currentUser?.email}</p>
            </div>
          </div>
        </div>
        <div className="flex bg-background border rounded-lg p-1 shadow-sm">
          <div className="px-3 py-1 text-center border-r">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Accepted</p>
            <p className="text-lg font-bold text-emerald-600 leading-none mt-0.5">{acceptedMatches.length}</p>
          </div>
          <div className="px-3 py-1 text-center">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Pending Requests</p>
            <p className="text-lg font-bold text-orange-500 leading-none mt-0.5">{receivedInterests.filter(i => i.status === 'PENDING').length}</p>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 min-h-0 flex gap-6 overflow-hidden">
        {/* Left Side: Tabs and Lists */}
        <div className="flex-1 min-h-0 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col">
            <TabsList className="bg-background border p-1 self-start shadow-sm mb-4">
              <TabsTrigger value="suggested" className="gap-2 px-4 focus-visible:ring-0">
                <Sparkles className="w-3.5 h-3.5" /> Suggested
              </TabsTrigger>
              <TabsTrigger value="received" className="gap-2 px-4 relative focus-visible:ring-0">
                <Heart className="w-3.5 h-3.5" /> Received
                {receivedInterests.filter(i => i.status === 'PENDING').length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold border-2 border-background">
                    {receivedInterests.filter(i => i.status === 'PENDING').length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent" className="gap-2 px-4 focus-visible:ring-0">
                <UserCheck className="w-3.5 h-3.5" /> Sent
              </TabsTrigger>
              <TabsTrigger value="accepted" className="gap-2 px-4 focus-visible:ring-0">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Accepted
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2 px-4 focus-visible:ring-0">
                <Search className="w-3.5 h-3.5" /> Preferences
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden bg-background rounded-2xl border shadow-sm flex flex-col">
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-6">
                  {/* TAB: SUGGESTED */}
                  <TabsContent value="suggested" className="m-0 border-none p-0 outline-none">
                    {dataLoading.suggested ? (
                      <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                    ) : suggestedMatches.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center text-center opacity-60">
                        <Search className="w-12 h-12 mb-2" />
                        <p className="font-medium text-lg">No matches found</p>
                        <p className="text-sm">Try relaxing some partner preferences.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {suggestedMatches.map(item => (
                          <UserCard 
                            key={item.user?._id} 
                            user={item.user} 
                            score={item.matchPercentage}
                            status={sentInterests.find(i => i.toUser?._id === item.user?._id)?.status}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB: RECEIVED */}
                  <TabsContent value="received" className="m-0 border-none p-0 outline-none">
                    {receivedInterests.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center text-center opacity-60">
                        <Heart className="w-12 h-12 mb-2" />
                        <p className="font-medium text-lg">No invitations received</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {receivedInterests.map(item => (
                          <UserCard 
                            key={item._id} 
                            user={item.fromUser} 
                            status={item.status}
                            interestId={item._id}
                            isReceived={true}
                            isAccepted={item.status === 'ACCEPTED'}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB: SENT */}
                  <TabsContent value="sent" className="m-0 border-none p-0 outline-none">
                    {sentInterests.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center text-center opacity-60">
                        <UserCheck className="w-12 h-12 mb-2" />
                        <p className="font-medium text-lg">No invitations sent</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {sentInterests.map(item => (
                          <UserCard 
                            key={item._id} 
                            user={item.toUser} 
                            status={item.status}
                            interestId={item._id}
                            isAccepted={item.status === 'ACCEPTED'}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB: ACCEPTED */}
                  <TabsContent value="accepted" className="m-0 border-none p-0 outline-none">
                    {acceptedMatches.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center text-center opacity-60">
                        <CheckCircle2 className="w-12 h-12 mb-2" />
                        <p className="font-medium text-lg">No accepted matches yet</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {acceptedMatches.map(item => (
                          <UserCard 
                            key={item._id} 
                            user={item.partner} 
                            isAccepted={true}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB: PREFERENCES */}
                  <TabsContent value="preferences" className="m-0 border-none p-0 outline-none">
                         <div className="max-w-3xl mx-auto space-y-10 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Age Range */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold flex justify-between">Age Range <Badge variant="secondary" className="font-mono">{preferences.ageRange.min}-{preferences.ageRange.max}</Badge></Label>
                                    <div className="flex gap-4">
                                        <Input type="number" value={preferences.ageRange.min} onChange={(e) => setPreferences((p:any) => ({...p, ageRange: {...p.ageRange, min: parseInt(e.target.value) || 18 }}))}/>
                                        <Input type="number" value={preferences.ageRange.max} onChange={(e) => setPreferences((p:any) => ({...p, ageRange: {...p.ageRange, max: parseInt(e.target.value) || 50 }}))}/>
                                    </div>
                                </div>
                                 {/* Height Range */}
                                 <div className="space-y-3">
                                    <Label className="text-sm font-bold flex justify-between">Height (cm) <Badge variant="secondary" className="font-mono">{preferences.heightRangeCm.min}-{preferences.heightRangeCm.max}</Badge></Label>
                                    <div className="flex gap-4">
                                        <Input type="number" value={preferences.heightRangeCm.min} onChange={(e) => setPreferences((p:any) => ({...p, heightRangeCm: {...p.heightRangeCm, min: parseInt(e.target.value) || 140 }}))}/>
                                        <Input type="number" value={preferences.heightRangeCm.max} onChange={(e) => setPreferences((p:any) => ({...p, heightRangeCm: {...p.heightRangeCm, max: parseInt(e.target.value) || 210 }}))}/>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold">Preferred Religions</Label>
                                    <div className="grid grid-cols-2 gap-3 p-4 bg-muted/20 rounded-xl border border-dashed">
                                        {religions.map(r => (
                                            <div key={r._id} className="flex items-center space-x-2">
                                                <Checkbox id={r._id} checked={preferences.religions.includes(r._id)} onCheckedChange={(c) => setPreferences((p:any) => ({...p, religions: c ? [...p.religions, r._id] : p.religions.filter((i:string)=>i!==r._id)}))}/>
                                                <label htmlFor={r._id} className="text-xs font-medium cursor-pointer">{r.name}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold">Interests Filter</Label>
                                    <div className="flex gap-2">
                                        <Input placeholder="Add..." value={interestInput} onChange={e => setInterestInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (()=>{ if(interestInput){setPreferences((p:any)=>({...p, interests: [...p.interests, interestInput]})); setInterestInput("") } })()} />
                                        <Button size="icon" onClick={() => { if(interestInput){setPreferences((p:any)=>({...p, interests: [...p.interests, interestInput]})); setInterestInput("") } }}><PlusCircle/></Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 p-3 bg-muted/10 border-2 border-dotted rounded-xl min-h-[50px]">
                                        {preferences.interests.map((it:string) => (
                                            <Badge key={it} variant="secondary" className="flex items-center gap-2 pr-1">{it} <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full" onClick={() => setPreferences((p:any)=>({...p, interests: p.interests.filter((i:string)=>i!==it)}))}><Trash2 className="w-2.5 h-2.5"/></Button></Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full shadow-lg font-bold h-11" onClick={handleSavePreferences} disabled={loading}>
                                {loading && <Loader2 className="animate-spin mr-2"/>} Update Preferences & Search
                            </Button>
                         </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </div>
      <UserDetailPanelView />
    </div>
  );
}
