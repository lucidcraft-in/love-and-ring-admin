import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Calendar, User, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";

interface Transaction {
  id: string;
  user: string;
  plan: string;
  amount: number;
  method: string;
  date: string;
  status: string;
  email?: string;
  phone?: string;
  transactionRef?: string;
  paymentGateway?: string;
}

interface TransactionViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

export function TransactionViewDialog({ open, onOpenChange, transaction }: TransactionViewDialogProps) {
  if (!transaction) return null;

  const StatusIcon = transaction.status === "Success" 
    ? CheckCircle2 
    : transaction.status === "Failed" 
    ? XCircle 
    : Clock;

  const statusColor = transaction.status === "Success"
    ? "text-chart-green"
    : transaction.status === "Failed"
    ? "text-destructive"
    : "text-chart-orange";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Transaction Details
          </DialogTitle>
          <DialogDescription>
            View complete transaction information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction ID & Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="font-mono font-medium text-primary">{transaction.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${statusColor}`} />
              <Badge
                variant="secondary"
                className={
                  transaction.status === "Success"
                    ? "bg-chart-green/10 text-chart-green"
                    : transaction.status === "Pending"
                    ? "bg-chart-orange/10 text-chart-orange"
                    : "bg-destructive/10 text-destructive"
                }
              >
                {transaction.status}
              </Badge>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Amount Paid</p>
            <p className="text-3xl font-bold text-primary">₹{transaction.amount.toLocaleString()}</p>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{transaction.user}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-medium">{transaction.plan}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{transaction.method}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">{transaction.date}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Details */}
          <div className="p-3 bg-muted/30 rounded-lg text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Gateway</span>
              <span className="font-medium">{transaction.paymentGateway || "Razorpay"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference No.</span>
              <span className="font-mono text-xs">{transaction.transactionRef || `RZP${transaction.id.replace("TXN-", "")}`}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
