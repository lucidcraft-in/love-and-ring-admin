import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService, User, SendEmailOtpPayload, VerifyEmailOtpPayload } from '../../services/userService';

export type { User, SendEmailOtpPayload, VerifyEmailOtpPayload };


interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  otpLoading: boolean;
  verificationLoading: boolean;
  deleteLoading: boolean;
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
  otpSent: false,
  otpLoading: false,
  verificationLoading: false,
  deleteLoading: false,
};

// Async thunk for fetching users
export const fetchUsersAsync = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getUsers();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch users. Please try again.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for sending email OTP
export const sendEmailOtpAsync = createAsyncThunk<
  { message: string },
  SendEmailOtpPayload,
  { rejectValue: string }
>(
  'users/sendEmailOtp',
  async (payload, { rejectWithValue }) => {
    try {
      return await userService.sendEmailOtp(payload);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for verifying OTP and creating user
export const verifyEmailOtpAsync = createAsyncThunk<
  User,
  VerifyEmailOtpPayload,
  { rejectValue: string }
>(
  'users/verifyEmailOtp',
  async (payload, { rejectWithValue }) => {
    try {
      return await userService.verifyEmailOtp(payload);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to verify OTP. Please try again.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for deleting user
export const deleteUserAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await userService.deleteUser(userId);
      return userId;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete user. Please try again.';
      return rejectWithValue(message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetUsers: (state) => {
      state.users = [];
      state.error = null;
      state.isLoading = false;
    },
    resetOtpState: (state) => {
      state.otpSent = false;
      state.otpLoading = false;
      state.verificationLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred while fetching users';
      })
      // Send OTP cases
      .addCase(sendEmailOtpAsync.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(sendEmailOtpAsync.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpSent = true;
        state.error = null;
      })
      .addCase(sendEmailOtpAsync.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpSent = false;
        state.error = action.payload || 'Failed to send OTP';
      })
      // Verify OTP cases
      .addCase(verifyEmailOtpAsync.pending, (state) => {
        state.verificationLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailOtpAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.verificationLoading = false;
        state.users.push(action.payload);
        state.error = null;
        state.otpSent = false;
      })
      .addCase(verifyEmailOtpAsync.rejected, (state, action) => {
        state.verificationLoading = false;
        state.error = action.payload || 'Failed to verify OTP';
      })
      // Delete User cases
      .addCase(deleteUserAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || 'Failed to delete user';
      });
  },
});

export const { clearError, resetUsers, resetOtpState } = usersSlice.actions;
export default usersSlice.reducer;
