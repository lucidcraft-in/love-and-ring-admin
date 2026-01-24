import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  staffService,
  Staff,
  CreateStaffPayload,
  UpdateStaffPayload,
  GetStaffParams,
  GetStaffResponse,
} from '@/services/staffService';

// ============================================================================
// State Interface
// ============================================================================

interface StaffState {
  // Staff List
  staffList: Staff[];
  total: number;
  skip: number;
  take: number;

  // Current Staff (for view/edit)
  currentStaff: Staff | null;

  // Loading States
  listLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  detailLoading: boolean;

  // Error Handling
  error: string | null;
}

const initialState: StaffState = {
  // Staff List
  staffList: [],
  total: 0,
  skip: 0,
  take: 10,

  // Current Staff
  currentStaff: null,

  // Loading States
  listLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  detailLoading: false,

  // Error Handling
  error: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

/**
 * Fetch staff list with pagination and filtering
 */
export const fetchStaffListAsync = createAsyncThunk<
  GetStaffResponse,
  GetStaffParams | undefined,
  { rejectValue: string }
>(
  'staff/fetchStaffList',
  async (params, { rejectWithValue }) => {
    try {
      const response = await staffService.getStaffList(params);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch staff list.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch staff by ID
 */
export const fetchStaffByIdAsync = createAsyncThunk<
  Staff,
  string,
  { rejectValue: string }
>(
  'staff/fetchStaffById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await staffService.getStaffById(id);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch staff details.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create new staff member
 */
export const createStaffAsync = createAsyncThunk<
  Staff,
  CreateStaffPayload,
  { rejectValue: string }
>(
  'staff/createStaff',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await staffService.createStaff(payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create staff member.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update staff member
 */
export const updateStaffAsync = createAsyncThunk<
  Staff,
  { id: string; payload: UpdateStaffPayload },
  { rejectValue: string }
>(
  'staff/updateStaff',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await staffService.updateStaff(id, payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update staff member.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update staff status
 */
export const updateStaffStatusAsync = createAsyncThunk<
  { id: string; status: string },
  { id: string; status: 'Active' | 'Inactive' },
  { rejectValue: string }
>(
  'staff/updateStaffStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await staffService.updateStaffStatus(id, status);
      return { id, status };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update staff status.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete staff member
 */
export const deleteStaffAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'staff/deleteStaff',
  async (id, { rejectWithValue }) => {
    try {
      await staffService.deleteStaff(id);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete staff member.';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    /**
     * Clear errors
     */
    clearStaffError: (state) => {
      state.error = null;
    },

    /**
     * Reset staff list
     */
    resetStaffList: (state) => {
      state.staffList = [];
      state.total = 0;
      state.skip = 0;
      state.error = null;
    },

    /**
     * Set current staff
     */
    setCurrentStaff: (state, action: PayloadAction<Staff | null>) => {
      state.currentStaff = action.payload;
    },

    /**
     * Clear current staff
     */
    clearCurrentStaff: (state) => {
      state.currentStaff = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========================================================================
      // Fetch Staff List
      // ========================================================================
      .addCase(fetchStaffListAsync.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchStaffListAsync.fulfilled, (state, action: PayloadAction<GetStaffResponse>) => {
        state.listLoading = false;
        state.staffList = action.payload.data;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.take = action.payload.take;
        state.error = null;
      })
      .addCase(fetchStaffListAsync.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || 'Failed to fetch staff list';
      })

      // ========================================================================
      // Fetch Staff By ID
      // ========================================================================
      .addCase(fetchStaffByIdAsync.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchStaffByIdAsync.fulfilled, (state, action: PayloadAction<Staff>) => {
        state.detailLoading = false;
        state.currentStaff = action.payload;
        // Update staff in list if it exists
        const index = state.staffList.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.staffList[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchStaffByIdAsync.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload || 'Failed to fetch staff details';
      })

      // ========================================================================
      // Create Staff
      // ========================================================================
      .addCase(createStaffAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createStaffAsync.fulfilled, (state, action: PayloadAction<Staff>) => {
        state.createLoading = false;
        // Add new staff to the beginning of the list
        state.staffList.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createStaffAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || 'Failed to create staff member';
      })

      // ========================================================================
      // Update Staff
      // ========================================================================
      .addCase(updateStaffAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateStaffAsync.fulfilled, (state, action: PayloadAction<Staff>) => {
        state.updateLoading = false;
        // Update staff in list
        const index = state.staffList.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.staffList[index] = action.payload;
        }
        // Update current staff if it's the same one
        if (state.currentStaff?._id === action.payload._id) {
          state.currentStaff = action.payload;
        }
        state.error = null;
      })
      .addCase(updateStaffAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || 'Failed to update staff member';
      })

      // ========================================================================
      // Update Staff Status
      // ========================================================================
      .addCase(updateStaffStatusAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateStaffStatusAsync.fulfilled, (state, action: PayloadAction<{ id: string; status: string }>) => {
        state.updateLoading = false;
        // Update staff status in list
        const index = state.staffList.findIndex(s => s._id === action.payload.id);
        if (index !== -1) {
          state.staffList[index].status = action.payload.status as 'Active' | 'Inactive';
        }
        state.error = null;
      })
      .addCase(updateStaffStatusAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || 'Failed to update staff status';
      })

      // ========================================================================
      // Delete Staff
      // ========================================================================
      .addCase(deleteStaffAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteStaffAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        // Remove staff from list
        state.staffList = state.staffList.filter(s => s._id !== action.payload);
        state.total -= 1;
        state.error = null;
      })
      .addCase(deleteStaffAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || 'Failed to delete staff member';
      });
  },
});

// ============================================================================
// Exports
// ============================================================================

export const {
  clearStaffError,
  resetStaffList,
  setCurrentStaff,
  clearCurrentStaff,
} = staffSlice.actions;

export default staffSlice.reducer;
