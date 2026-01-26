import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  staticPageService,
  StaticPage,
  CreatePagePayload,
  UpdatePagePayload,
} from '@/services/staticPageService';

// ============================================================================
// State Interface
// ============================================================================

interface StaticPageState {
  pages: StaticPage[];
  currentPage: StaticPage | null;

  // Loading States
  listLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;

  // Error Handling
  error: string | null;
}

const initialState: StaticPageState = {
  pages: [],
  currentPage: null,

  listLoading: false,
  createLoading: false,
  updateLoading: false,

  error: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

/**
 * Fetch all pages
 */
export const fetchPagesAsync = createAsyncThunk<
  StaticPage[],
  void,
  { rejectValue: string }
>(
  'staticPage/fetchPages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await staticPageService.getAllPages();
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch pages.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create page
 */
export const createPageAsync = createAsyncThunk<
  StaticPage,
  CreatePagePayload,
  { rejectValue: string }
>(
  'staticPage/createPage',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await staticPageService.createPage(payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create page.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update page
 */
export const updatePageAsync = createAsyncThunk<
  StaticPage,
  { id: string; payload: UpdatePagePayload },
  { rejectValue: string }
>(
  'staticPage/updatePage',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await staticPageService.updatePage(id, payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update page.';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const staticPageSlice = createSlice({
  name: 'staticPage',
  initialState,
  reducers: {
    clearPageError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action: PayloadAction<StaticPage | null>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Pages
      .addCase(fetchPagesAsync.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchPagesAsync.fulfilled, (state, action: PayloadAction<StaticPage[]>) => {
        state.listLoading = false;
        state.pages = action.payload;
        state.error = null;
      })
      .addCase(fetchPagesAsync.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || 'Failed to fetch pages';
      })

      // Create Page
      .addCase(createPageAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createPageAsync.fulfilled, (state, action: PayloadAction<StaticPage>) => {
        state.createLoading = false;
        state.pages.push(action.payload);
        state.error = null;
      })
      .addCase(createPageAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || 'Failed to create page';
      })

      // Update Page
      .addCase(updatePageAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updatePageAsync.fulfilled, (state, action: PayloadAction<StaticPage>) => {
        state.updateLoading = false;
        const index = state.pages.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.pages[index] = action.payload;
        }
        if (state.currentPage?._id === action.payload._id) {
          state.currentPage = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePageAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || 'Failed to update page';
      });
  },
});

export const { clearPageError, setCurrentPage } = staticPageSlice.actions;
export default staticPageSlice.reducer;
