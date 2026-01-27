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
  item: MasterItem | null; // If null, mode is 'create', else 'edit'
  title: string;
  // For selecting parent religion when adding/editing generic items like Caste
  religions?: MasterItem[];
}

export function MasterDataDialog({ open, onOpenChange, type, item, title, religions = [] }: MasterDataDialogProps) {
  const dispatch = useAppDispatch();
  const { createLoading, updateLoading, error } = useAppSelector((state) => state.masterData);

  const [formData, setFormData] = useState({
    name: "",
    value: "",
    religion: "", // Only for caste
  });

  useEffect(() => {
    if (open) {
      dispatch(clearMasterDataError());
      if (item) {
        // Edit mode
        setFormData({
          name: item.name,
          value: item.value || "",
          religion: typeof item.religion === 'object' ? item.religion?._id : item.religion || "",
        });
      } else {
        // Create mode
        setFormData({
          name: "",
          value: "",
          religion: "",
        });
      }
    }
  }, [open, item, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;

    if (item) {
      // Update
      const payload: any = { name: formData.name };
      // Some simple logic to include value if needed, for simplicity we send what we have if not empty
      if (formData.value) payload.value = formData.value;
      if (type === 'castes' && formData.religion) payload.religion = formData.religion;

      const result = await dispatch(updateMasterDataAsync({ type, id: item._id, payload }));
      if (updateMasterDataAsync.fulfilled.match(result)) {
        onOpenChange(false);
      }
    } else {
      // Create
      const payload: any = { name: formData.name };
      if (formData.value) payload.value = formData.value;
      if (type === 'castes' && formData.religion) payload.religion = formData.religion;

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

          {/* Special case for Caste: Needs Religion Selection */}
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
