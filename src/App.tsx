import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ConsultantProtectedRoute } from "@/components/ConsultantProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Module imports
import { AdminLogin, ForgotPassword } from "@/modules/auth";
import { DashboardHome } from "@/modules/dashboard";
import { UsersList } from "@/modules/users";
import { ConsultantList, ConsultantLogin, ConsultantRegister, ConsultantDashboard } from "@/modules/consultant";
import { StaffList } from "@/modules/staff";

// Legacy pages (to be migrated to modules)
import SupportTickets from "./pages/SupportTickets";
import Demographics from "./pages/Demographics";
import Approvals from "./pages/Approvals";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";
import Branches from "./pages/Branches";
import Admins from "./pages/Admins";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import CMS from "./pages/CMS";
import MasterData from "./pages/MasterData";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Provider store={store}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Consultant Portal Routes */}
            <Route path="/consultant/login" element={<ConsultantLogin />} />
            <Route path="/consultant/register" element={<ConsultantRegister />} />
            <Route
              path="/consultant/dashboard"
              element={
                <ConsultantProtectedRoute>
                  <ConsultantDashboard />
                </ConsultantProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route path="/" element={<ProtectedRoute><AdminLayout><DashboardHome /></AdminLayout></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><AdminLayout><UsersList /></AdminLayout></ProtectedRoute>} />
            <Route path="/consultants" element={<ProtectedRoute><AdminLayout><ConsultantList /></AdminLayout></ProtectedRoute>} />
            <Route path="/staff" element={<ProtectedRoute><AdminLayout><StaffList /></AdminLayout></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><AdminLayout><SupportTickets /></AdminLayout></ProtectedRoute>} />
            <Route path="/demographics" element={<ProtectedRoute><AdminLayout><Demographics /></AdminLayout></ProtectedRoute>} />
            <Route path="/approvals" element={<ProtectedRoute><AdminLayout><Approvals /></AdminLayout></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><AdminLayout><Payment /></AdminLayout></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><AdminLayout><Contact /></AdminLayout></ProtectedRoute>} />
            <Route path="/branches" element={<ProtectedRoute><AdminLayout><Branches /></AdminLayout></ProtectedRoute>} />
            <Route path="/admins" element={<ProtectedRoute><AdminLayout><Admins /></AdminLayout></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><AdminLayout><Reports /></AdminLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />
            <Route path="/cms" element={<ProtectedRoute><AdminLayout><CMS /></AdminLayout></ProtectedRoute>} />
            <Route path="/master-data" element={<ProtectedRoute><AdminLayout><MasterData /></AdminLayout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
