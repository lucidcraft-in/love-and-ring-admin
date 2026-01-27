import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  settingsService,
  Settings,
  NotificationsSettings,
  PaymentGatewaySettings,
  SocialLoginSettings,
} from "../../services/settingsService";

interface SettingsState {
  data: Settings | null;
  loading: boolean; // Global loading for fetch
  actionLoading: boolean; // Loading for updates
  error: string | null;
}

const initialState: SettingsState = {
  data: null,
  loading: false,
  actionLoading: false,
  error: null,
};

// Async Thunks
export const fetchSettingsAsync = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      return await settingsService.getSettings();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch settings");
    }
  }
);

export const updateGeneralSettingsAsync = createAsyncThunk(
  "settings/updateGeneral",
  async (payload: FormData, { rejectWithValue }) => {
    try {
      return await settingsService.updateGeneralSettings(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update general settings");
    }
  }
);

export const updateNotificationsAsync = createAsyncThunk(
  "settings/updateNotifications",
  async (payload: NotificationsSettings, { rejectWithValue }) => {
    try {
      return await settingsService.updateNotifications(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update notification settings");
    }
  }
);

export const updateEmailTemplateAsync = createAsyncThunk(
  "settings/updateEmailTemplate",
  async (payload: { templateKey: string; subject: string; body: string }, { rejectWithValue }) => {
    try {
      return await settingsService.updateEmailTemplate(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update email template");
    }
  }
);

export const updatePaymentGatewayAsync = createAsyncThunk(
  "settings/updatePaymentGateway",
  async (payload: PaymentGatewaySettings, { rejectWithValue }) => {
    try {
      return await settingsService.updatePaymentGateway(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update payment gateway settings");
    }
  }
);

export const updateSocialLoginAsync = createAsyncThunk(
  "settings/updateSocialLogin",
  async (payload: SocialLoginSettings, { rejectWithValue }) => {
    try {
      return await settingsService.updateSocialLogin(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update social login settings");
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Settings
    builder
      .addCase(fetchSettingsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettingsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettingsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update General
    builder
      .addCase(updateGeneralSettingsAsync.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateGeneralSettingsAsync.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.data = action.payload;
      })
      .addCase(updateGeneralSettingsAsync.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Update Notifications
    builder
      .addCase(updateNotificationsAsync.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateNotificationsAsync.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.data = action.payload;
      })
      .addCase(updateNotificationsAsync.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Update Email Template
    builder
      .addCase(updateEmailTemplateAsync.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateEmailTemplateAsync.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.data = action.payload;
      })
      .addCase(updateEmailTemplateAsync.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Update Payment Gateway
    builder
      .addCase(updatePaymentGatewayAsync.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updatePaymentGatewayAsync.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.data = action.payload;
      })
      .addCase(updatePaymentGatewayAsync.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Update Social Login
    builder
      .addCase(updateSocialLoginAsync.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateSocialLoginAsync.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.data = action.payload;
      })
      .addCase(updateSocialLoginAsync.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;
