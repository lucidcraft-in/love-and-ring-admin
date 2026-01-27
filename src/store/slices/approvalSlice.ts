import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  approvalService,
  PendingProfile,
  ApprovalStats,
} from "../../services/approvalService";

interface ApprovalState {
  pendingProfiles: PendingProfile[];
  stats: ApprovalStats | null;
  loading: boolean;
  error: string | null;
  selectedProfile: PendingProfile | null;
  totalPending: number;
}

const initialState: ApprovalState = {
  pendingProfiles: [],
  stats: null,
  loading: false,
  error: null,
  selectedProfile: null,
  totalPending: 0,
};

export const fetchPendingProfilesAsync = createAsyncThunk(
  "approvals/fetchPendingProfiles",
  async ({ take, skip }: { take: number; skip: number }, { rejectWithValue }) => {
    try {
      return await approvalService.getPendingProfiles(take, skip);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch pending profiles");
    }
  }
);

export const fetchApprovalStatsAsync = createAsyncThunk(
  "approvals/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await approvalService.getApprovalStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch approval stats");
    }
  }
);

export const approveProfileAsync = createAsyncThunk(
  "approvals/approveProfile",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await approvalService.approveProfile(id);
      dispatch(fetchApprovalStatsAsync()); // Refresh stats
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to approve profile");
    }
  }
);

export const rejectProfileAsync = createAsyncThunk(
  "approvals/rejectProfile",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await approvalService.rejectProfile(id);
      dispatch(fetchApprovalStatsAsync()); // Refresh stats
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to reject profile");
    }
  }
);

const approvalSlice = createSlice({
  name: "approvals",
  initialState,
  reducers: {
    setSelectedProfile: (state, action: PayloadAction<PendingProfile | null>) => {
      state.selectedProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Pending Profiles
    builder
      .addCase(fetchPendingProfilesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingProfilesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingProfiles = action.payload.data;
        state.totalPending = action.payload.total;
      })
      .addCase(fetchPendingProfilesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Stats
    builder.addCase(fetchApprovalStatsAsync.fulfilled, (state, action) => {
      state.stats = action.payload;
    });

    // Approve
    builder.addCase(approveProfileAsync.fulfilled, (state, action) => {
      state.pendingProfiles = state.pendingProfiles.filter((p) => p._id !== action.payload);
      state.totalPending -= 1;
      if (state.selectedProfile?._id === action.payload) {
        state.selectedProfile = null;
      }
    });

    // Reject
    builder.addCase(rejectProfileAsync.fulfilled, (state, action) => {
      state.pendingProfiles = state.pendingProfiles.filter((p) => p._id !== action.payload);
      state.totalPending -= 1;
      if (state.selectedProfile?._id === action.payload) {
        state.selectedProfile = null;
      }
    });
  },
});

export const { setSelectedProfile } = approvalSlice.actions;
export default approvalSlice.reducer;
