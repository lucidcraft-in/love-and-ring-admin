import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

interface StaffProtectedRouteProps {
  children: React.ReactNode;
}

export function StaffProtectedRoute({ children }: StaffProtectedRouteProps) {
  const { isAuthenticated, loginLoading } = useAppSelector((state) => state.staff);
  const location = useLocation();

  // Check if staff token exists in storage
  const token =
    localStorage.getItem("staffToken") ||
    localStorage.getItem("staff_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("staffToken") ||
    sessionStorage.getItem("staff_token");

  const hasValidSession = isAuthenticated || !!token;

  if (loginLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasValidSession) {
    return <Navigate to="/staff/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}