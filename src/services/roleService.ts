import Axios from '@/axios/axios';

// ============================================================================
// Type Definitions
// ============================================================================

export interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions?: Record<string, boolean>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissions?: Record<string, boolean>;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissions?: Record<string, boolean>;
}

// ============================================================================
// Role Service
// ============================================================================

export const roleService = {
  /**
   * Create new role
   */
  createRole: async (payload: CreateRolePayload): Promise<Role> => {
    const response = await Axios.post<Role>('/api/roles', payload);
    return response.data;
  },

  /**
   * Get all roles
   */
  getRoles: async (): Promise<Role[]> => {
    const response = await Axios.get<Role[]>('/api/roles');
    return response.data;
  },

  /**
   * Update role
   */
  updateRole: async (
    id: string,
    payload: UpdateRolePayload
  ): Promise<Role> => {
    const response = await Axios.put<Role>(`/api/roles/${id}`, payload);
    return response.data;
  },

  /**
   * Delete role
   */
  deleteRole: async (id: string): Promise<{ message: string }> => {
    const response = await Axios.delete<{ message: string }>(`/api/roles/${id}`);
    return response.data;
  },
};
