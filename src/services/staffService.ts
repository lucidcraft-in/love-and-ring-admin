import Axios from '@/axios/axios';

// ============================================================================
// Type Definitions
// ============================================================================

export interface ConsultantLoginCredentials {
  email: string;
  password: string;
}

export interface ConsultantLoginResponse {
  _id: string;
  fullName: string;
  email: string;
  role: Role;
  permissions: any; // Add specific permissions if needed
  token: string;
}

export interface Staff {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  // role: Role;
  // branch?: Branch;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt?: string;
  permissions: StaffPermissions;
}

export interface StaffPermissions {
  createProfile: boolean;
  editProfile: boolean;
  viewProfile: boolean;
  deleteProfile: boolean;
}

export interface CreateStaffPayload {
  fullName: string;
  email: string;
  phone?: string;
  // role: string; // ID
  // branch?: string; // ID
  password: string;
  confirmPassword: string
}

export interface Role {
  _id: string;
  name: string;
}

// export interface Branch {
//   _id: string;
//   name: string;
// }

export interface UpdateStaffPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string; // ID
  // branch?: string; // ID
  password?: string;
}

export interface GetStaffParams {
  skip?: number;
  take?: number;
  role?: Role;
  // branch?: Branch;
  status?: 'Active' | 'Inactive';
  search?: string;
}

export interface GetStaffResponse {
  total: number;
  skip: number;
  take: number;
  data: Staff[];
}

export interface UpdateStaffStatusPayload {
  status: 'Active' | 'Inactive';
}

// ============================================================================
// Staff Service
// ============================================================================

export const staffService = {
  /**
   * Login staff
   */
  login: async (credentials: ConsultantLoginCredentials): Promise<ConsultantLoginResponse> => {
    // Using consultant login endpoint or staff specific? Assuming staff specific if available, but users asked to replicate consultant.
    // Consultant endpoint: /api/consultants/login. Staff might need /api/staff/login.
    // Based on patterns, it should be /api/staff/login.
    const response = await Axios.post<ConsultantLoginResponse>(
      '/api/staff/login',
      credentials
    );
    return response.data;
  },

  /**
   * Create new staff member
   */
  createStaff: async (payload: CreateStaffPayload): Promise<Staff> => {
    const response = await Axios.post<Staff>('/api/staff', payload);
    return response.data;
  },

  /**
   * Get staff list with pagination and filtering
   */
  getStaffList: async (params?: GetStaffParams): Promise<GetStaffResponse> => {
    const response = await Axios.get<GetStaffResponse>('/api/staff', {
      params: {
        skip: params?.skip || 0,
        take: params?.take || 10,
        role: params?.role,
        // branch: params?.branch,
        status: params?.status,
        search: params?.search,
      },
    });
    return response.data;
  },

  /**
   * Get staff by ID
   */
  getStaffById: async (id: string): Promise<Staff> => {
    const response = await Axios.get<Staff>(`/api/staff/${id}`);
    return response.data;
  },

  /**
   * Update staff information
   */
  updateStaff: async (
    id: string,
    payload: UpdateStaffPayload
  ): Promise<Staff> => {
    const response = await Axios.put<Staff>(`/api/staff/${id}`, payload);
    return response.data;
  },

  /**
   * Update staff status
   */
  updateStaffStatus: async (
    id: string,
    status: 'Active' | 'Inactive'
  ): Promise<{ message: string; status: string }> => {
    const response = await Axios.patch<{ message: string; status: string }>(
      `/api/staff/${id}/status`,
      { status }
    );
    return response.data;
  },

  /**
   * Delete staff (soft delete)
   */
  deleteStaff: async (id: string): Promise<{ message: string }> => {
    const response = await Axios.delete<{ message: string }>(`/api/staff/${id}`);
    return response.data;
  },

  /**
   * Update staff permissions
   */
  updatePermissions: async (
    id: string,
    permissions: Partial<StaffPermissions>
  ): Promise<{ message: string; permissions: StaffPermissions }> => {
    const response = await Axios.put<{ message: string; permissions: StaffPermissions }>(
      `/api/staff/${id}/permissions`,
      { permissions }
    );
    return response.data;
  },

};
