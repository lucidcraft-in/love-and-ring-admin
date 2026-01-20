import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '@/lib/axios/services/authService';
import { User } from '@/lib/axios/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Async thunk for login
export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);

      if (response.success && response.user) {
        return response.user;
      }
      return rejectWithValue('Login failed');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to check existing session
export const checkAuthThunk = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = authService.getCurrentUser();
      const token = authService.getToken();

      if (storedUser && token) {
        return storedUser;
      }
      return rejectWithValue('No active session');
    } catch (error) {
      return rejectWithValue('Session check failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    refreshAuth: (state) => {
      const storedUser = authService.getCurrentUser();
      const token = authService.getToken();
      if (storedUser && token) {
        state.user = storedUser;
        state.isAuthenticated = true;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login thunk
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check auth thunk
    builder
      .addCase(checkAuthThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthThunk.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, refreshAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
