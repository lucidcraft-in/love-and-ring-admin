import Axios from '@/axios/axios';

// ============================================================================
// Type Definitions
// ============================================================================

export interface User {
  _id: string;
  accountFor?: string;
  fullName?: string;
  email: string;
  countryCode?: string;
  mobile?: string;
  gender?: string;
  dateOfBirth?: string;
  preferredLanguage?: string;
  heightCm?: number;
  weightKg?: number;
  maritalStatus?: string;
  bodyType?: string;
  physicallyChallenged?: boolean;
  livingWithFamily?: boolean;
  course?: string;
  highestEducation?: string;
  profession?: string;
  income?: {
    amount?: number;
    type?: string;
  };
  interests?: string[];
  personalityTraits?: string[];
  dietPreference?: string[];
  city: {
    city: string;
    state: string;
    country: string;
  };
  religion?: string;
  caste?: string;
  motherTongue?: string;
  approvalStatus?: string;
  branch?: string;
  referredBy?: string;
  profileStatus?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  emailVerified?: boolean;
  photos?: string[];
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  createdBy?: string;
}

export interface SendEmailOtpPayload {
  email: string;
}

export interface VerifyEmailOtpPayload {
  email: string;
  otp: string;
  password: string;
  accountFor?: string;
  fullName?: string;
  mobile?: string;
  countryCode?: string;
  gender?: string;
}

export interface VerifyEmailOtpResponse {
  message: string;
  user: User;
  token?: string; // If the API returns a token on creation/verification
}

// ============================================================================
// User Service
// ============================================================================

export const userService = {
  /**
   * Fetch all users
   */
  getUsers: async (params?: { skip?: number; take?: number }): Promise<User[]> => {
    const response = await Axios.get<User[]>('/api/users', {
      params: {
        skip: params?.skip || 0,
        take: params?.take || 100, // Increase default limit to 100 to catch more users
      },
    });
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    const response = await Axios.get<User>(`/api/users/${id}`);
    return response.data;
  },

  /**
   * Send Email OTP
   */
  sendEmailOtp: async (payload: SendEmailOtpPayload): Promise<{ message: string }> => {
    const response = await Axios.post<{ message: string }>('/api/users/send-otp', payload);
    return response.data;
  },

  /**
   * Verify Email OTP and Create/Verify User
   */
  verifyEmailOtp: async (payload: VerifyEmailOtpPayload): Promise<User> => {
    // Ideally the API should probably return the user object directly or nested
    // Based on slice: response.data.user
    const response = await Axios.post<VerifyEmailOtpResponse>('/api/users/verify-otp', payload);
    return response.data.user;
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string): Promise<{ message: string }> => {
    const response = await Axios.delete<{ message: string }>(`/api/users/${id}`);
    return response.data;
  },

  /**
   * Create User (Directly if needed, though otp flow seems primary for creation)
   */
  createUser: async (payload: Partial<User>): Promise<User> => {
    const response = await Axios.post<User>('/api/users', payload);
    return response.data;
  },

  /**
   * Update User
   */
  updateUser: async (id: string, payload: Partial<User>): Promise<User> => {
    const response = await Axios.put<User>(`/api/users/${id}`, payload);
    return response.data;
  },
};
