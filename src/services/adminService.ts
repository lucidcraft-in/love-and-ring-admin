import Axios from '@/axios/axios';
import { Role } from './roleService';

// ============================================================================
// Type Definitions
// ============================================================================

export interface Admin {
  _id: string;
  fullName: string;
  email: string;
  role: Role  // Role object on populate, string ID on creation/update
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAdminPayload {
  fullName: string;
  email: string;
  password: string;
  role: string; // Role ID
  status?: 'Active' | 'Inactive';
}

export interface UpdateAdminPayload {
  fullName?: string;
  email?: string;
  password?: string;
  role?: string; // Role ID
  status?: 'Active' | 'Inactive';
}

export interface GetAdminsParams {
  skip?: number;
  take?: number;
  role?: string;
}

export interface GetAdminsResponse {
  total: number;
  skip: number;
  take: number;
  data: Admin[];
}

export interface StatsCount {
  totalAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;
  totalRoles: number;
}

// ============================================================================
// Admin Service
// ============================================================================

export const adminService = {
  /**
   * Get all admins with pagination and filtering
   */
  getAdmins: async (params?: GetAdminsParams): Promise<GetAdminsResponse> => {
    const response = await Axios.get<GetAdminsResponse>('/api/admin', {
      params: {
        skip: params?.skip || 0,
        take: params?.take || 10,
        role: params?.role,
      },
    });
    return response.data;
  },

  /**
   * Get admin by ID
   */
  getAdminById: async (id: string): Promise<Admin> => {
    const response = await Axios.get<Admin>(`/api/admin/${id}`);
    return response.data;
  },

  /**
   * Create new admin
   */
  createAdmin: async (payload: CreateAdminPayload): Promise<Admin> => {
    const response = await Axios.post<Admin>('/api/admin', payload);
    return response.data;
  },

  /**
   * Update admin
   */
  updateAdmin: async (id: string, payload: UpdateAdminPayload): Promise<Admin> => {
    const response = await Axios.put<Admin>(`/api/admin/${id}`, payload);
    return response.data;
  },

  /**
   * Delete admin
   */
  deleteAdmin: async (id: string): Promise<{ message: string }> => {
    const response = await Axios.delete<{ message: string }>(`/api/admin/${id}`);
    return response.data;
  },

  /**
   * Get stats count
   */
  getStatsCount: async (): Promise<StatsCount> => {
    const response = await Axios.get<StatsCount>('/api/admin/stats');
    return response.data;
  },
};
