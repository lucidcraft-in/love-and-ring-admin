import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  adminService,
  Admin,
  CreateAdminPayload,
  UpdateAdminPayload,
  GetAdminsParams,
  GetAdminsResponse,
  StatsCount,
} from '@/services/adminService';

// ============================================================================
// State Interface
// ============================================================================

interface AdminState {
  admins: Admin[];
  total: number;
  skip: number;
  take: number;
  currentAdmin: Admin | null;

  // Stats
  stats: StatsCount | null;

  // Loading States
  listLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  // Error Handling
  error: string | null;
}

const initialState: AdminState = {
  admins: [],
  total: 0,
  skip: 0,
  take: 10,
  currentAdmin: null,

  stats: null,

  listLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  error: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

/**
 * Fetch admins
 */
export const fetchAdminsAsync = createAsyncThunk<
  GetAdminsResponse,
  GetAdminsParams | undefined,
  { rejectValue: string }
>(
  'admin/fetchAdmins',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminService.getAdmins(params);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch admins.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create admin
 */
export const createAdminAsync = createAsyncThunk<
  Admin,
  CreateAdminPayload,
  { rejectValue: string }
>(
  'admin/createAdmin',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await adminService.createAdmin(payload);
      // Fetch the full admin object to get the populated role
      const fullAdmin = await adminService.getAdminById(response._id);
      return fullAdmin;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create admin.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update admin
 */
export const updateAdminAsync = createAsyncThunk<
  Admin,
  { id: string; payload: UpdateAdminPayload },
  { rejectValue: string }
>(
  'admin/updateAdmin',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateAdmin(id, payload);
      // Fetch the full admin object to get the populated role
      const fullAdmin = await adminService.getAdminById(response._id);
      return fullAdmin;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update admin.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete admin
 */
export const deleteAdminAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'admin/deleteAdmin',
  async (id, { rejectWithValue }) => {
    try {
      await adminService.deleteAdmin(id);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete admin.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get stats count
 */
export const getStatsCountAsync = createAsyncThunk<
  StatsCount,
  void,
  { rejectValue: string }
>(
  'admin/getStatsCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getStatsCount();
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to get stats count.';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    setCurrentAdmin: (state, action: PayloadAction<Admin | null>) => {
      state.currentAdmin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Admins
      .addCase(fetchAdminsAsync.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminsAsync.fulfilled, (state, action: PayloadAction<GetAdminsResponse>) => {
        state.listLoading = false;
        state.admins = action.payload.data;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.take = action.payload.take;
        state.error = null;
      })
      .addCase(fetchAdminsAsync.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || 'Failed to fetch admins';
      })

      // Create Admin
      .addCase(createAdminAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createAdminAsync.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.createLoading = false;
        state.admins.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createAdminAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || 'Failed to create admin';
      })

      // Update Admin
      .addCase(updateAdminAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateAdminAsync.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.updateLoading = false;
        const index = state.admins.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
        if (state.currentAdmin?._id === action.payload._id) {
          state.currentAdmin = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAdminAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || 'Failed to update admin';
      })

      // Delete Admin
      .addCase(deleteAdminAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteAdminAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        state.admins = state.admins.filter(a => a._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        if (state.currentAdmin?._id === action.payload) {
          state.currentAdmin = null;
        }
        state.error = null;
      })
      .addCase(deleteAdminAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || 'Failed to delete admin';
      })

      // Get Stats Count
      .addCase(getStatsCountAsync.fulfilled, (state, action: PayloadAction<StatsCount>) => {
        state.stats = action.payload;
      });
  },
});

export const { clearAdminError, setCurrentAdmin } = adminSlice.actions;
export default adminSlice.reducer;
