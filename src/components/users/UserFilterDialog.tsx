import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface UserFilters {
  gender?: string;
  status?: string;
  membership?: string;
  minAge?: number;
  maxAge?: number;
  city?: string;
  religion?: string;
  maritalStatus?: string;
  createdAfter?: string;
  createdBefore?: string;
}

interface UserFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: UserFilters;
  onApplyFilters: (filters: UserFilters) => void;
  onClearFilters: () => void;
}

export function UserFilterDialog({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onClearFilters,
}: UserFilterDialogProps) {
  const [localFilters, setLocalFilters] = useState<UserFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.keys(localFilters).some((key) => {
    const value = localFilters[key as keyof UserFilters];
    return value !== undefined && value !== "" && (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>
            Apply advanced filters to refine your user search
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Gender Filter */}
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={localFilters.gender || "all"}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, gender: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gender</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Membership Filter */}
          <div className="space-y-2">
            <Label htmlFor="membership">Membership</Label>
            <Select
              value={localFilters.membership || "all"}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, membership: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger id="membership">
                <SelectValue placeholder="Select membership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Membership</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="free">Free</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Range */}
          <div className="space-y-2">
            <Label>Age Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Min Age"
                  min="18"
                  max="100"
                  value={localFilters.minAge || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      minAge: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max Age"
                  min="18"
                  max="100"
                  value={localFilters.maxAge || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      maxAge: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Filter by city"
              value={localFilters.city || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, city: e.target.value || undefined })
              }
            />
          </div>

          {/* Religion Filter */}
          <div className="space-y-2">
            <Label htmlFor="religion">Religion</Label>
            <Input
              id="religion"
              placeholder="Filter by religion"
              value={localFilters.religion || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, religion: e.target.value || undefined })
              }
            />
          </div>

          {/* Marital Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <Select
              value={localFilters.maritalStatus || "all"}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, maritalStatus: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger id="maritalStatus">
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Never Married">Never Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
                <SelectItem value="Separated">Separated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Registration Date Range</Label>
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
