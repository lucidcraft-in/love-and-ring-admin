import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  consultantService,
  Consultant,
  ConsultantLoginCredentials,
  ConsultantLoginResponse,
  CreateConsultantPayload,
  CreateConsultantResponse,
  UpdateConsultantPayload,
  ConsultantPermissions,
  GetConsultantsParams,
  GetConsultantsResponse,
} from '@/services/consultantService';

// ============================================================================
// State Interface
// ============================================================================

interface ConsultantState {
  // Authentication
  currentConsultant: ConsultantLoginResponse | null;
  token: string | null;
  isAuthenticated: boolean;

  // Consultant List
  consultants: Consultant[];
  total: number;
  skip: number;
  take: number;

  // Loading States
  loginLoading: boolean;
  listLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  permissionsLoading: boolean;

  // Error Handling
  error: string | null;
  loginError: string | null;
}

const initialState: ConsultantState = {
  // Authentication
  currentConsultant: null,
  token: localStorage.getItem('consultantToken'),
  isAuthenticated: !!localStorage.getItem('consultantToken'),

  // Consultant List
  consultants: [],
  total: 0,
  skip: 0,
  take: 10,

  // Loading States
  loginLoading: false,
  listLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  permissionsLoading: false,

  // Error Handling
  error: null,
  loginError: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

/**
 * Login consultant
 */
export const loginConsultantAsync = createAsyncThunk<
  ConsultantLoginResponse,
  ConsultantLoginCredentials,
  { rejectValue: string }
>(
  'consultant/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await consultantService.login(credentials);
      // Store token in localStorage
      localStorage.setItem('consultantToken', response.token);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch consultants with pagination and filtering
 */
export const fetchConsultantsAsync = createAsyncThunk<
  GetConsultantsResponse,
  GetConsultantsParams | undefined,
  { rejectValue: string }
>(
  'consultant/fetchConsultants',
  async (params, { rejectWithValue }) => {
    try {
      const response = await consultantService.getConsultants(params);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch consultants.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch consultant by ID
 */
export const fetchConsultantByIdAsync = createAsyncThunk<
  Consultant,
  string,
  { rejectValue: string }
>(
  'consultant/fetchConsultantById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await consultantService.getConsultantById(id);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch consultant.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create new consultant
 */
export const createConsultantAsync = createAsyncThunk<
  CreateConsultantResponse,
  CreateConsultantPayload,
  { rejectValue: string }
>(
  'consultant/createConsultant',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await consultantService.createConsultant(payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create consultant.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update consultant
 */
export const updateConsultantAsync = createAsyncThunk<
  Consultant,
  { id: string; payload: UpdateConsultantPayload },
  { rejectValue: string }
>(
  'consultant/updateConsultant',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await consultantService.updateConsultant(id, payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update consultant.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update consultant permissions
 */
export const updatePermissionsAsync = createAsyncThunk<
  { id: string; permissions: ConsultantPermissions },
  { id: string; permissions: Partial<ConsultantPermissions> },
  { rejectValue: string }
>(
  'consultant/updatePermissions',
  async ({ id, permissions }, { rejectWithValue }) => {
    try {
      const response = await consultantService.updatePermissions(id, permissions);
      return { id, permissions: response.permissions };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update permissions.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete consultant
 */
export const deleteConsultantAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'consultant/deleteConsultant',
  async (id, { rejectWithValue }) => {
    try {
      await consultantService.deleteConsultant(id);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete consultant.';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const consultantSlice = createSlice({
  name: 'consultant',
  initialState,
  reducers: {
    /**
     * Logout consultant
     */
    logoutConsultant: (state) => {
      state.currentConsultant = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loginError = null;
      state.error = null;
      localStorage.removeItem('consultantToken');
    },

    /**
     * Clear errors
     */
    clearConsultantError: (state) => {
      state.error = null;
      state.loginError = null;
    },

    /**
     * Reset consultants list
     */
    resetConsultants: (state) => {
      state.consultants = [];
      state.total = 0;
      state.skip = 0;
      state.error = null;
    },

    /**
     * Set current consultant (for manual updates)
     */
    setCurrentConsultant: (state, action: PayloadAction<ConsultantLoginResponse | null>) => {
      state.currentConsultant = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========================================================================
      // Login Consultant
      // ========================================================================
      .addCase(loginConsultantAsync.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(loginConsultantAsync.fulfilled, (state, action: PayloadAction<ConsultantLoginResponse>) => {
        state.loginLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.currentConsultant = action.payload;
        state.loginError = null;
      })
      .addCase(loginConsultantAsync.rejected, (state, action) => {
        state.loginLoading = false;
        state.isAuthenticated = false;
        state.currentConsultant = null;
        state.token = null;
        state.loginError = action.payload || 'Login failed';
      })

      // ========================================================================
      // Fetch Consultants
      // ========================================================================
      .addCase(fetchConsultantsAsync.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchConsultantsAsync.fulfilled, (state, action: PayloadAction<GetConsultantsResponse>) => {
        state.listLoading = false;
        state.consultants = action.payload.data;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.take = action.payload.take;
        state.error = null;
      })
      .addCase(fetchConsultantsAsync.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || 'Failed to fetch consultants';
      })

      // ========================================================================
      // Fetch Consultant By ID
      // ========================================================================
      .addCase(fetchConsultantByIdAsync.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchConsultantByIdAsync.fulfilled, (state, action: PayloadAction<Consultant>) => {
        state.listLoading = false;
        // Update consultant in list if it exists
        const index = state.consultants.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.consultants[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchConsultantByIdAsync.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || 'Failed to fetch consultant';
      })

      // ========================================================================
      // Create Consultant
      // ========================================================================
      .addCase(createConsultantAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createConsultantAsync.fulfilled, (state) => {
        state.createLoading = false;
        state.error = null;
        // Note: The new consultant will be fetched when the list is refreshed
      })
      .addCase(createConsultantAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || 'Failed to create consultant';
      })

      // ========================================================================
      // Update Consultant
      // ========================================================================
      .addCase(updateConsultantAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateConsultantAsync.fulfilled, (state, action: PayloadAction<Consultant>) => {
        state.updateLoading = false;
        // Update consultant in list
        const index = state.consultants.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.consultants[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateConsultantAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || 'Failed to update consultant';
      })

      // ========================================================================
      // Update Permissions
      // ========================================================================
      .addCase(updatePermissionsAsync.pending, (state) => {
        state.permissionsLoading = true;
        state.error = null;
      })
      .addCase(updatePermissionsAsync.fulfilled, (state, action: PayloadAction<{ id: string; permissions: ConsultantPermissions }>) => {
        state.permissionsLoading = false;
        // Update permissions in consultant list
        const index = state.consultants.findIndex(c => c._id === action.payload.id);
        if (index !== -1) {
          state.consultants[index].permissions = action.payload.permissions;
        }
        state.error = null;
      })
      .addCase(updatePermissionsAsync.rejected, (state, action) => {
        state.permissionsLoading = false;
        state.error = action.payload || 'Failed to update permissions';
      })

      // ========================================================================
      // Delete Consultant
      // ========================================================================
      .addCase(deleteConsultantAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteConsultantAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        // Remove consultant from list
        state.consultants = state.consultants.filter(c => c._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        state.error = null;
      })
      .addCase(deleteConsultantAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || 'Failed to delete consultant';
      });
  },
});

// ============================================================================
// Exports
// ============================================================================

export const {
  logoutConsultant,
  clearConsultantError,
  resetConsultants,
  setCurrentConsultant,
} = consultantSlice.actions;

export default consultantSlice.reducer;
