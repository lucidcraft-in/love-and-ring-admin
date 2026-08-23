import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  weddingServiceService,
  weddingServiceCategories,
} from "@/services/weddingServiceService";
import { Upload, Plus, Loader2 } from "lucide-react";

interface ServiceAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const ServiceAddDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: ServiceAddDialogProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Photographers");
  const [description, setDescription] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({ title: "Error", description: "Service title is required", variant: "destructive" });
      return;
    }

    if (!description.trim()) {
      toast({ title: "Error", description: "Description is required", variant: "destructive" });
      return;
    }

    if (!imageFile) {
      toast({ title: "Error", description: "Service image photo is required", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      if (priceRange) formData.append("priceRange", priceRange);
      if (location) formData.append("location", location);
      if (contactEmail) formData.append("contactEmail", contactEmail);
      if (contactPhone) formData.append("contactPhone", contactPhone);
      formData.append("file", imageFile);

      await weddingServiceService.createWeddingService(formData);

      toast({
        title: "Service Created! 🎉",
        description: "Wedding service created successfully and is now active.",
      });

      // Reset form
      setTitle("");
      setCategory("Photographers");
      setDescription("");
      setPriceRange("");
      setLocation("");
      setContactEmail("");
      setContactPhone("");
      setImageFile(null);
      setImagePreview("");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Failed to Add Service",
        description: err?.response?.data?.message || err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add New Wedding Service
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Service Title / Business Name *</Label>
              <Input
                id="title"
                placeholder="e.g. Royal Wedding Photography Studio"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Service Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {weddingServiceCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Service Image / Cover Photo *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              {imagePreview ? (
                <div className="space-y-3">
                  <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded object-cover" />
                  <Button type="button" variant="outline" size="sm" onClick={() => { setImageFile(null); setImagePreview(""); }}>
                    Change Photo
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer space-y-2 block">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground block">Click to select photo file</span>
                  <span className="text-xs text-muted-foreground block">PNG, JPG, WEBP up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceRange">Price Range / Estimate</Label>
              <Input
                id="priceRange"
                placeholder="e.g. ₹50,000 - ₹2,000,000 or Contact for Quote"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location / City</Label>
              <Input
                id="location"
                placeholder="e.g. Kochi, Kerala / All India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="e.g. info@studioroyal.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone / WhatsApp (Optional)</Label>
              <Input
                id="contactPhone"
                placeholder="e.g. +91 9876543210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Service Description & Key Offerings *</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="e.g. Premium cinematic wedding photography & videography team with 10+ years experience specializing in luxury destination weddings..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save &amp; Publish Service
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
