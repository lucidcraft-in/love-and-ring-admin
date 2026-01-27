import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  dashboardService,
  DashboardAnalytics,
  CmsStats,
} from "../../services/dashboardService";

interface DashboardState {
  analytics: DashboardAnalytics | null;
  cmsStats: CmsStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  analytics: null,
  cmsStats: null,
  loading: false,
  error: null,
};

export const fetchDashboardAnalyticsAsync = createAsyncThunk(
  "dashboard/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getAnalytics();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard analytics");
    }
  }
);

export const fetchDashboardCmsStatsAsync = createAsyncThunk(
  "dashboard/fetchCmsStats",
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getCmsStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch CMS stats");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Analytics
    builder
      .addCase(fetchDashboardAnalyticsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardAnalyticsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchDashboardAnalyticsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // CMS Stats
    builder
      .addCase(fetchDashboardCmsStatsAsync.pending, (state) => {
        // We might not want to set global loading for secondary stats to avoid flickering if loaded separately,
        // but typically they load together.
      })
      .addCase(fetchDashboardCmsStatsAsync.fulfilled, (state, action) => {
        state.cmsStats = action.payload;
      })
      .addCase(fetchDashboardCmsStatsAsync.rejected, (state, action) => {
        console.error("CMS Stats fetch failed:", action.payload);
        // Optional: don't block main UI for CMS stats failure
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
