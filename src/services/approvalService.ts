import Axios from "../axios/axios";

export interface PendingProfile {
  _id: string;
  fullName: string;
  email: string;
  agencyName?: string;
  regions?: string[];
  createdAt: string;
}

export interface PaginationResult<T> {
  total: number;
  skip: number;
  take: number;
  data: T[];
}

export interface ApprovalStats {
  pendingConsultants: number;
  approvedToday: number;
}

export const approvalService = {
  getPendingProfiles: async (take = 10, skip = 0): Promise<PaginationResult<PendingProfile>> => {
    const response = await Axios.get<PaginationResult<PendingProfile>>(`/api/approvals/profiles?take=${take}&skip=${skip}`);
    return response.data;
  },

  getApprovalStats: async (): Promise<ApprovalStats> => {
    const response = await Axios.get<ApprovalStats>("/api/approvals/stats");
    return response.data;
  },

  approveProfile: async (id: string): Promise<void> => {
    await Axios.put(`/api/approvals/profiles/${id}/approve`);
  },

  rejectProfile: async (id: string): Promise<void> => {
    await Axios.put(`/api/approvals/profiles/${id}/reject`);
  }
};
