import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  supportTicketService,
  SupportTicket,
  TicketStats,
} from "../../services/supportTicketService";

interface SupportTicketState {
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  stats: TicketStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: SupportTicketState = {
  tickets: [],
  selectedTicket: null,
  stats: null,
  loading: false,
  error: null,
};

export const fetchTicketStatsAsync = createAsyncThunk(
  "supportTickets/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await supportTicketService.getTicketStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch ticket stats");
    }
  }
);

export const fetchAllTicketsAsync = createAsyncThunk(
  "supportTickets/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await supportTicketService.getAllTickets();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tickets");
    }
  }
);

export const fetchTicketByIdAsync = createAsyncThunk(
  "supportTickets/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await supportTicketService.getTicketById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch ticket details");
    }
  }
);

export const replyToTicketAsync = createAsyncThunk(
  "supportTickets/reply",
  async ({ id, message, status }: { id: string; message: string; status?: string }, { rejectWithValue }) => {
    try {
      return await supportTicketService.replyToTicket(id, message, status);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to reply to ticket");
    }
  }
);

export const updateTicketStatusAsync = createAsyncThunk(
  "supportTickets/updateStatus",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      return await supportTicketService.updateTicketStatus(id, status);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update ticket status");
    }
  }
);

export const resolveTicketAsync = createAsyncThunk(
  "supportTickets/resolve",
  async ({ id, resolutionNote }: { id: string; resolutionNote: string }, { rejectWithValue }) => {
    try {
      return await supportTicketService.resolveTicket(id, resolutionNote);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to resolve ticket");
    }
  }
);

const supportTicketSlice = createSlice({
  name: "supportTickets",
  initialState,
  reducers: {
    setSelectedTicket: (state, action: PayloadAction<SupportTicket | null>) => {
      state.selectedTicket = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Stats
    builder.addCase(fetchTicketStatsAsync.fulfilled, (state, action) => {
      state.stats = action.payload;
    });

    // All Tickets
    builder
      .addCase(fetchAllTicketsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTicketsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchAllTicketsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Single Ticket
    builder.addCase(fetchTicketByIdAsync.fulfilled, (state, action) => {
      state.selectedTicket = action.payload;
      // Update in list if exists
      const index = state.tickets.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
    });

    // Actions (Reply, Update, Resolve) -> Update local state
    const updateTicketInState = (state: SupportTicketState, action: PayloadAction<SupportTicket>) => {
      const updatedTicket = action.payload;
      const index = state.tickets.findIndex(t => t._id === updatedTicket._id);
      if (index !== -1) {
        state.tickets[index] = updatedTicket;
      }
      if (state.selectedTicket && state.selectedTicket._id === updatedTicket._id) {
        state.selectedTicket = updatedTicket;
      }
    };

    builder.addCase(replyToTicketAsync.fulfilled, (state, action) => updateTicketInState(state, action));
    builder.addCase(updateTicketStatusAsync.fulfilled, (state, action) => updateTicketInState(state, action));
    builder.addCase(resolveTicketAsync.fulfilled, (state, action) => updateTicketInState(state, action));
  },
});

export const { setSelectedTicket, clearError } = supportTicketSlice.actions;
export default supportTicketSlice.reducer;
