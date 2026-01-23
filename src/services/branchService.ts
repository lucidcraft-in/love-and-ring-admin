import Axios from '@/axios/axios';

// ============================================================================
// Type Definitions
// ============================================================================

export interface Branch {
  _id: string;
  name: string;
  location: string;
  managerName: string;
  totalUsers: number;
  premiumUsers: number;
  monthlyRevenue: number;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBranchPayload {
  name: string;
  city: string;
  state: string;
  managerName: string;
  email: string;
  phone: string;
  address?: string;
  pincode?: string;
}

export interface UpdateBranchPayload {
  name?: string;
  city?: string;
  state?: string;
  managerName?: string;
  email?: string;
  phone?: string;
  address?: string;
  pincode?: string;
  status?: 'Active' | 'Inactive';
}

export interface GetBranchesParams {
  skip?: number;
  take?: number;
  status?: 'Active' | 'Inactive';
}

export interface GetBranchesResponse {
  total: number;
  skip: number;
  take: number;
  data: Branch[];
}

// ============================================================================
// Branch Service
// ============================================================================

export const branchService = {
  /**
   * Create new branch
   */
  createBranch: async (payload: CreateBranchPayload): Promise<Branch> => {
    const response = await Axios.post<Branch>('/api/branches', payload);
    return response.data;
  },

  /**
   * Get branches list with pagination and filtering
   */
  getBranches: async (params?: GetBranchesParams): Promise<GetBranchesResponse> => {
    const response = await Axios.get<GetBranchesResponse>('/api/branches', {
      params: {
        skip: params?.skip || 0,
        take: params?.take || 10,
        status: params?.status,
      },
    });
    return response.data;
  },

  /**
   * Get branch by ID
   */
  getBranchById: async (id: string): Promise<Branch> => {
    const response = await Axios.get<Branch>(`/api/branches/${id}`);
    return response.data;
  },

  /**
   * Update branch information
   */
  updateBranch: async (
    id: string,
    payload: UpdateBranchPayload
  ): Promise<Branch> => {
    const response = await Axios.put<Branch>(`/api/branches/${id}`, payload);
    return response.data;
  },

  /**
   * Delete branch (soft delete)
   */
  deleteBranch: async (id: string): Promise<{ message: string }> => {
    const response = await Axios.delete<{ message: string }>(`/api/branches/${id}`);
    return response.data;
  },
};
