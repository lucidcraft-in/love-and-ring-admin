import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createBranchAsync, fetchBranchesAsync } from "@/store/slices/branchSlice";
import { Loader2 } from "lucide-react";

interface CreateBranchModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateBranchModal = ({ open, onClose }: CreateBranchModalProps) => {
  const dispatch = useAppDispatch();
  const { createLoading, error } = useAppSelector((state) => state.branch);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    managerName: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(createBranchAsync(formData));

    if (createBranchAsync.fulfilled.match(result)) {
      // Refresh the branches list
      dispatch(fetchBranchesAsync({ skip: 0, take: 10 }));
      // Reset form and close modal
      setFormData({
        name: "",
        city: "",
        state: "",
        managerName: "",
        email: "",
        phone: "",
        address: "",
        pincode: "",
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Branch</DialogTitle>
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

            {/* Pincode */}
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

            {/* Error Message */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={createLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLoading}>
              {createLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Branch
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
