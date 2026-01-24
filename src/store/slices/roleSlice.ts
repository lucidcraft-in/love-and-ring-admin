import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  roleService,
  Role,
  CreateRolePayload,
  UpdateRolePayload,
} from '@/services/roleService';

// ============================================================================
// State Interface
// ============================================================================

interface RoleState {
  // Role List
  roles: Role[];

  // Current Role (for view/edit)
  currentRole: Role | null;

  // Loading States
  listLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  // Error Handling
  error: string | null;
}

const initialState: RoleState = {
  // Role List
  roles: [],

  // Current Role
  currentRole: null,

  // Loading States
  listLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  // Error Handling
  error: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

/**
 * Fetch all roles
 */
export const fetchRolesAsync = createAsyncThunk<
  Role[],
  void,
  { rejectValue: string }
>(
  'role/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await roleService.getRoles();
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch roles.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create new role
 */
export const createRoleAsync = createAsyncThunk<
  Role,
  CreateRolePayload,
  { rejectValue: string }
>(
  'role/createRole',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await roleService.createRole(payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create role.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update role
 */
export const updateRoleAsync = createAsyncThunk<
  Role,
  { id: string; payload: UpdateRolePayload },
  { rejectValue: string }
>(
  'role/updateRole',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await roleService.updateRole(id, payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update role.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete role
 */
export const deleteRoleAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'role/deleteRole',
  async (id, { rejectWithValue }) => {
    try {
      await roleService.deleteRole(id);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete role.';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    /**
     * Clear errors
     */
    clearRoleError: (state) => {
      state.error = null;
    },

    /**
     * Reset roles list
     */
    resetRoles: (state) => {
      state.roles = [];
      state.error = null;
    },

    /**
     * Set current role
     */
    setCurrentRole: (state, action: PayloadAction<Role | null>) => {
      state.currentRole = action.payload;
    },

    /**
     * Clear current role
     */
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========================================================================
      // Fetch Roles
      // ========================================================================
      .addCase(fetchRolesAsync.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchRolesAsync.fulfilled, (state, action: PayloadAction<Role[]>) => {
        state.listLoading = false;
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(fetchRolesAsync.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || 'Failed to fetch roles';
      })

      // ========================================================================
      // Create Role
      // ========================================================================
      .addCase(createRoleAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createRoleAsync.fulfilled, (state, action: PayloadAction<Role>) => {
        state.createLoading = false;
        // Add new role to the list
        state.roles.push(action.payload);
        state.error = null;
      })
      .addCase(createRoleAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || 'Failed to create role';
      })

      // ========================================================================
      // Update Role
      // ========================================================================
      .addCase(updateRoleAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateRoleAsync.fulfilled, (state, action: PayloadAction<Role>) => {
        state.updateLoading = false;
        // Update role in list
        const index = state.roles.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        // Update current role if it's the same one
        if (state.currentRole?._id === action.payload._id) {
          state.currentRole = action.payload;
        }
        state.error = null;
      })
      .addCase(updateRoleAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || 'Failed to update role';
      })

      // ========================================================================
      // Delete Role
      // ========================================================================
      .addCase(deleteRoleAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteRoleAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        // Remove role from list
        state.roles = state.roles.filter(r => r._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteRoleAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || 'Failed to delete role';
      });
  },
});

// ============================================================================
// Exports
// ============================================================================

export const {
  clearRoleError,
  resetRoles,
  setCurrentRole,
  clearCurrentRole,
} = roleSlice.actions;

export default roleSlice.reducer;
