import { useCallback } from "react";
import type { ConsultantUser, RegisterFormData } from "../types";

export function useConsultantAuth() {
  const login = useCallback(async (username: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation - in real app, call POST /api/auth/consultant/login
    if (username === "pending_consultant") {
      return { error: "Your account is pending approval. Please wait for admin verification." };
    }

    if (username === "rejected_consultant") {
      return { error: "Your account has been rejected. Please contact support for more information." };
    }

    if (username === "suspended_consultant") {
      return { error: "Your account has been suspended. Please contact support." };
    }

    // Successful login simulation
    if (username && password) {
      const mockConsultant: ConsultantUser = {
        id: "c1",
        username: username,
        email: `${username}@agency.com`,
        fullName: "Demo Consultant",
        role: "consultant",
        permissions: {
          create_profile: true,
          edit_profile: true,
          view_profile: true,
          delete_profile: false,
        },
      };
      sessionStorage.setItem("consultantUser", JSON.stringify(mockConsultant));
      return { success: true };
    }

    return { error: "Invalid credentials" };
  }, []);

  const register = useCallback(async (formData: RegisterFormData) => {
    // Simulate API call - Replace with actual POST /api/consultants/register
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("consultantUser");
  }, []);

  const getConsultant = useCallback((): ConsultantUser | null => {
    const stored = sessionStorage.getItem("consultantUser");
    return stored ? JSON.parse(stored) : null;
  }, []);

  return {
    login,
    register,
    logout,
    getConsultant,
  };
}
