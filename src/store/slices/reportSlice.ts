import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  reportService,
  ReportSummary,
  UserTrend,
  RevenueTrend,
  MembershipDistribution,
  TopBranch,
  BranchPerformance,
  StaffActivity
} from '@/services/reportService';

// ============================================================================
// State Interface
// ============================================================================

interface ReportState {
  // Data
  summary: ReportSummary | null;
  userTrends: UserTrend[];
  revenueTrends: RevenueTrend[];
  membershipDistribution: MembershipDistribution[];
  topBranches: TopBranch[];
  branchPerformance: BranchPerformance[];
  staffActivity: StaffActivity[];

  // Loading States
  summaryLoading: boolean;
  userTrendsLoading: boolean;
  revenueTrendsLoading: boolean;
  membershipLoading: boolean;
  topBranchesLoading: boolean;
  branchPerformanceLoading: boolean;
  staffActivityLoading: boolean;

  // Error Handling
  error: string | null;
}

const initialState: ReportState = {
  summary: null,
  userTrends: [],
  revenueTrends: [],
  membershipDistribution: [],
  topBranches: [],
  branchPerformance: [],
  staffActivity: [],

  summaryLoading: false,
  userTrendsLoading: false,
  revenueTrendsLoading: false,
  membershipLoading: false,
  topBranchesLoading: false,
  branchPerformanceLoading: false,
  staffActivityLoading: false,

  error: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

export const fetchReportSummaryAsync = createAsyncThunk<
  ReportSummary,
  void,
  { rejectValue: string }
>(
  'reports/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.getSummary();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report summary');
    }
  }
);

export const fetchUserTrendAsync = createAsyncThunk<
  UserTrend[],
  void,
  { rejectValue: string }
>(
  'reports/fetchUserTrend',
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.getUserTrend();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user trends');
    }
  }
);

export const fetchRevenueVsTargetAsync = createAsyncThunk<
  RevenueTrend[],
  void,
  { rejectValue: string }
>(
  'reports/fetchRevenueVsTarget',
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.getRevenueVsTarget();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch revenue trends');
    }
  }
);

export const fetchMembershipDistributionAsync = createAsyncThunk<
  MembershipDistribution[],
  void,
  { rejectValue: string }
>(
  'reports/fetchMembershipDistribution',
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.getMembershipDistribution();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch membership distribution');
    }
  }
);

export const fetchTopBranchesAsync = createAsyncThunk<
  TopBranch[],
  void,
  { rejectValue: string }
>(
  'reports/fetchTopBranches',
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.getTopBranches();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top branches');
    }
  }
);

export const fetchBranchPerformanceAsync = createAsyncThunk<
  BranchPerformance[],
  void,
  { rejectValue: string }
>(
  'reports/fetchBranchPerformance',
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.getBranchPerformance();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch branch performance');
    }
  }
);

export const fetchStaffActivityAsync = createAsyncThunk<
  StaffActivity[],
  void,
  { rejectValue: string }
>(
  'reports/fetchStaffActivity',
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.getStaffActivity();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch staff activity');
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchReportSummaryAsync.pending, (state) => {
        state.summaryLoading = true;
        state.error = null;
      })
      .addCase(fetchReportSummaryAsync.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchReportSummaryAsync.rejected, (state, action) => {
        state.summaryLoading = false;
        state.error = action.payload as string;
      })

      // User Trends
      .addCase(fetchUserTrendAsync.pending, (state) => {
        state.userTrendsLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTrendAsync.fulfilled, (state, action) => {
        state.userTrendsLoading = false;
        state.userTrends = action.payload;
      })
      .addCase(fetchUserTrendAsync.rejected, (state, action) => {
        state.userTrendsLoading = false;
        state.error = action.payload as string;
      })

      // Revenue Trends
      .addCase(fetchRevenueVsTargetAsync.pending, (state) => {
        state.revenueTrendsLoading = true;
        state.error = null;
      })
      .addCase(fetchRevenueVsTargetAsync.fulfilled, (state, action) => {
        state.revenueTrendsLoading = false;
        state.revenueTrends = action.payload;
      })
      .addCase(fetchRevenueVsTargetAsync.rejected, (state, action) => {
        state.revenueTrendsLoading = false;
        state.error = action.payload as string;
      })

      // Membership Distribution
      .addCase(fetchMembershipDistributionAsync.pending, (state) => {
        state.membershipLoading = true;
        state.error = null;
      })
      .addCase(fetchMembershipDistributionAsync.fulfilled, (state, action) => {
        state.membershipLoading = false;
        state.membershipDistribution = action.payload;
      })
      .addCase(fetchMembershipDistributionAsync.rejected, (state, action) => {
        state.membershipLoading = false;
        state.error = action.payload as string;
      })

      // Top Branches
      .addCase(fetchTopBranchesAsync.pending, (state) => {
        state.topBranchesLoading = true;
        state.error = null;
      })
      .addCase(fetchTopBranchesAsync.fulfilled, (state, action) => {
        state.topBranchesLoading = false;
        state.topBranches = action.payload;
      })
      .addCase(fetchTopBranchesAsync.rejected, (state, action) => {
        state.topBranchesLoading = false;
        state.error = action.payload as string;
      })

      // Branch Performance
      .addCase(fetchBranchPerformanceAsync.pending, (state) => {
        state.branchPerformanceLoading = true;
        state.error = null;
      })
      .addCase(fetchBranchPerformanceAsync.fulfilled, (state, action) => {
        state.branchPerformanceLoading = false;
        state.branchPerformance = action.payload;
      })
      .addCase(fetchBranchPerformanceAsync.rejected, (state, action) => {
        state.branchPerformanceLoading = false;
        state.error = action.payload as string;
      })

      // Staff Activity
      .addCase(fetchStaffActivityAsync.pending, (state) => {
        state.staffActivityLoading = true;
        state.error = null;
      })
      .addCase(fetchStaffActivityAsync.fulfilled, (state, action) => {
        state.staffActivityLoading = false;
        state.staffActivity = action.payload;
      })
      .addCase(fetchStaffActivityAsync.rejected, (state, action) => {
        state.staffActivityLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReportError } = reportSlice.actions;

export default reportSlice.reducer;
