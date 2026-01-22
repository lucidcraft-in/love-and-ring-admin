import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

interface ConsultantProtectedRouteProps {
  children: React.ReactNode;
}

export function ConsultantProtectedRoute({ children }: ConsultantProtectedRouteProps) {
  const { isAuthenticated, loginLoading } = useAppSelector((state) => state.consultant);
  const location = useLocation();

  if (loginLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/consultant/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
