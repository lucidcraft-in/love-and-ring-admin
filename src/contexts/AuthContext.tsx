import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import authService from "@/lib/axios/services/authService";
import { User } from "@/lib/axios/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = authService.getCurrentUser();
    const token = authService.getToken();

    if (storedUser && token) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);

      if (response.success && response.user) {
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Login error:", error);
      // Handle error response from backend
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Login failed. Please try again.");
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshAuth = () => {
    const storedUser = authService.getCurrentUser();
    const token = authService.getToken();
    if (storedUser && token) {
      setUser(storedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
