import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  successStoryService,
  SuccessStory,
  CreateStoryPayload,
  UpdateStoryPayload,
  GetStoriesParams,
} from '@/services/successStoryService';

// ============================================================================
// State Interface
// ============================================================================

interface SuccessStoryState {
  stories: SuccessStory[];
  currentStory: SuccessStory | null;
  total: number;

  // Loading States
  listLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  // Error Handling
  error: string | null;
}

const initialState: SuccessStoryState = {
  stories: [],
  currentStory: null,
  total: 0,

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
 * Fetch stories
 */
export const fetchStoriesAsync = createAsyncThunk<
  SuccessStory[],
  GetStoriesParams | undefined,
  { rejectValue: string }
>(
  'successStory/fetchStories',
  async (params, { rejectWithValue }) => {
    try {
      const response = await successStoryService.getStories(params);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch stories.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create story
 */
export const createStoryAsync = createAsyncThunk<
  SuccessStory,
  CreateStoryPayload,
  { rejectValue: string }
>(
  'successStory/createStory',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await successStoryService.createStory(payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create story.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update story
 */
export const updateStoryAsync = createAsyncThunk<
  SuccessStory,
  { id: string; payload: UpdateStoryPayload },
  { rejectValue: string }
>(
  'successStory/updateStory',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await successStoryService.updateStory(id, payload);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update story.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete story
 */
export const deleteStoryAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'successStory/deleteStory',
  async (id, { rejectWithValue }) => {
    try {
      await successStoryService.deleteStory(id);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete story.';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const successStorySlice = createSlice({
  name: 'successStory',
  initialState,
  reducers: {
    clearStoryError: (state) => {
      state.error = null;
    },
    setCurrentStory: (state, action: PayloadAction<SuccessStory | null>) => {
      state.currentStory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stories
      .addCase(fetchStoriesAsync.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchStoriesAsync.fulfilled, (state, action: PayloadAction<SuccessStory[]>) => {
        state.listLoading = false;
        state.stories = action.payload;
        // Assuming API returns array, we approximate total for now or update API to return total
        // If API only returns array, we'll just use length for now, 
        // real pagination needs total count from backend.
        state.total = action.payload.length;
        state.error = null;
      })
      .addCase(fetchStoriesAsync.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || 'Failed to fetch stories';
      })

      // Create Story
      .addCase(createStoryAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createStoryAsync.fulfilled, (state, action: PayloadAction<SuccessStory>) => {
        state.createLoading = false;
        state.stories.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createStoryAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || 'Failed to create story';
      })

      // Update Story
      .addCase(updateStoryAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateStoryAsync.fulfilled, (state, action: PayloadAction<SuccessStory>) => {
        state.updateLoading = false;
        const index = state.stories.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.stories[index] = action.payload;
        }
        if (state.currentStory?._id === action.payload._id) {
          state.currentStory = action.payload;
        }
        state.error = null;
      })
      .addCase(updateStoryAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || 'Failed to update story';
      })

      // Delete Story
      .addCase(deleteStoryAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteStoryAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        state.stories = state.stories.filter(s => s._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        if (state.currentStory?._id === action.payload) {
          state.currentStory = null;
        }
        state.error = null;
      })
      .addCase(deleteStoryAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || 'Failed to delete story';
      });
  },
});

export const { clearStoryError, setCurrentStory } = successStorySlice.actions;
export default successStorySlice.reducer;
