import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userService } from "@/services/userService";
import { masterDataService, MasterItem } from "@/services/masterDataService";
import { Loader2, Search, Heart, User, MapPin, Award, Trash2, PlusCircle, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface FindMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

export function FindMatchDialog({ open, onOpenChange, user }: FindMatchDialogProps) {
  const [activeTab, setActiveTab] = useState("matches");
  const [loading, setLoading] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [matchesLoading, setMatchesLoading] = useState(false);
  
  const [religions, setReligions] = useState<MasterItem[]>([]);
  const [educationLevels, setEducationLevels] = useState<MasterItem[]>([]);
  
  const [preferences, setPreferences] = useState<any>({
    ageRange: { min: 18, max: 50 },
    heightRangeCm: { min: 140, max: 210 },
    religions: [],
    educationLevels: [],
    interests: []
  });
  
  const [matches, setMatches] = useState<any[]>([]);
  const [interestInput, setInterestInput] = useState("");

  useEffect(() => {
    if (open && user) {
      fetchMasterData();
      fetchUserPreferences();
    }
  }, [open, user]);

  const fetchMasterData = async () => {
    try {
      const relRes = await masterDataService.getItems("religions", { take: 100 });
      const eduRes = await masterDataService.getItems("higherEducations", { take: 100 });
      setReligions(relRes.data || []);
      setEducationLevels(eduRes.data || []);
    } catch (error) {
      console.error("Error fetching master data:", error);
    }
  };

  const fetchUserPreferences = async () => {
    if (!user?._id) return;
    setPreferencesLoading(true);
    try {
      const data = await userService.getUserPreference(user._id);
      if (data) {
        setPreferences({
          ageRange: data.ageRange || { min: 18, max: 50 },
          heightRangeCm: data.heightRangeCm || { min: 140, max: 210 },
          religions: data.religions || [],
          educationLevels: data.educationLevels || [],
          interests: data.interests || []
        });
        // After fetching preferences, fetch matches
        fetchMatches(user._id);
      } else {
        // If no preferences, set default and still try to fetch matches (though they might be empty)
        fetchMatches(user._id);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      toast.error("Failed to load partner preferences");
    } finally {
      setPreferencesLoading(false);
    }
  };

  const fetchMatches = async (userId: string) => {
    setMatchesLoading(true);
    try {
      const res = await userService.getUserMatches(userId, { limit: 20 });
      setMatches(res.data || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to load matches");
    } finally {
      setMatchesLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      await userService.updateUserPreference(user._id, preferences);
      toast.success("Preferences updated successfully");
      fetchMatches(user._id);
      setActiveTab("matches");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const toggleReligion = (id: string) => {
    setPreferences((prev: any) => ({
      ...prev,
      religions: prev.religions.includes(id)
        ? prev.religions.filter((r: string) => r !== id)
        : [...prev.religions, id]
    }));
  };

  const toggleEducation = (id: string) => {
    setPreferences((prev: any) => ({
      ...prev,
      educationLevels: prev.educationLevels.includes(id)
        ? prev.educationLevels.filter((e: string) => e !== id)
        : [...prev.educationLevels, id]
    }));
  };

  const addInterest = () => {
    if (interestInput && !preferences.interests.includes(interestInput)) {
      setPreferences((prev: any) => ({
        ...prev,
        interests: [...prev.interests, interestInput]
      }));
      setInterestInput("");
    }
  };

  const removeInterest = (interest: string) => {
    setPreferences((prev: any) => ({
      ...prev,
      interests: prev.interests.filter((i: string) => i !== interest)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              {user?.photos?.[0]?.url ? (
                <AvatarImage src={user.photos[0].url} className="object-cover" />
              ) : (
                <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                Find Match for {user?.fullName}
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                  Million Club
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Customize preferences to find the perfect partner
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 border-b">
            <TabsList className="bg-transparent h-12 p-0 gap-6 w-full justify-start">
              <TabsTrigger 
                value="matches" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2"
              >
                Potential Matches ({matches.length})
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2"
              >
                Partner Preferences
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {/* MATCHES CONTENT */}
            <TabsContent value="matches" className="h-full m-0 focus-visible:ring-0">
              <ScrollArea className="h-full p-6">
                {matchesLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground font-medium">Finding best matches...</p>
                  </div>
                ) : matches.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">No matches found</p>
                      <p className="text-sm text-muted-foreground max-w-sm px-4">
                        Try adjusting the partner preferences to expand the search results.
                      </p>
                    </div>
                    <Button onClick={() => setActiveTab("preferences")} variant="outline" className="mt-2">
                      Edit Preferences
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matches.map((item) => (
                      <div 
                        key={item.user?._id} 
                        className="group relative flex gap-4 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300"
                      >
                        <div className="relative">
                          <Avatar className="w-20 h-24 rounded-lg">
                            {item.user?.photos?.[0] ? (
                              <AvatarImage src={item.user.photos[0].url} className="object-cover" />
                            ) : (
                              <AvatarFallback className="rounded-lg">{item.user?.fullName?.charAt(0)}</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            {item.matchPercentage}%
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-base truncate">{item.user?.fullName}</h4>
                          </div>
                          
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {calculateAge(item.user?.dateOfBirth)}, {item.user?.heightCm}cm
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.user?.city?.name || "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {item.user?.highestEducation?.name || "N/A"}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.user?.interests?.slice(0, 3).map((interest: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-[10px] py-0 px-1.5 font-normal h-5 border-none bg-muted/60">
                                {interest}
                              </Badge>
                            ))}
                            {(item.user?.interests?.length || 0) > 3 && (
                              <span className="text-[10px] text-muted-foreground self-center">
                                +{item.user.interests.length - 3}
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline" className="h-8 text-xs flex-1 border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary">
                               View Profile
                            </Button>
                            <Button size="sm" className="h-8 text-xs flex-1 gap-1.5">
                                <Heart className="w-3 h-3 fill-current" />
                                Send Interest
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* PREFERENCES CONTENT */}
            <TabsContent value="preferences" className="h-full m-0 focus-visible:ring-0">
              <ScrollArea className="h-full p-6">
                <div className="space-y-8 pb-4">
                  {/* Age and Height */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold flex items-center justify-between">
                        Age Range
                        <Badge variant="secondary" className="font-mono">{preferences.ageRange.min} - {preferences.ageRange.max} Years</Badge>
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Minimum</span>
                          <Input 
                            type="number" 
                            min={18} 
                            max={preferences.ageRange.max} 
                            value={preferences.ageRange.min}
                            onChange={(e) => setPreferences((p: any) => ({ ...p, ageRange: { ...p.ageRange, min: parseInt(e.target.value) || 18 }}))}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Maximum</span>
                          <Input 
                            type="number" 
                            min={preferences.ageRange.min} 
                            max={80} 
                            value={preferences.ageRange.max}
                            onChange={(e) => setPreferences((p: any) => ({ ...p, ageRange: { ...p.ageRange, max: parseInt(e.target.value) || 50 }}))}
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-semibold flex items-center justify-between">
                        Height Range (cm)
                        <Badge variant="secondary" className="font-mono">{preferences.heightRangeCm.min} - {preferences.heightRangeCm.max} cm</Badge>
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Minimum</span>
                          <Input 
                            type="number" 
                            min={120} 
                            max={preferences.heightRangeCm.max} 
                            value={preferences.heightRangeCm.min}
                            onChange={(e) => setPreferences((p: any) => ({ ...p, heightRangeCm: { ...p.heightRangeCm, min: parseInt(e.target.value) || 140 }}))}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Maximum</span>
                          <Input 
                            type="number" 
                            min={preferences.heightRangeCm.min} 
                            max={250} 
                            value={preferences.heightRangeCm.max}
                            onChange={(e) => setPreferences((p: any) => ({ ...p, heightRangeCm: { ...p.heightRangeCm, max: parseInt(e.target.value) || 210 }}))}
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Religions */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold flex items-center justify-between">
                      Preferred Religions
                      <Badge variant="outline" className="font-normal text-muted-foreground">{preferences.religions.length} Selected</Badge>
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                      {religions.map((religion) => (
                        <div key={religion._id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`rel-${religion._id}`} 
                            checked={preferences.religions.includes(religion._id)}
                            onCheckedChange={() => toggleReligion(religion._id)}
                          />
                          <label 
                            htmlFor={`rel-${religion._id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {religion.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold flex items-center justify-between">
                      Education Levels
                      <Badge variant="outline" className="font-normal text-muted-foreground">{preferences.educationLevels.length} Selected</Badge>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                      {educationLevels.map((edu) => (
                        <div key={edu._id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`edu-${edu._id}`} 
                            checked={preferences.educationLevels.includes(edu._id)}
                            onCheckedChange={() => toggleEducation(edu._id)}
                          />
                          <label 
                            htmlFor={`edu-${edu._id}`}
                            className="text-xs font-medium leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {edu.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold">Common Interests</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add an interest (e.g. Travel, Music)" 
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addInterest()}
                        className="flex-1"
                      />
                      <Button onClick={addInterest} type="button" size="icon" className="shrink-0">
                        <PlusCircle className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-4 rounded-xl border border-dashed border-muted-foreground/30">
                      {preferences.interests.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">No interests added yet</span>
                      ) : (
                        preferences.interests.map((interest: string) => (
                          <Badge key={interest} variant="secondary" className="pl-3 pr-1 py-1 flex items-center gap-1 group">
                            {interest}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => removeInterest(interest)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent pointer-events-none">
                <div className="pointer-events-auto flex justify-end">
                  <Button onClick={handleSavePreferences} disabled={loading} className="shadow-lg gap-2 px-8">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save & Find Matches
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth?: string) {
  if (!dateOfBirth) return "N/A";
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
