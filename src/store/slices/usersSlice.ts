import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../axios/axios';

export interface User {
  _id: string;
  accountFor?: string;
  fullName?: string;
  email: string;
  countryCode?: string;
  mobile?: string;
  gender?: string;
  dateOfBirth?: string;
  preferredLanguage?: string;
  heightCm?: number;
  weightKg?: number;
  maritalStatus?: string;
  bodyType?: string;
  physicallyChallenged?: boolean;
  livingWithFamily?: boolean;
  course?: string;
  highestEducation?: string;
  profession?: string;
  income?: {
    amount?: number;
    type?: string;
  };
  interests?: string[];
  personalityTraits?: string[];
  dietPreference?: string[];
  city: {
    city: string;
    state: string;
    country: string;
  };
  religion?: string;
  caste?: string;
  motherTongue?: string;
  approvalStatus?: string;
  branch?: string;
  referredBy?: string;
  profileStatus?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  emailVerified?: boolean;
  photos?: string[];
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
}

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  otpLoading: boolean;
  verificationLoading: boolean;
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
  otpSent: false,
  otpLoading: false,
  verificationLoading: false,
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
      const response = await Axios.get('/api/users');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch users. Please try again.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for sending email OTP
export const sendEmailOtpAsync = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>(
  'users/sendEmailOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/users/send-otp', { email });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for verifying OTP and creating user
export const verifyEmailOtpAsync = createAsyncThunk<
  User,
  {
    email: string;
    otp: string;
    password: string;
    accountFor?: string;
    fullName?: string;
    mobile?: string;
    countryCode?: string;
    gender?: string;
  },
  { rejectValue: string }
>(
  'users/verifyEmailOtp',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/users/verify-otp', userData);
      return response.data.user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to verify OTP. Please try again.';
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
      });
  },
});

export const { clearError, resetUsers, resetOtpState } = usersSlice.actions;
export default usersSlice.reducer;
