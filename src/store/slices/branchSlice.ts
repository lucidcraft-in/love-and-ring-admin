import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  branchService,
  Branch,
  CreateBranchPayload,
  UpdateBranchPayload,
  GetBranchesParams,
  GetBranchesResponse,
} from '@/services/branchService';

// ============================================================================
// State Interface
// ============================================================================

interface BranchState {
  // Branch List
  branches: Branch[];
  total: number;
  skip: number;
  take: number;

  // Loading States
  listLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  // Error Handling
  error: string | null;
}

const initialState: BranchState = {
  // Branch List
  branches: [],
  total: 0,
  skip: 0,
  take: 10,

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
 * Fetch branches with pagination and filtering
 */
export const fetchBranchesAsync = createAsyncThunk<
  GetBranchesResponse,
  GetBranchesParams | undefined,
  { rejectValue: string }
>(
  'branch/fetchBranches',
  async (params, { rejectWithValue }) => {
    try {
      const response = await branchService.getBranches(params);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch branches.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch branch by ID
 */
export const fetchBranchByIdAsync = createAsyncThunk<
  Branch,
  string,
  { rejectValue: string }
>(
  'branch/fetchBranchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await branchService.getBranchById(id);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch branch.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create new branch
 */
export const createBranchAsync = createAsyncThunk<
  Branch,
  CreateBranchPayload,
  { rejectValue: string }
>(
  'branch/createBranch',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await branchService.createBranch(payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create branch.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update branch
 */
export const updateBranchAsync = createAsyncThunk<
  Branch,
  { id: string; payload: UpdateBranchPayload },
  { rejectValue: string }
>(
  'branch/updateBranch',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await branchService.updateBranch(id, payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update branch.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete branch
 */
export const deleteBranchAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'branch/deleteBranch',
  async (id, { rejectWithValue }) => {
    try {
      await branchService.deleteBranch(id);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete branch.';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    /**
     * Clear errors
     */
    clearBranchError: (state) => {
      state.error = null;
    },

    /**
     * Reset branches list
     */
    resetBranches: (state) => {
      state.branches = [];
      state.total = 0;
      state.skip = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========================================================================
      // Fetch Branches
      // ========================================================================
      .addCase(fetchBranchesAsync.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchBranchesAsync.fulfilled, (state, action: PayloadAction<GetBranchesResponse>) => {
        state.listLoading = false;
        state.branches = action.payload.data;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.take = action.payload.take;
        state.error = null;
      })
      .addCase(fetchBranchesAsync.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || 'Failed to fetch branches';
      })

      // ========================================================================
      // Fetch Branch By ID
      // ========================================================================
      .addCase(fetchBranchByIdAsync.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchBranchByIdAsync.fulfilled, (state, action: PayloadAction<Branch>) => {
        state.listLoading = false;
        // Update branch in list if it exists
        const index = state.branches.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchBranchByIdAsync.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || 'Failed to fetch branch';
      })

      // ========================================================================
      // Create Branch
      // ========================================================================
      .addCase(createBranchAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createBranchAsync.fulfilled, (state, action: PayloadAction<Branch>) => {
        state.createLoading = false;
        // Add new branch to the beginning of the list
        state.branches.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createBranchAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || 'Failed to create branch';
      })

      // ========================================================================
      // Update Branch
      // ========================================================================
      .addCase(updateBranchAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateBranchAsync.fulfilled, (state, action: PayloadAction<Branch>) => {
        state.updateLoading = false;
        // Update branch in list
        const index = state.branches.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBranchAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || 'Failed to update branch';
      })

      // ========================================================================
      // Delete Branch
      // ========================================================================
      .addCase(deleteBranchAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteBranchAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        // Remove branch from list or update status to Inactive
        const index = state.branches.findIndex(b => b._id === action.payload);
        if (index !== -1) {
          state.branches[index].status = 'Inactive';
        }
        state.error = null;
      })
      .addCase(deleteBranchAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || 'Failed to delete branch';
      });
  },
});

// ============================================================================
// Exports
// ============================================================================

export const {
  clearBranchError,
  resetBranches,
} = branchSlice.actions;

export default branchSlice.reducer;
