import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addOfflinePayment } from "@/store/slices/paymentSlice";
import { AppDispatch } from "@/store/store";
import { Loader2, Paperclip, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchPlans } from "@/store/slices/paymentSlice";
import { RootState } from "@/store/store";

interface AddOfflinePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddOfflinePaymentDialog: React.FC<AddOfflinePaymentDialogProps> = ({ open, onOpenChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    planName: "Premium 1 Month",
    amount: "999",
    paymentMethod: "Cash",
    referenceNo: "",
  });

  // ✅ new state for backend
  const [planId, setPlanId] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);

  const { plans } = useSelector((state: RootState) => state.payment);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachmentFile(file);
      if (file.type.startsWith("image/")) {
        setAttachmentPreview(URL.createObjectURL(file));
      } else {
        setAttachmentPreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setAttachmentFile(null);
    setAttachmentPreview(null);
  };

  // ✅ updated select handler
  const handleSelectChange = (name: string, value: string) => {
    if (name === "planName") {
      const selectedPlan = plans.find((p) => p._id === value);

      if (selectedPlan) {
        setPlanId(selectedPlan._id);

        setFormData((prev) => ({
          ...prev,
          planName: selectedPlan.title,
          amount: String(selectedPlan.price),
        }));
      }

      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.userId) {
        throw new Error("User email is required");
      }

      if (!planId) {
        throw new Error("Please select a membership plan");
      }

      const form = new FormData();
      form.append("userEmail", formData.userId);
      form.append("planId", planId);
      form.append("amount", String(formData.amount));
      form.append("paymentMethod", formData.paymentMethod);
      if (formData.referenceNo) {
        form.append("referenceNo", formData.referenceNo);
      }
      if (attachmentFile) {
        form.append("attachment", attachmentFile);
      }

      await dispatch(addOfflinePayment(form)).unwrap();

      toast({
        title: "Success",
        description: "Payment added successfully",
      });

      onOpenChange(false);

      // Reset form
      setFormData({
        userId: "",
        planName: "Premium 1 Month",
        amount: "999",
        paymentMethod: "Cash",
        referenceNo: "",
      });

      setPlanId("");
      setAttachmentFile(null);
      setAttachmentPreview(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || "Failed to add payment",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Offline Payment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User Email</Label>
            <Input
              id="userId"
              name="userId"
              placeholder="Enter User Email"
              value={formData.userId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name</Label>

            <Select
              value={planId}
              onValueChange={(value) => handleSelectChange("planName", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Plan" />
              </SelectTrigger>

              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan._id} value={plan._id}>
                    {plan.title} - ₹{plan.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>

            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter Amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>

            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleSelectChange("paymentMethod", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Method" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Credit/Debit Card">Credit / Debit Card</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Net Banking">Net Banking</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceNo">Reference Number (Optional)</Label>

            <Input
              id="referenceNo"
              name="referenceNo"
              placeholder="Enter Reference Number"
              value={formData.referenceNo}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Payment Receipt / Screenshot (Optional)</Label>

            <Input
              id="attachment"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="cursor-pointer"
            />

            {attachmentFile && (
              <div className="mt-2 p-2 border rounded-md flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2 overflow-hidden">
                  {attachmentPreview ? (
                    <img src={attachmentPreview} alt="Preview" className="w-10 h-10 object-cover rounded border" />
                  ) : (
                    <Paperclip className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className="text-xs font-medium truncate max-w-[200px]">
                    {attachmentFile.name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};