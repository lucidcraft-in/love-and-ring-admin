import apiClient from '../apiClient';
import { LoginRequest, LoginResponse, User } from '../types';

class AuthService {
  /**
   * Login admin user
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const payload: LoginRequest = { email, password };
    const response = await apiClient.post<LoginResponse>('/api/auth/login', payload);

    // Store token if login successful
    if (response.success && response.token) {
      sessionStorage.setItem('authToken', response.token);
      sessionStorage.setItem('adminUser', JSON.stringify(response.user));
    }

    return response;
  }

  /**
   * Logout admin user
   */
  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('adminUser');
  }

  /**
   * Get current user from storage
   */
  getCurrentUser(): User | null {
    const userStr = sessionStorage.getItem('adminUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  /**
   * Fetch current user details from API (optional - for token validation)
   */
  async fetchCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; user: User }>('/api/auth/me');
    return response.user;
  }
}

export default new AuthService();
