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

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await Axios.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },
};
