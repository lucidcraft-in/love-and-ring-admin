import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash2, Database, Book, Briefcase, MapPin, Languages, Heart } from "lucide-react";

import {
  fetchMasterDataAsync,
  setCurrentMasterItem,
  setMasterDataType,
  deleteMasterDataAsync
} from "@/store/slices/masterDataSlice";
import { masterDataService, MasterItem, MasterDataType } from "@/services/masterDataService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { MasterDataDialog } from "@/components/master-data/MasterDataDialog";
import { MasterDataDeleteDialog } from "@/components/master-data/MasterDataDeleteDialog";
import { useState, useEffect } from "react";

const MasterData = () => {
  const dispatch = useAppDispatch();
  const { data, listLoading, currentItem, total } = useAppSelector((state) => state.masterData);

  const [activeTab, setActiveTab] = useState<MasterDataType>("religions");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [religionsList, setReligionsList] = useState<MasterItem[]>([]); // For generic dropdown

  // Initialize and fetch on tab change
  useEffect(() => {
    dispatch(setMasterDataType(activeTab));
    dispatch(fetchMasterDataAsync({ type: activeTab }));

    // When switching to castes, we might need religion list for dropdown
    if (activeTab === 'castes') {
      masterDataService.getSimpleList('religions').then(res => setReligionsList(res.data));
    }
  }, [activeTab, dispatch]);

  const handleCreate = () => {
    dispatch(setCurrentMasterItem(null));
    setDialogOpen(true);
  };

  const handleEdit = (item: MasterItem) => {
    dispatch(setCurrentMasterItem(item));
    setDialogOpen(true);
  };

  const handleDelete = (item: MasterItem) => {
    dispatch(setCurrentMasterItem(item));
    setDeleteOpen(true);
  };

  // Helper to render table content based on loading state
  const renderTableContent = () => {
    if (listLoading) {
      return (
        <TableRow>
          <TableCell colSpan={activeTab === 'locations' ? 6 : activeTab === 'castes' ? 5 : 4} className="h-24 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={activeTab === 'locations' ? 6 : activeTab === 'castes' ? 5 : 4} className="h-24 text-center text-muted-foreground">
            No data found.
          </TableCell>
        </TableRow>
      );
    }

    return data.map((item: any) => (
      <TableRow key={item._id} className="border-border/50">
        {activeTab === 'locations' ? ( // Special case for location struct
          <>
            <TableCell className="font-medium">{item.name?.split(',')[0] || item.city || item.name}</TableCell>
            {/* 
                NOTE: Location data structure from backend usually has city, state, country. 
                However, generic MasterItem uses 'name'. 
                If the backend returns specific fields for location like 'city', 'state', 'country', 
                we should use them. Assuming 'name' might hold a combined string or we use specific fields if present.
                Given the interface MasterItem uses `name`, I will simply use `name` and if needed cast `item` to `any` above to access extras if backend sends them.
                Actually, looking at the user snippet: `createItem(Location)` uses `name` usually if standardized? 
                Wait, the Location model usually has fields.
                But `createItemService` is generic `Model.create(payload)`.
                If Location model requires `city`, `state`, `country` separate, then `name` payload won't work perfectly generic without extra fields.
                However, to keep it simple and generic as currently designed:
                I will assume Location uses 'name' as primary identifier (e.g. "Mumbai, Maharashtra") OR 
                if the backend strictly separates them, the generic dialog needs to handle generic "Values" or json.
                
                For this integration, I will stick to displaying `item.name` primarily, unless specific fields exist on the returned object.
                Since I casted `item` to `any` above, I can try accessing common location fields safely.
            */}
            <TableCell>{item.state || '-'}</TableCell>
            <TableCell>{item.country || '-'}</TableCell>
          </>
        ) : (
          <TableCell className="font-medium">{item.name}</TableCell>
        )}

        {activeTab === 'castes' && (
          <TableCell>{typeof item.religion === 'object' ? item.religion?.name : item.religion}</TableCell>
        )}

        <TableCell>{item.usersCount?.toLocaleString() || 0}</TableCell>
        <TableCell>
          <Badge variant="outline" className="border-chart-green text-chart-green">
            Active
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

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
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList className="bg-muted/50 flex-wrap h-auto">
          <TabsTrigger value="religions">Religion</TabsTrigger>
          <TabsTrigger value="castes">Caste</TabsTrigger>
          <TabsTrigger value="educations">Education</TabsTrigger>
          <TabsTrigger value="occupations">Occupation</TabsTrigger>
          <TabsTrigger value="locations">Location</TabsTrigger>
          <TabsTrigger value="languages">Language</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={`Search ${activeTab}...`} className="pl-10" />
            </div>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Name</TableHead>
                    {activeTab === 'locations' && (
                      <>
                        <TableHead>State</TableHead>
                        <TableHead>Country</TableHead>
                      </>
                    )}
                    {activeTab === 'castes' && <TableHead>Religion</TableHead>}
                    <TableHead>Users Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderTableContent()}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <MasterDataDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        type={activeTab}
        item={currentItem}
        title={activeTab.slice(0, -1)} // remove 's' for singular title roughly
        religions={religionsList}
      />
      <MasterDataDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        type={activeTab}
        item={currentItem}
        title={activeTab.slice(0, -1)}
      />
    </div>

  );
};

export default MasterData;
