import Axios from '@/axios/axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: {
    _id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

export interface SendOTPResponse {
  message: string;
  success: boolean;
}

export interface VerifyOTPResponse {
  message: string;
  success: boolean;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await Axios.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },

  sendOTP: async (email: string): Promise<SendOTPResponse> => {
    const response = await Axios.post<SendOTPResponse>('/api/auth/request-password-reset', { email });
    return response.data;
  },

  verifyOTP: async (email: string, otp: string): Promise<VerifyOTPResponse> => {
    const response = await Axios.post<VerifyOTPResponse>('/api/auth/verify-reset-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (email: string, otp: string, newPassword: string, confirmPassword: string): Promise<ResetPasswordResponse> => {
    const response = await Axios.post<ResetPasswordResponse>('/api/auth/reset-password', {
      email,
      otp,
      newPassword,
      confirmPassword
    });
    return response.data;
  },
};
