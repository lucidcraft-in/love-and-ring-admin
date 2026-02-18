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
  deleteMasterDataAsync,
  fetchMasterDataCountAsync,
} from "@/store/slices/masterDataSlice";
import { masterDataService, MasterItem, MasterDataType } from "@/services/masterDataService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { MasterDataDialog } from "@/components/master-data/MasterDataDialog";
import { MasterDataDeleteDialog } from "@/components/master-data/MasterDataDeleteDialog";
import { useState, useEffect } from "react";

const MasterData = () => {
  const dispatch = useAppDispatch();
  const { data, listLoading, currentItem, total, counts } = useAppSelector((state) => state.masterData);

  const [activeTab, setActiveTab] = useState<MasterDataType>("religions");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [religionsList, setReligionsList] = useState<MasterItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [primaryEducationsList, setPrimaryEducationsList] = useState<MasterItem[]>([]);

  useEffect(() => {
    dispatch(setMasterDataType(activeTab));
    dispatch(fetchMasterDataAsync({ type: activeTab, params: { search: searchQuery } }));
    dispatch(fetchMasterDataCountAsync());

    if (activeTab === 'castes') {
      masterDataService.getSimpleList('religions').then(res => setReligionsList(res.data));
    }

    if (activeTab === 'higherEducations') {
      masterDataService.getSimpleList('primaryEducations').then(res => setPrimaryEducationsList(res.data));
    }
  }, [activeTab, dispatch, searchQuery]);

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

  const renderTableContent = () => {
    if (listLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
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
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            No data found.
          </TableCell>
        </TableRow>
      );
    }

    return data.map((item: any) => (
      <TableRow key={item._id} className="border-border/50">

        {/* Name */}
        <TableCell className="font-medium">{item.name}</TableCell>

        {/* Religion Column */}
        {activeTab === 'castes' && (
          <TableCell>
            {typeof item.religion === 'object'
              ? item.religion?.name
              : item.religion}
          </TableCell>
        )}

        {/* ✅ Primary Education Column inside Higher Education */}
        {activeTab === 'higherEducations' && (
          <TableCell>
            {typeof item.primaryEducation === 'object'
              ? item.primaryEducation?.name
              : item.primaryEducation || "-"}
          </TableCell>
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

      {/* Stats Section unchanged */}
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase">Religions</span>
            </div>
            <p className="text-xl font-semibold">{counts?.religions || 0}</p>
          </CardContent>
        </Card>
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-chart-orange" />
              <span className="text-xs text-muted-foreground uppercase">Castes</span>
            </div>
            <p className="text-xl font-semibold">{counts?.castes || 0}</p>
          </CardContent>
        </Card>
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Book className="w-4 h-4 text-chart-green" />
              <span className="text-xs text-muted-foreground uppercase">Primary Education</span>
            </div>
            <p className="text-xl font-semibold">{counts?.primaryEducation || 0}</p>
          </CardContent>
        </Card>
                <Card className="stat-card-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Book className="w-4 h-4 text-chart-green" />
              <span className="text-xs text-muted-foreground uppercase">Higher Education</span>
            </div>
            <p className="text-xl font-semibold">{counts?.higherEducation || 0}</p>
          </CardContent>
        </Card>
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-4 h-4 text-info" />
              <span className="text-xs text-muted-foreground uppercase">Occupations</span>
            </div>
            <p className="text-xl font-semibold">{counts?.occupations || 0}</p>
          </CardContent>
        </Card>
        {/* <Card className="stat-card-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-chart-purple" />
              <span className="text-xs text-muted-foreground uppercase">Locations</span>
            </div>
            <p className="text-xl font-semibold">{counts?.locations || 0}</p>
          </CardContent>
        </Card> */}
        <Card className="stat-card-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Languages className="w-4 h-4 text-chart-rose" />
              <span className="text-xs text-muted-foreground uppercase">Languages</span>
            </div>
            <p className="text-xl font-semibold">{counts?.languages || 0}</p>
          </CardContent>
        </Card>
      </div>
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => {
        setActiveTab(v as any);
        setSearchQuery("");
      }} className="space-y-4">

        <TabsList className="bg-muted/50 flex-wrap h-auto">
          <TabsTrigger value="religions">Religion</TabsTrigger>
          <TabsTrigger value="castes">Caste</TabsTrigger>
          <TabsTrigger value="primaryEducations">Primary Education</TabsTrigger>
          <TabsTrigger value="higherEducations">Higher Education</TabsTrigger>
          <TabsTrigger value="occupations">Occupation</TabsTrigger>
          <TabsTrigger value="languages">Language</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab}...`}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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

                    {/* Religion Header */}
                    {activeTab === 'castes' && (
                      <TableHead>Religion</TableHead>
                    )}

                    {/* ✅ Primary Education Header for Higher Education */}
                    {activeTab === 'higherEducations' && (
                      <TableHead>Primary Education</TableHead>
                    )}

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
        title={activeTab.slice(0, -1)}
        religions={religionsList}
        primaryEducations={primaryEducationsList}
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
