import Axios from "../axios/axios";

export interface TicketMessage {
  _id: string;
  senderType: "USER" | "STAFF";
  sender: {
    _id: string;
    fullName: string;
  } | string;
  senderModel: "User" | "Staff";
  message: string;
  createdAt: string;
}

export interface TicketUser {
  _id: string;
  fullName: string;
  avatar?: string; // Optional if not populated or not in schema yet
}

export interface SupportTicket {
  _id: string;
  user: TicketUser;
  subject: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Pending";
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

export const supportTicketService = {
  getTicketStats: async (): Promise<TicketStats> => {
    const response = await Axios.get<{ success: boolean; data: TicketStats }>("/api/support-tickets/stats");
    // API controller returns res.json(stats), so data might be directly in response.data or wrapped.
    // Based on user code: res.json(stats). Axios usually puts that in response.data.
    // Let's assume standard wrapper might NOT be present based on the user's controller code `res.json(stats)`.
    // Wait, typical `Axios` wrapper in this project (seen in other files) usually expects { success, data }?
    // User code provided:
    // export const getTicketStats = async (req, res) => { try { const stats = ...; res.json(stats); } ... }
    // So it returns just the object.
    const responseData = await Axios.get<TicketStats>("/api/support-tickets/stats");
    return responseData.data;
  },

  getAllTickets: async (): Promise<SupportTicket[]> => {
    // Controller: res.json(tickets);
    const response = await Axios.get<SupportTicket[]>("/api/support-tickets");
    return response.data;
  },

  getTicketById: async (id: string): Promise<SupportTicket> => {
    // Controller: res.json(ticket);
    const response = await Axios.get<SupportTicket>(`/api/support-tickets/${id}`);
    return response.data;
  },

  replyToTicket: async (id: string, message: string, status?: string): Promise<SupportTicket> => {
    const response = await Axios.post<SupportTicket>(`/api/support-tickets/${id}/reply`, { message, status });
    return response.data;
  },

  updateTicketStatus: async (id: string, status: string): Promise<SupportTicket> => {
    const response = await Axios.patch<SupportTicket>(`/api/support-tickets/${id}/status`, { status });
    return response.data;
  },

  resolveTicket: async (id: string, resolutionNote: string): Promise<SupportTicket> => {
    const response = await Axios.put<SupportTicket>(`/api/support-tickets/${id}/resolve`, { resolutionNote });
    return response.data;
  }
};
