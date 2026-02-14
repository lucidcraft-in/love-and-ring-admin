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
  // course?: string;
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
  // branch?: string;
  referredBy?: string;
  profileStatus?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  emailVerified?: boolean;
  photos?: {
    url: string;
    isPrimary: boolean;
    uploadedAt: string;
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    _id?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  createdBy?: { _id: string; fullName: string, email:string };
  createdByModel?:string
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

export interface GetUsersResponse {
  data: User[];
  total: number;
  skip: number;
  take: number;
}

export const userService = {
  /**
   * Fetch all users
   */
  getUsers: async (params?: { skip?: number; take?: number }): Promise<GetUsersResponse> => {
    const response = await Axios.get<GetUsersResponse | User[]>('/api/users', {
      params: {
        skip: params?.skip || 0,
        take: params?.take || 10,
      },
    });

    // Handle both array response (legacy) and object response (paginated)
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length,
        skip: params?.skip || 0,
        take: params?.take || 10,
      };
    }
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

  /**
   * Upload User Photos
   */
  uploadUserPhotos: async (userId: string, formData: FormData): Promise<User['photos']> => {
    const response = await Axios.post<{ message: string; photos: User['photos'] }>(
      `/api/users/${userId}/photos`,
      formData,
      {
        headers: {
          'Content-Type': undefined,
        },
      }
    );
    return response.data.photos;
  },

  /**
   * Delete User Photo
   */
  deleteUserPhoto: async (userId: string, photoUrl: string): Promise<User['photos']> => {
    const response = await Axios.delete<{ message: string; photos: User['photos'] }>(
      `/api/users/${userId}/photos`,
      {
        data: { photoUrl }
      }
    );
    return response.data.photos;
  },
};
