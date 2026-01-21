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
  city:{
    city:string;
    state:string;
    country:string;
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
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
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
      });
  },
});

export const { clearError, resetUsers } = usersSlice.actions;
export default usersSlice.reducer;
