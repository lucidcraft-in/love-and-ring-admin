import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  masterDataService,
  MasterItem,
  MasterDataType,
  CreateMasterItemPayload,
  UpdateMasterItemPayload,
  GetMasterDataParams,
  MasterDataResponse
} from '@/services/masterDataService';

// ============================================================================
// State Interface
// ============================================================================

interface MasterDataState {
  data: MasterItem[];
  total: number;
  skip: number;
  take: number;
  currentItem: MasterItem | null;
  currentType: MasterDataType | null;

  // Loading States
  listLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  // Error Handling
  error: string | null;
}

const initialState: MasterDataState = {
  data: [],
  total: 0,
  skip: 0,
  take: 10,
  currentItem: null,
  currentType: null,

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
 * Fetch generic master data
 */
export const fetchMasterDataAsync = createAsyncThunk<
  MasterDataResponse & { type: MasterDataType },
  { type: MasterDataType; params?: GetMasterDataParams },
  { rejectValue: string }
>(
  'masterData/fetchData',
  async ({ type, params }, { rejectWithValue }) => {
    try {
      const response = await masterDataService.getItems(type, params);
      return { ...response, type };
    } catch (error: any) {
      const message = error.response?.data?.message || `Failed to fetch ${type}.`;
      return rejectWithValue(message);
    }
  }
);

/**
 * Create item
 */
export const createMasterDataAsync = createAsyncThunk<
  MasterItem,
  { type: MasterDataType; payload: CreateMasterItemPayload },
  { rejectValue: string }
>(
  'masterData/createItem',
  async ({ type, payload }, { rejectWithValue }) => {
    try {
      const response = await masterDataService.createItem(type, payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create item.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update item
 */
export const updateMasterDataAsync = createAsyncThunk<
  MasterItem,
  { type: MasterDataType; id: string; payload: UpdateMasterItemPayload },
  { rejectValue: string }
>(
  'masterData/updateItem',
  async ({ type, id, payload }, { rejectWithValue }) => {
    try {
      const response = await masterDataService.updateItem(type, id, payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update item.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete item
 */
export const deleteMasterDataAsync = createAsyncThunk<
  string, // Return ID
  { type: MasterDataType; id: string },
  { rejectValue: string }
>(
  'masterData/deleteItem',
  async ({ type, id }, { rejectWithValue }) => {
    try {
      await masterDataService.deleteItem(type, id);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete item.';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const masterDataSlice = createSlice({
  name: 'masterData',
  initialState,
  reducers: {
    clearMasterDataError: (state) => {
      state.error = null;
    },
    setCurrentMasterItem: (state, action: PayloadAction<MasterItem | null>) => {
      state.currentItem = action.payload;
    },
    setMasterDataType: (state, action: PayloadAction<MasterDataType>) => {
      state.currentType = action.payload;
      // Optionally clear data when type changes to avoid showing wrong data while loading
      state.data = [];
      state.total = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Data
      .addCase(fetchMasterDataAsync.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchMasterDataAsync.fulfilled, (state, action) => {
        state.listLoading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.take = action.payload.take;
        state.currentType = action.payload.type;
        state.error = null;
      })
      .addCase(fetchMasterDataAsync.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || 'Failed to fetch data';
      })

      // Create Item
      .addCase(createMasterDataAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createMasterDataAsync.fulfilled, (state, action: PayloadAction<MasterItem>) => {
        state.createLoading = false;
        state.data.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createMasterDataAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || 'Failed to create item';
      })

      // Update Item
      .addCase(updateMasterDataAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateMasterDataAsync.fulfilled, (state, action: PayloadAction<MasterItem>) => {
        state.updateLoading = false;
        const index = state.data.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        if (state.currentItem?._id === action.payload._id) {
          state.currentItem = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMasterDataAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || 'Failed to update item';
      })

      // Delete Item
      .addCase(deleteMasterDataAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteMasterDataAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        state.data = state.data.filter(i => i._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        if (state.currentItem?._id === action.payload) {
          state.currentItem = null;
        }
        state.error = null;
      })
      .addCase(deleteMasterDataAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || 'Failed to delete item';
      });
  },
});

export const { clearMasterDataError, setCurrentMasterItem, setMasterDataType } = masterDataSlice.actions;
export default masterDataSlice.reducer;
