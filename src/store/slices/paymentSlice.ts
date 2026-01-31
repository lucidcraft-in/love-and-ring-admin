import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { paymentService } from "../../services/paymentService";
import {
  Transaction,
  PaymentDashboardStats,
  MembershipPlan,
  CreatePlanPayload,
  AddOfflinePaymentPayload
} from "../../types/payment";

interface PaymentState {
  transactions: Transaction[];
  stats: PaymentDashboardStats | null;
  plans: MembershipPlan[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  transactions: [],
  stats: null,
  plans: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchTransactions = createAsyncThunk(
  "payment/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      return await paymentService.getAllTransactions();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch transactions");
    }
  }
);

export const fetchPaymentStats = createAsyncThunk(
  "payment/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await paymentService.getPaymentDashboardStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

export const addOfflinePayment = createAsyncThunk(
  "payment/addOffline",
  async (data: AddOfflinePaymentPayload, { rejectWithValue, dispatch }) => {
    try {
      const result = await paymentService.addOfflinePayment(data);
      dispatch(fetchTransactions()); // Refresh transactions
      dispatch(fetchPaymentStats()); // Refresh stats
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add payment");
    }
  }
);

// Membership Plans Thunks
export const fetchPlans = createAsyncThunk(
  "payment/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      return await paymentService.getAllPlans();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch plans");
    }
  }
);

export const createPlan = createAsyncThunk(
  "payment/createPlan",
  async (data: CreatePlanPayload, { rejectWithValue, dispatch }) => {
    try {
      const result = await paymentService.createPlan(data);
      dispatch(fetchPlans()); // Refresh plans
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create plan");
    }
  }
);

export const updatePlan = createAsyncThunk(
  "payment/updatePlan",
  async ({ id, data }: { id: string; data: Partial<CreatePlanPayload> }, { rejectWithValue, dispatch }) => {
    try {
      const result = await paymentService.updatePlan(id, data);
      dispatch(fetchPlans()); // Refresh plans
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update plan");
    }
  }
);

export const deletePlan = createAsyncThunk(
  "payment/deletePlan",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const result = await paymentService.deletePlan(id);
      dispatch(fetchPlans()); // Refresh plans
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete plan");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Stats
      .addCase(fetchPaymentStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchPaymentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Plans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default paymentSlice.reducer;
