import Axios from '@/axios/axios';

// ============================================================================
// Type Definitions
// ============================================================================

export interface ReportSummary {
  newRegistrations: number;
  monthlyRevenue: number;
  conversionRate: number;
  avgRevenuePerUser: number;
}

export interface UserTrend {
  month: number;
  users: number;
}

export interface RevenueTrend {
  month: number;
  revenue: number;
  target: number;
}

export interface MembershipDistribution {
  _id: string; // planName
  count: number;
}

export interface TopBranch {
  branch: string;
  users: number;
}

export interface BranchPerformance {
  _id: string;
  name: string;
  totalUsers: number;
  revenue: number;
}

export interface StaffActivity {
  _id: string;
  fullName: string;
  profilesHandled: number;
  matchesMade: number;
  ticketsResolved: number;
}

// ============================================================================
// Report Service
// ============================================================================

export const reportService = {
  /**
   * Get report summary cards data
   */
  getSummary: async (): Promise<ReportSummary> => {
    const response = await Axios.get<ReportSummary>('/api/report/summary');
    return response.data;
  },

  /**
   * Get user registration trend
   */
  getUserTrend: async (): Promise<UserTrend[]> => {
    const response = await Axios.get<UserTrend[]>('/api/report/users/trend');
    return response.data;
  },

  /**
   * Get revenue vs target
   */
  getRevenueVsTarget: async (): Promise<RevenueTrend[]> => {
    const response = await Axios.get<RevenueTrend[]>('/api/report/revenue-vs-target');
    return response.data;
  },

  /**
   * Get membership distribution
   */
  getMembershipDistribution: async (): Promise<MembershipDistribution[]> => {
    const response = await Axios.get<MembershipDistribution[]>('/api/report/membership');
    return response.data;
  },

  /**
   * Get top branches
   */
  getTopBranches: async (): Promise<TopBranch[]> => {
    const response = await Axios.get<TopBranch[]>('/api/report/top-branches');
    return response.data;
  },

  /**
   * Get branch performance
   */
  getBranchPerformance: async (): Promise<BranchPerformance[]> => {
    const response = await Axios.get<BranchPerformance[]>('/api/report/branch-performance');
    return response.data;
  },

  /**
   * Get staff activity
   */
  getStaffActivity: async (): Promise<StaffActivity[]> => {
    const response = await Axios.get<StaffActivity[]>('/api/report/staff-activity');
    return response.data;
  },
};
