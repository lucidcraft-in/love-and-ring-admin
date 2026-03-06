import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, Plus, CreditCard, IndianRupee, TrendingUp, Calendar, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TransactionViewDialog } from "@/components/payment/TransactionViewDialog";
import { AddOfflinePaymentDialog } from "@/components/payment/AddOfflinePaymentDialog";
import { PlanDialog } from "@/components/payment/PlanDialog";
import { fetchTransactions, fetchPaymentStats, fetchPlans, deletePlan } from "@/store/slices/paymentSlice";
import { RootState, AppDispatch } from "@/store/store";
import { MembershipPlan, Transaction } from "@/types/payment";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Payment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { transactions, stats, plans, loading } = useSelector((state: RootState) => state.payment);

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [viewTransactionOpen, setViewTransactionOpen] = useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);

  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchPaymentStats());
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleViewTransaction = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setViewTransactionOpen(true);
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setPlanDialogOpen(true);
  };

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setPlanDialogOpen(true);
  };

  const confirmDeletePlan = async () => {
    if (deletePlanId) {
      try {
        await dispatch(deletePlan(deletePlanId)).unwrap();
        toast({ title: "Success", description: "Plan deleted successfully" });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete plan" });
      } finally {
        setDeletePlanId(null);
      }
    }
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
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setAddPaymentOpen(true)}>
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
                <p className="text-xl font-semibold text-foreground">₹{stats?.totalRevenue.toLocaleString() || 0}</p>
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
                <p className="text-xl font-semibold text-foreground">₹{stats?.thisMonthRevenue.toLocaleString() || 0}</p>
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
                <p className="text-xl font-semibold text-foreground">{stats?.totalTransactions.toLocaleString() || 0}</p>
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

          {/* Plans Section */}
          <TabsContent value="plans" className="space-y-4">
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-primary/90" onClick={handleCreatePlan}>
                <Plus className="w-4 h-4 mr-2" />
                Add Plan
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => (
                <Card key={plan._id} className="stat-card-shadow border-0">

                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{plan.title}</CardTitle>

                      {plan.isPopular && (
                        <Badge className="bg-primary/10 text-primary">Popular</Badge>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPlan(plan)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeletePlanId(plan._id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {plan.heading && (
                      <p className="text-xs text-muted-foreground">{plan.heading}</p>
                    )}

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-primary">₹{plan.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">
                        / {typeof plan.duration === 'object'
                          ? `${plan.duration.value} ${plan.duration.unit}`
                          : plan.duration}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent>

                    {/* FEATURES */}
                    <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                      {plan.features.slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-chart-green" />
                          {typeof feature === 'string' ? feature : feature.label}
                        </li>
                      ))}
                    </ul>

                    {/* NEW MEMBERSHIP FEATURES */}
                    <div className="text-xs space-y-1 mb-4 text-muted-foreground">

                      {plan.contactViews !== undefined && (
                        <div>Contact Views: {plan.contactViews === 0 ? "Unlimited" : plan.contactViews}</div>
                      )}

                      {plan.chatProfilesLimit !== undefined && (
                        <div>Profiles: {plan.chatProfilesLimit}</div>
                      )}

                      <div>Chat: {plan.allowChat ? "Yes" : "No"}</div>
                      <div>Call: {plan.allowCall ? "Yes" : "No"}</div>

                      {plan.millionClub && (
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                          Million Club
                        </Badge>
                      )}

                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">
                        {plan.isActive ? 'Active Plan' : 'Inactive Plan'}
                      </span>

                      <Badge
                        variant="secondary"
                        className={
                          plan.isActive
                            ? "bg-chart-green/10 text-chart-green"
                            : "bg-destructive/10 text-destructive"
                        }
                      >
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                  </CardContent>

                </Card>
              ))}

              {plans.length === 0 && !loading && (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  No membership plans found. Create one to get started.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TransactionViewDialog
        open={viewTransactionOpen}
        onOpenChange={setViewTransactionOpen}
        transaction={selectedTransaction}
      />

      <AddOfflinePaymentDialog
        open={addPaymentOpen}
        onOpenChange={setAddPaymentOpen}
      />

      <PlanDialog
        open={planDialogOpen}
        onOpenChange={setPlanDialogOpen}
        plan={selectedPlan}
      />

      <AlertDialog open={!!deletePlanId} onOpenChange={(open) => !open && setDeletePlanId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the membership plan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDeletePlan}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Payment;