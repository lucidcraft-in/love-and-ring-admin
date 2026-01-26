import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  bannerService,
  Banner,
  CreateBannerPayload,
  UpdateBannerPayload,
} from '@/services/bannerService';

// ============================================================================
// State Interface
// ============================================================================

interface BannerState {
  banners: Banner[];
  currentBanner: Banner | null;

  // Loading States
  listLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  // Error Handling
  error: string | null;
}

const initialState: BannerState = {
  banners: [],
  currentBanner: null,

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
 * Fetch banners
 */
export const fetchBannersAsync = createAsyncThunk<
  Banner[],
  void,
  { rejectValue: string }
>(
  'banner/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bannerService.getBanners();
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch banners.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create banner
 */
export const createBannerAsync = createAsyncThunk<
  Banner,
  CreateBannerPayload,
  { rejectValue: string }
>(
  'banner/createBanner',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await bannerService.createBanner(payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create banner.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update banner
 */
export const updateBannerAsync = createAsyncThunk<
  Banner,
  { id: string; payload: UpdateBannerPayload },
  { rejectValue: string }
>(
  'banner/updateBanner',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await bannerService.updateBanner(id, payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update banner.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete banner
 */
export const deleteBannerAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'banner/deleteBanner',
  async (id, { rejectWithValue }) => {
    try {
      await bannerService.deleteBanner(id);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete banner.';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    clearBannerError: (state) => {
      state.error = null;
    },
    setCurrentBanner: (state, action: PayloadAction<Banner | null>) => {
      state.currentBanner = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Banners
      .addCase(fetchBannersAsync.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchBannersAsync.fulfilled, (state, action: PayloadAction<Banner[]>) => {
        state.listLoading = false;
        state.banners = action.payload;
        state.error = null;
      })
      .addCase(fetchBannersAsync.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || 'Failed to fetch banners';
      })

      // Create Banner
      .addCase(createBannerAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createBannerAsync.fulfilled, (state, action: PayloadAction<Banner>) => {
        state.createLoading = false;
        state.banners.unshift(action.payload);
        state.error = null;
      })
      .addCase(createBannerAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || 'Failed to create banner';
      })

      // Update Banner
      .addCase(updateBannerAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateBannerAsync.fulfilled, (state, action: PayloadAction<Banner>) => {
        state.updateLoading = false;
        const index = state.banners.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
        if (state.currentBanner?._id === action.payload._id) {
          state.currentBanner = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBannerAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || 'Failed to update banner';
      })

      // Delete Banner
      .addCase(deleteBannerAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteBannerAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        // In this case, since delete is "soft delete" (status=Inactive) and getBanners returns only Active,
        // we can remove it from the list.
        state.banners = state.banners.filter(b => b._id !== action.payload);
        if (state.currentBanner?._id === action.payload) {
          state.currentBanner = null;
        }
        state.error = null;
      })
      .addCase(deleteBannerAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || 'Failed to delete banner';
      });
  },
});

export const { clearBannerError, setCurrentBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
