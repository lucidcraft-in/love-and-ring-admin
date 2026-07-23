import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, LoginCredentials, LoginResponse } from '@/services/authService';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Safely retrieve token from localStorage
const getInitialToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined') {
    return null;
  }
  return token;
};

// Safely retrieve user data from localStorage on refresh
const getInitialUser = (): User | null => {
  try {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      return {
        id: parsed.admin?._id || parsed.user?.id || '',
        email: parsed.admin?.email || parsed.user?.email || '',
        name: parsed.admin?.name || parsed.user?.name,
        role: parsed.admin?.role || parsed.user?.role,
      };
    }
  } catch (e) {
    console.error("Failed to parse auth from localStorage", e);
  }
  return null;
};

const initialToken = getInitialToken();

const initialState: AuthState = {
  user: getInitialUser(),
  token: initialToken,
  isAuthenticated: !!initialToken,
  isLoading: false,
  error: null,
};

// Async thunk for login
export const loginAsync = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      // Store token and auth object in localStorage
      localStorage.setItem('auth', JSON.stringify(response));
      localStorage.setItem('token', response.token);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear all auth items from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          id: action.payload.admin?._id || '',
          email: action.payload.admin?.email || '',
          name: action.payload.admin?.name,
          role: action.payload.admin?.role,
        };
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || 'An error occurred during login';
        // Cleanup storage on failed login
        localStorage.removeItem('token');
        localStorage.removeItem('auth');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;