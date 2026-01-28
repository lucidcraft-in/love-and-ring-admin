import Axios from '@/axios/axios';

// ============================================================================
// Type Definitions
// ============================================================================

export interface ConsultantPermissions {
  createProfile: boolean;
  editProfile: boolean;
  viewProfile: boolean;
  deleteProfile: boolean;
}

export interface ConsultantStats {
  total: number;
  active: number;
  pending: number;
  rejected: number;
}

// API Response interface for stats endpoint
export interface ConsultantStatsResponse {
  _id: null;
  totalConsultants: number;
  totalActiveConsultants: number;
  totalPendingConsultants: number;
  totalInactiveConsultants: number;
}

export interface Consultant {
  _id: string;
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber?: string;
  // branch: {
  //   _id: string;
  //   name: string;
  //   city: string;
  //   state: string;
  // };
  regions: string[];
  profilesCreated: number;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
  permissions: ConsultantPermissions;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt?: string;
  lastLogin: string;
}

export interface ConsultantLoginCredentials {
  email: string;
  password: string;
}

export interface ConsultantLoginResponse {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  agencyName?: string;
  userRole: string;
  permissions: ConsultantPermissions;
  token: string;
}

export interface CreateConsultantPayload {
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  licenseNumber?: string;
  // branch: string;
  regions?: string;
  password: string;
  confirmPassword: string;
}

export interface CreateConsultantResponse {
  id: string;
  message: string;
}

export interface UpdateConsultantPayload {
  username?: string;
  fullName?: string;
  phone?: string;
  licenseNumber?: string;
  agencyName?: string;
  regions?: string[];
  status?: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
}

export interface UpdatePermissionsPayload {
  permissions: Partial<ConsultantPermissions>;
}

export interface GetConsultantsParams {
  skip?: number;
  take?: number;
  status?: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
}

export interface GetConsultantsResponse {
  total: number;
  skip: number;
  take: number;
  data: Consultant[];
}

// ============================================================================
// Consultant Service
// ============================================================================

export const consultantService = {
  /**
   * Login consultant
   */
  login: async (credentials: ConsultantLoginCredentials): Promise<ConsultantLoginResponse> => {
    const response = await Axios.post<ConsultantLoginResponse>(
      '/api/consultants/login',
      credentials
    );
    return response.data;
  },

  /**
   * Create new consultant (registration)
   */
  createConsultant: async (payload: CreateConsultantPayload): Promise<CreateConsultantResponse> => {
    const response = await Axios.post<CreateConsultantResponse>(
      '/api/consultants',
      payload
    );
    return response.data;
  },

  /**
   * Get consultants list with pagination and filtering
   */
  getConsultants: async (params?: GetConsultantsParams): Promise<GetConsultantsResponse> => {
    const response = await Axios.get<GetConsultantsResponse>('/api/consultants', {
      params: {
        skip: params?.skip || 0,
        take: params?.take || 10,
        status: params?.status,
      },
    });
    return response.data;
  },

  /**
   * Get consultant by ID
   */
  getConsultantById: async (id: string): Promise<Consultant> => {
    const response = await Axios.get<Consultant>(`/api/consultants/${id}`);
    return response.data;
  },

  /**
   * Update consultant information
   */
  updateConsultant: async (
    id: string,
    payload: UpdateConsultantPayload
  ): Promise<Consultant> => {
    const response = await Axios.put<Consultant>(`/api/consultants/${id}`, payload);
    return response.data;
  },

  /**
   * Update consultant permissions
   */
  updatePermissions: async (
    id: string,
    permissions: Partial<ConsultantPermissions>
  ): Promise<{ message: string; permissions: ConsultantPermissions }> => {
    const response = await Axios.put<{ message: string; permissions: ConsultantPermissions }>(
      `/api/consultants/${id}/permissions`,
      { permissions }
    );
    return response.data;
  },

  /**
   * Delete consultant
   */
  deleteConsultant: async (id: string): Promise<{ message: string }> => {
    const response = await Axios.delete<{ message: string }>(`/api/consultants/${id}`);
    return response.data;
  },

  /**
   * Get consultant statistics (total counts for each status)
   */
  getConsultantStats: async (): Promise<ConsultantStats> => {
    const response = await Axios.get<ConsultantStatsResponse>('/api/consultants/stats');
    const data = response.data;

    // Map API response to our internal format
    return {
      total: data.totalConsultants,
      active: data.totalActiveConsultants,
      pending: data.totalPendingConsultants,
      rejected: data.totalInactiveConsultants, // Mapping inactive to rejected
    };
  },
};
