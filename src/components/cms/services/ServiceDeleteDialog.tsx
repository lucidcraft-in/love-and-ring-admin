import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  WeddingServiceItem,
  weddingServiceService,
} from "@/services/weddingServiceService";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ServiceDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: WeddingServiceItem | null;
  onSuccess: () => void;
}

export const ServiceDeleteDialog = ({
  open,
  onOpenChange,
  item,
  onSuccess,
}: ServiceDeleteDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!item) return;

    try {
      setLoading(true);
      await weddingServiceService.deleteWeddingService(item._id);

      toast({
        title: "Service Deleted",
        description: `"${item.title}" has been deleted.`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Failed to Delete",
        description: err?.response?.data?.message || err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Wedding Service
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to delete <strong className="text-foreground">{item?.title}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
