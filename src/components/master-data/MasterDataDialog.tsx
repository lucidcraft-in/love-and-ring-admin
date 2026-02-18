import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createMasterDataAsync, updateMasterDataAsync, clearMasterDataError } from "@/store/slices/masterDataSlice";
import { MasterItem, MasterDataType } from "@/services/masterDataService";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MasterDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: MasterDataType | null;
  item: MasterItem | null;
  title: string;
  religions?: MasterItem[];
  primaryEducations?: MasterItem[]; // ✅ NEW
}

export function MasterDataDialog({ open, onOpenChange, type, item, title, religions = [], primaryEducations = [] }: MasterDataDialogProps) {
  const dispatch = useAppDispatch();
  const { createLoading, updateLoading, error } = useAppSelector((state) => state.masterData);

  const [formData, setFormData] = useState({
    name: "",
    value: "",
    religion: "",
    primaryEducation: "", // ✅ NEW
  });

  useEffect(() => {
    if (open) {
      dispatch(clearMasterDataError());
      if (item) {
        setFormData({
          name: item.name,
          value: item.value || "",
          religion: typeof item.religion === 'object' ? item.religion?._id : item.religion || "",
          primaryEducation: typeof item.primaryEducation === 'object' ? item.primaryEducation?._id : item.primaryEducation || "",
        });
      } else {
        setFormData({
          name: "",
          value: "",
          religion: "",
          primaryEducation: "",
        });
      }
    }
  }, [open, item, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;

    const payload: any = { name: formData.name };
    if (formData.value) payload.value = formData.value;
    if (type === 'castes' && formData.religion) payload.religion = formData.religion;
    if (type === 'higherEducations' && formData.primaryEducation) payload.primaryEducation = formData.primaryEducation;

    if (item) {
      const result = await dispatch(updateMasterDataAsync({ type, id: item._id, payload }));
      if (updateMasterDataAsync.fulfilled.match(result)) {
        onOpenChange(false);
      }
    } else {
      const result = await dispatch(createMasterDataAsync({ type, payload }));
      if (createMasterDataAsync.fulfilled.match(result)) {
        onOpenChange(false);
      }
    }
  };

  const isLoading = createLoading || updateLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit' : 'Add'} {title}</DialogTitle>
          <DialogDescription>
            {item ? 'Update the details below.' : 'Enter the details for the new item.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter name"
              required
            />
          </div>

          {type === 'castes' && (
            <div className="space-y-2">
              <Label htmlFor="religion">Religion</Label>
              <Select
                value={formData.religion}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, religion: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Religion" />
                </SelectTrigger>
                <SelectContent>
                  {religions.map(r => (
                    <SelectItem key={r._id} value={r._id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* ✅ NEW: Higher Education → Primary Education Select */}
          {type === 'higherEducations' && (
            <div className="space-y-2">
              <Label htmlFor="primaryEducation">Primary Education</Label>
              <Select
                value={formData.primaryEducation}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, primaryEducation: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Primary Education" />
                </SelectTrigger>
                <SelectContent>
                  {primaryEducations.map(p => (
                    <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {item ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
