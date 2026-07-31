import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  demographicsService,
  DemographicsData,
  DemographicsQueryParams,
} from "../../services/demographicsService";

interface DemographicsState {
  data: DemographicsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DemographicsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDemographicsAsync = createAsyncThunk(
  "demographics/fetchDemographics",
  async (params: DemographicsQueryParams | string | undefined, { rejectWithValue }) => {
    try {
      return await demographicsService.getDemographics(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch demographics");
    }
  }
);

const demographicsSlice = createSlice({
  name: "demographics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDemographicsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDemographicsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDemographicsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default demographicsSlice.reducer;
