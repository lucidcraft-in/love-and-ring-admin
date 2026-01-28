import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface ConsultantFilters {
  status?: string;
  agencyName?: string;
  regions?: string[];
  minProfiles?: number;
  maxProfiles?: number;
  createdAfter?: string;
  createdBefore?: string;
}

interface ConsultantFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ConsultantFilters;
  onApplyFilters: (filters: ConsultantFilters) => void;
  onClearFilters: () => void;
}

export function ConsultantFilterDialog({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onClearFilters,
}: ConsultantFilterDialogProps) {
  const [localFilters, setLocalFilters] = useState<ConsultantFilters>(filters);
  const [regionInput, setRegionInput] = useState("");

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleAddRegion = () => {
    if (regionInput.trim() && !localFilters.regions?.includes(regionInput.trim())) {
      setLocalFilters({
        ...localFilters,
        regions: [...(localFilters.regions || []), regionInput.trim()],
      });
      setRegionInput("");
    }
  };

  const handleRemoveRegion = (region: string) => {
    setLocalFilters({
      ...localFilters,
      regions: localFilters.regions?.filter((r) => r !== region),
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.keys(localFilters).some((key) => {
    const value = localFilters[key as keyof ConsultantFilters];
    return value !== undefined && value !== "" && (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>
            Apply advanced filters to refine your consultant search
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={localFilters.status || "all"}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, status: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agency Name Filter */}
          {/* <div className="space-y-2">
            <Label htmlFor="agencyName">Agency Name</Label>
            <Input
              id="agencyName"
              placeholder="Filter by agency name"
              value={localFilters.agencyName || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, agencyName: e.target.value || undefined })
              }
            />
          </div> */}

          {/* Regions Filter */}
          <div className="space-y-2">
            <Label htmlFor="regions">Regions</Label>
            <div className="flex gap-2">
              <Input
                id="regions"
                placeholder="Add region (e.g., Mumbai)"
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRegion();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddRegion}>
                Add
              </Button>
            </div>
            {localFilters.regions && localFilters.regions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {localFilters.regions.map((region) => (
                  <Badge key={region} variant="secondary" className="gap-1">
                    {region}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleRemoveRegion(region)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Profiles Created Range */}
          <div className="space-y-2">
            <Label>Profiles Created</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minProfiles || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      minProfiles: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxProfiles || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      maxProfiles: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Created Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="date"
                  value={localFilters.createdAfter || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      createdAfter: e.target.value || undefined,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">From</p>
              </div>
              <div>
                <Input
                  type="date"
                  value={localFilters.createdBefore || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      createdBefore: e.target.value || undefined,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">To</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClear} disabled={!hasActiveFilters}>
            Clear All
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
