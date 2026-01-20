import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, Plus, CreditCard, IndianRupee, TrendingUp, Calendar, MoreHorizontal, Eye, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TransactionViewDialog } from "@/components/payment/TransactionViewDialog";

const transactions = [
  {
    id: "TXN-001",
    user: "Priya Sharma",
    plan: "Premium 6 Months",
    amount: 4999,
    method: "Credit Card",
    date: "2024-03-15",
    status: "Success",
  },
  {
    id: "TXN-002",
    user: "Rahul Verma",
    plan: "Premium 1 Year",
    amount: 7999,
    method: "UPI",
    date: "2024-03-14",
    status: "Success",
  },
  {
    id: "TXN-003",
    user: "Anjali Patel",
    plan: "Premium 3 Months",
    amount: 2999,
    method: "Net Banking",
    date: "2024-03-14",
    status: "Pending",
  },
  {
    id: "TXN-004",
    user: "Vikram Singh",
    plan: "Premium 1 Month",
    amount: 999,
    method: "Debit Card",
    date: "2024-03-13",
    status: "Failed",
  },
  {
    id: "TXN-005",
    user: "Sneha Reddy",
    plan: "Premium 6 Months",
    amount: 4999,
    method: "UPI",
    date: "2024-03-12",
    status: "Success",
  },
];

const plans = [
  {
    id: 1,
    name: "Premium 1 Month",
    price: 999,
    duration: "1 Month",
    features: ["10 Contact Views", "Profile Boost", "Chat Access"],
    status: "Active",
    subscribers: 1250,
  },
  {
    id: 2,
    name: "Premium 3 Months",
    price: 2999,
    duration: "3 Months",
    features: ["30 Contact Views", "Profile Boost", "Chat Access", "Priority Support"],
    status: "Active",
    subscribers: 2800,
  },
  {
    id: 3,
    name: "Premium 6 Months",
    price: 4999,
    duration: "6 Months",
    features: ["75 Contact Views", "Profile Boost", "Chat Access", "Priority Support", "Personal Matchmaking"],
    status: "Active",
    subscribers: 3500,
  },
  {
    id: 4,
    name: "Premium 1 Year",
    price: 7999,
    duration: "12 Months",
    features: ["Unlimited Contact Views", "Profile Boost", "Chat Access", "Priority Support", "Personal Matchmaking", "Video Calls"],
    status: "Active",
    subscribers: 1374,
  },
];

type Transaction = typeof transactions[0];

const Payment = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const handleViewTransaction = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setViewOpen(true);
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Payment Management</h1>
            <p className="text-sm text-muted-foreground">Manage subscriptions and transactions</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Offline Payment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-chart-green" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Revenue</p>
                <p className="text-xl font-semibold text-foreground">₹24,56,890</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">This Month</p>
                <p className="text-xl font-semibold text-foreground">₹3,45,670</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-orange/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-chart-orange" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Transactions</p>
                <p className="text-xl font-semibold text-foreground">8,924</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-shadow border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Growth</p>
                <p className="text-xl font-semibold text-foreground">+18.5%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="plans">Membership Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            {/* Filters */}
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search transactions..." className="pl-10" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select defaultValue="all-status">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-status">All Status</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all-method">
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-method">All Methods</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="netbanking">Net Banking</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card className="stat-card-shadow border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((txn) => (
                      <TableRow key={txn.id} className="border-border/50">
                        <TableCell className="font-medium text-primary">{txn.id}</TableCell>
                        <TableCell>{txn.user}</TableCell>
                        <TableCell>{txn.plan}</TableCell>
                        <TableCell className="font-medium">₹{txn.amount.toLocaleString()}</TableCell>
                        <TableCell>{txn.method}</TableCell>
                        <TableCell>{txn.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              txn.status === "Success"
                                ? "bg-chart-green/10 text-chart-green"
                                : txn.status === "Pending"
                                  ? "bg-chart-orange/10 text-chart-orange"
                                  : "bg-destructive/10 text-destructive"
                            }
                          >
                            {txn.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewTransaction(txn)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Plan
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => (
                <Card key={plan.id} className="stat-card-shadow border-0">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{plan.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-primary">₹{plan.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">/ {plan.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-chart-green" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">{plan.subscribers.toLocaleString()} subscribers</span>
                      <Badge variant="secondary" className="bg-chart-green/10 text-chart-green">
                        {plan.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Transaction View Dialog */}
      <TransactionViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        transaction={selectedTransaction}
      />
    </>
  );
};

export default Payment;
