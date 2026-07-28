import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

interface ConsultantProtectedRouteProps {
  children: React.ReactNode;
}

export function ConsultantProtectedRoute({ children }: ConsultantProtectedRouteProps) {
  const { isAuthenticated, loginLoading } = useAppSelector((state) => state.consultant);
  const location = useLocation();

  // Check if consultant token exists in storage
  const token =
    localStorage.getItem("consultantToken") ||
    localStorage.getItem("consultant_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("consultantToken") ||
    sessionStorage.getItem("consultant_token");

  const hasValidSession = isAuthenticated || !!token;

  if (loginLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasValidSession) {
    return <Navigate to="/consultant/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}