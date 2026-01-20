import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash2, Database, Book, Briefcase, MapPin, Languages, Heart } from "lucide-react";

const religions = [
  { id: 1, name: "Hindu", count: 25000, status: "Active" },
  { id: 2, name: "Muslim", count: 8000, status: "Active" },
  { id: 3, name: "Christian", count: 5000, status: "Active" },
  { id: 4, name: "Sikh", count: 2500, status: "Active" },
  { id: 5, name: "Jain", count: 1500, status: "Active" },
  { id: 6, name: "Buddhist", count: 800, status: "Active" },
  { id: 7, name: "Parsi", count: 200, status: "Active" },
];

const castes = [
  { id: 1, name: "Brahmin", religion: "Hindu", count: 8500, status: "Active" },
  { id: 2, name: "Kshatriya", religion: "Hindu", count: 5200, status: "Active" },
  { id: 3, name: "Vaishya", religion: "Hindu", count: 4800, status: "Active" },
  { id: 4, name: "Sunni", religion: "Muslim", count: 5000, status: "Active" },
  { id: 5, name: "Shia", religion: "Muslim", count: 3000, status: "Active" },
  { id: 6, name: "Catholic", religion: "Christian", count: 3200, status: "Active" },
];

const educations = [
  { id: 1, name: "B.Tech/B.E.", count: 12500, status: "Active" },
  { id: 2, name: "MBA/PGDM", count: 8900, status: "Active" },
  { id: 3, name: "MBBS/MD", count: 4500, status: "Active" },
  { id: 4, name: "B.Com", count: 6200, status: "Active" },
  { id: 5, name: "CA/CFA", count: 3100, status: "Active" },
  { id: 6, name: "B.Sc", count: 5800, status: "Active" },
  { id: 7, name: "M.Tech/M.E.", count: 4200, status: "Active" },
];

const occupations = [
  { id: 1, name: "Software Engineer", count: 9500, status: "Active" },
  { id: 2, name: "Doctor", count: 4200, status: "Active" },
  { id: 3, name: "Business Owner", count: 3800, status: "Active" },
  { id: 4, name: "Teacher/Professor", count: 3200, status: "Active" },
  { id: 5, name: "Government Employee", count: 5100, status: "Active" },
  { id: 6, name: "Lawyer", count: 1800, status: "Active" },
  { id: 7, name: "Accountant", count: 2900, status: "Active" },
];

const locations = [
  { id: 1, country: "India", state: "Maharashtra", city: "Mumbai", count: 8500, status: "Active" },
  { id: 2, country: "India", state: "Delhi", city: "New Delhi", count: 7200, status: "Active" },
  { id: 3, country: "India", state: "Karnataka", city: "Bangalore", count: 6800, status: "Active" },
  { id: 4, country: "India", state: "Telangana", city: "Hyderabad", count: 5400, status: "Active" },
  { id: 5, country: "India", state: "Tamil Nadu", city: "Chennai", count: 4200, status: "Active" },
  { id: 6, country: "India", state: "Gujarat", city: "Ahmedabad", count: 3100, status: "Active" },
];

const languages = [
  { id: 1, name: "Hindi", count: 18500, status: "Active" },
  { id: 2, name: "English", count: 25000, status: "Active" },
  { id: 3, name: "Marathi", count: 8500, status: "Active" },
  { id: 4, name: "Tamil", count: 6200, status: "Active" },
  { id: 5, name: "Telugu", count: 5800, status: "Active" },
  { id: 6, name: "Kannada", count: 4500, status: "Active" },
  { id: 7, name: "Bengali", count: 4200, status: "Active" },
];

const MasterData = () => {
  return (

      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Master Data Management</h1>
            <p className="text-sm text-muted-foreground">Manage all master data for the platform</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground uppercase">Religions</span>
              </div>
              <p className="text-xl font-semibold">7</p>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-chart-orange" />
                <span className="text-xs text-muted-foreground uppercase">Castes</span>
              </div>
              <p className="text-xl font-semibold">156</p>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Book className="w-4 h-4 text-chart-green" />
                <span className="text-xs text-muted-foreground uppercase">Education</span>
              </div>
              <p className="text-xl font-semibold">45</p>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-info" />
                <span className="text-xs text-muted-foreground uppercase">Occupations</span>
              </div>
              <p className="text-xl font-semibold">89</p>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-chart-purple" />
                <span className="text-xs text-muted-foreground uppercase">Locations</span>
              </div>
              <p className="text-xl font-semibold">520</p>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Languages className="w-4 h-4 text-chart-rose" />
                <span className="text-xs text-muted-foreground uppercase">Languages</span>
              </div>
              <p className="text-xl font-semibold">22</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="religion" className="space-y-4">
          <TabsList className="bg-muted/50 flex-wrap h-auto">
            <TabsTrigger value="religion">Religion</TabsTrigger>
            <TabsTrigger value="caste">Caste</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="occupation">Occupation</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
          </TabsList>

          <TabsContent value="religion" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search religion..." className="pl-10" />
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Religion
              </Button>
            </div>
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Name</TableHead>
                      <TableHead>Users Count</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {religions.map((item) => (
                      <TableRow key={item.id} className="border-border/50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.count.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-chart-green text-chart-green">
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="caste" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search caste..." className="pl-10" />
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Caste
              </Button>
            </div>
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Name</TableHead>
                      <TableHead>Religion</TableHead>
                      <TableHead>Users Count</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {castes.map((item) => (
                      <TableRow key={item.id} className="border-border/50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.religion}</TableCell>
                        <TableCell>{item.count.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-chart-green text-chart-green">
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search education..." className="pl-10" />
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Degree</TableHead>
                      <TableHead>Users Count</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {educations.map((item) => (
                      <TableRow key={item.id} className="border-border/50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.count.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-chart-green text-chart-green">
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="occupation" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search occupation..." className="pl-10" />
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Occupation
              </Button>
            </div>
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Occupation</TableHead>
                      <TableHead>Users Count</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {occupations.map((item) => (
                      <TableRow key={item.id} className="border-border/50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.count.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-chart-green text-chart-green">
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search location..." className="pl-10" />
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Location
              </Button>
            </div>
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>City</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Users Count</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map((item) => (
                      <TableRow key={item.id} className="border-border/50">
                        <TableCell className="font-medium">{item.city}</TableCell>
                        <TableCell>{item.state}</TableCell>
                        <TableCell>{item.country}</TableCell>
                        <TableCell>{item.count.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-chart-green text-chart-green">
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search language..." className="pl-10" />
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Language
              </Button>
            </div>
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Language</TableHead>
                      <TableHead>Users Count</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {languages.map((item) => (
                      <TableRow key={item.id} className="border-border/50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.count.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-chart-green text-chart-green">
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

  );
};

export default MasterData;
