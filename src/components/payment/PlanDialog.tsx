import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPlan, updatePlan } from "@/store/slices/paymentSlice";
import { AppDispatch } from "@/store/store";
import { Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MembershipPlan } from "@/types/payment";
import { isAction } from "@reduxjs/toolkit";

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: MembershipPlan | null;
}

export const PlanDialog: React.FC<PlanDialogProps> = ({ open, onOpenChange, plan }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    heading: "",
    price: "",
    currency: "INR",
    duration: "1 Month",
    durationInMonths: "1",
    features: [""],
    status: "Active",
    contactViews: "0",
    isPopular: "false",
    sortOrder: "0",
    chatProfilesLimit: "0",
    allowCall: "false",
    allowChat: "false",
    millionClub: "false",
    isActive:'false'
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        title: plan.title || "",
        heading: plan.heading || "",
        price: plan.price?.toString() || "",
        currency: plan.currency || "INR",
        duration:
          typeof plan.duration === "object"
            ? `${plan.duration.value} ${plan.duration.unit}`
            : plan.duration || "1 Month",
        durationInMonths: plan.durationInMonths?.toString() || "1",
        features: plan.features?.length
          ? plan.features.map((f: any) => (typeof f === "string" ? f : f.label))
          : [""],
        status: plan.status || "Active",
        contactViews: plan.contactViews?.toString() || "0",
        isPopular: String(plan.isPopular || false),
        sortOrder: plan.sortOrder?.toString() || "0",
        chatProfilesLimit: plan.chatProfilesLimit?.toString() || "0",
        allowCall: String(plan.allowCall || false),
        allowChat: String(plan.allowChat || false),
        millionClub: String(plan.millionClub || false),
        isActive: String(plan.isActive || false)
      });
    } else {
      setFormData({
        title: "",
        heading: "",
        price: "",
        currency: "INR",
        duration: "1 Month",
        durationInMonths: "1",
        features: [""],
        status: "Active",
        contactViews: "0",
        isPopular: "false",
        sortOrder: "0",
        chatProfilesLimit: "0",
        allowCall: "false",
        allowChat: "false",
        millionClub: "false",
        isActive: "false",
      });
    }
  }, [plan, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        heading: formData.heading,
        price: Number(formData.price),
        currency: formData.currency,
        contactViews: Number(formData.contactViews),
        isPopular: formData.isPopular === "true",
        sortOrder: Number(formData.sortOrder),
        chatProfilesLimit: Number(formData.chatProfilesLimit),
        allowCall: formData.allowCall === "true",
        allowChat: formData.allowChat === "true",
        millionClub: formData.millionClub === "true",
        isActive: formData.isActive === "true",
        features: formData.features
          .filter((f) => f.trim() !== "")
          .map((f) => ({
            label: f,
            value: "Yes",
            isHighlighted: false,
          })),
      };

      if (plan) {
        await dispatch(updatePlan({ id: plan._id, data: payload })).unwrap();
        toast({ title: "Success", description: "Plan updated successfully" });
      } else {
        await dispatch(createPlan(payload)).unwrap();
        toast({ title: "Success", description: "Plan created successfully" });
      }

      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || "Failed to save plan",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit Membership Plan" : "Create Membership Plan"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">

          <div className="space-y-2">
            <Label>Plan Title</Label>
            <Input name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label>Heading</Label>
            <Input name="heading" value={formData.heading} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price</Label>
              <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Input name="currency" value={formData.currency} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Chat Profiles Limit</Label>
            <Input
              type="number"
              name="chatProfilesLimit"
              value={formData.chatProfilesLimit}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Contact Views</Label>
            <Input
              type="number"
              name="contactViews"
              value={formData.contactViews}
              onChange={handleChange}
            />
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features</Label>

            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeature(index)}
                  disabled={formData.features.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFeature}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Feature
            </Button>
          </div>

          {/* Boolean Options */}

          <div className="grid grid-cols-2 gap-4">

            <div>
              <Label>Allow Call</Label>
              <Select
                value={formData.allowCall}
                onValueChange={(v) => handleSelectChange("allowCall", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Allow Chat</Label>
              <Select
                value={formData.allowChat}
                onValueChange={(v) => handleSelectChange("allowChat", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <Label>Popular Plan</Label>
              <Select
                value={formData.isPopular}
                onValueChange={(v) => handleSelectChange("isPopular", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Million Club</Label>
              <Select
                value={formData.millionClub}
                onValueChange={(v) => handleSelectChange("millionClub", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={formData.isActive}
                onValueChange={(v) => handleSelectChange("isActive", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {plan ? "Update Plan" : "Create Plan"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
};