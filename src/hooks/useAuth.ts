import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginThunk, checkAuthThunk, logout as logoutAction, refreshAuth as refreshAuthAction } from '@/store/slices/authSlice';

/**
 * Custom hook to access auth state and actions from Redux
 * This replaces the old useAuth hook from AuthContext
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  // Check for existing session on mount
  useEffect(() => {
    dispatch(checkAuthThunk());
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await dispatch(loginThunk({ email, password })).unwrap();
      return !!result;
    } catch (error: any) {
      throw new Error(error || 'Login failed. Please try again.');
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const refreshAuth = () => {
    dispatch(refreshAuthAction());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshAuth,
  };
}
