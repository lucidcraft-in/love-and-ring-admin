import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../axios/axios';

// Interfaces for master data types
export interface Religion {
  _id: string;
  name: string;
  status: string;
}

export interface Caste {
  _id: string;
  name: string;
  religion?: Religion | string;
  status: string;
}

export interface Location {
  _id: string;
  city: string;
  state: string;
  country: string;
  status: string;
}

export interface Language {
  _id: string;
  name: string;
  status: string;
}

export interface Education {
  _id: string;
  name: string;
  status: string;
}

export interface Occupation {
  _id: string;
  name: string;
  status: string;
}

interface MasterDataState {
  religions: Religion[];
  castes: Caste[];
  locations: Location[];
  languages: Language[];
  educations: Education[];
  occupations: Occupation[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MasterDataState = {
  religions: [],
  castes: [],
  locations: [],
  languages: [],
  educations: [],
  occupations: [],
  isLoading: false,
  error: null,
};

// Async thunk for fetching religions
export const fetchReligionsAsync = createAsyncThunk<
  Religion[],
  void,
  { rejectValue: string }
>(
  'masterData/fetchReligions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get('/api/master/religions');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch religions';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for fetching castes
export const fetchCastesAsync = createAsyncThunk<
  Caste[],
  void,
  { rejectValue: string }
>(
  'masterData/fetchCastes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get('/api/master/castes');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch castes';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for fetching locations
export const fetchLocationsAsync = createAsyncThunk<
  Location[],
  void,
  { rejectValue: string }
>(
  'masterData/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get('/api/master/locations');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch locations';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for fetching languages
export const fetchLanguagesAsync = createAsyncThunk<
  Language[],
  void,
  { rejectValue: string }
>(
  'masterData/fetchLanguages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get('/api/master/languages');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch languages';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for fetching educations
export const fetchEducationsAsync = createAsyncThunk<
  Education[],
  void,
  { rejectValue: string }
>(
  'masterData/fetchEducations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get('/api/master/educations');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch educations';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for fetching occupations
export const fetchOccupationsAsync = createAsyncThunk<
  Occupation[],
  void,
  { rejectValue: string }
>(
  'masterData/fetchOccupations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get('/api/master/occupations');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch occupations';
      return rejectWithValue(message);
    }
  }
);

const masterDataSlice = createSlice({
  name: 'masterData',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Religions
      .addCase(fetchReligionsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReligionsAsync.fulfilled, (state, action: PayloadAction<Religion[]>) => {
        state.isLoading = false;
        state.religions = action.payload;
      })
      .addCase(fetchReligionsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch religions';
      })
      // Castes
      .addCase(fetchCastesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCastesAsync.fulfilled, (state, action: PayloadAction<Caste[]>) => {
        state.isLoading = false;
        state.castes = action.payload;
      })
      .addCase(fetchCastesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch castes';
      })
      // Locations
      .addCase(fetchLocationsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLocationsAsync.fulfilled, (state, action: PayloadAction<Location[]>) => {
        state.isLoading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocationsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch locations';
      })
      // Languages
      .addCase(fetchLanguagesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLanguagesAsync.fulfilled, (state, action: PayloadAction<Language[]>) => {
        state.isLoading = false;
        state.languages = action.payload;
      })
      .addCase(fetchLanguagesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch languages';
      })
      // Educations
      .addCase(fetchEducationsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEducationsAsync.fulfilled, (state, action: PayloadAction<Education[]>) => {
        state.isLoading = false;
        state.educations = action.payload;
      })
      .addCase(fetchEducationsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch educations';
      })
      // Occupations
      .addCase(fetchOccupationsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOccupationsAsync.fulfilled, (state, action: PayloadAction<Occupation[]>) => {
        state.isLoading = false;
        state.occupations = action.payload;
      })
      .addCase(fetchOccupationsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch occupations';
      });
  },
});

export const { clearError } = masterDataSlice.actions;
export default masterDataSlice.reducer;
