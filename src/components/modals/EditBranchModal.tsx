import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateBranchAsync, fetchBranchesAsync } from "@/store/slices/branchSlice";
import { Branch } from "@/services/branchService";
import { Loader2 } from "lucide-react";

interface EditBranchModalProps {
  open: boolean;
  onClose: () => void;
  branch: Branch | null;
}

export const EditBranchModal = ({ open, onClose, branch }: EditBranchModalProps) => {
  const dispatch = useAppDispatch();
  const { updateLoading, error } = useAppSelector((state) => state.branch);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    managerName: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    status: "Active" as "Active" | "Inactive",
  });

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name,
        city: branch.city || "",
        state: branch.state || "",
        managerName: branch.managerName,
        email: branch.email,
        phone: branch.phone,
        address: branch.address || "",
        pincode: branch.pincode || "",
        status: branch.status,
      });
    }
  }, [branch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: "Active" | "Inactive") => {
    setFormData({ ...formData, status: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!branch) return;

    const result = await dispatch(
      updateBranchAsync({
        id: branch._id,
        payload: formData,
      })
    );

    if (updateBranchAsync.fulfilled.match(result)) {
      // Refresh the branches list
      dispatch(fetchBranchesAsync({ skip: 0, take: 10 }));
      onClose();
    }
  };

  if (!branch) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Branch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Branch Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Branch Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Mumbai Central"
                required
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Mumbai"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g., Maharashtra"
                  required
                />
              </div>
            </div>

            {/* Manager Name */}
            <div className="grid gap-2">
              <Label htmlFor="managerName">Manager Name *</Label>
              <Input
                id="managerName"
                name="managerName"
                value={formData.managerName}
                onChange={handleChange}
                placeholder="e.g., Rajesh Kumar"
                required
              />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="branch@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 22 1234 5678"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
              />
            </div>

            {/* Pincode and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={updateLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateLoading}>
              {updateLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Branch
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
