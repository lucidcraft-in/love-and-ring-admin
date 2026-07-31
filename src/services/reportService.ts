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

export interface ReportQueryParams {
  timeframe?: string;
  year?: string;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Report Service
// ============================================================================

export const reportService = {
  /**
   * Get report summary cards data
   */
  getSummary: async (params?: ReportQueryParams): Promise<ReportSummary> => {
    const response = await Axios.get<ReportSummary>('/api/report/summary', {
      params
    });
    return response.data;
  },

  /**
   * Get user registration trend
   */
  getUserTrend: async (params?: ReportQueryParams): Promise<UserTrend[]> => {
    const response = await Axios.get<UserTrend[]>('/api/report/users/trend', {
      params
    });
    return response.data;
  },

  /**
   * Get revenue vs target
   */
  getRevenueVsTarget: async (params?: ReportQueryParams): Promise<RevenueTrend[]> => {
    const response = await Axios.get<RevenueTrend[]>('/api/report/revenue-vs-target', {
      params
    });
    return response.data;
  },

  /**
   * Get membership distribution
   */
  getMembershipDistribution: async (params?: ReportQueryParams): Promise<MembershipDistribution[]> => {
    const response = await Axios.get<MembershipDistribution[]>('/api/report/membership', {
      params
    });
    return response.data;
  },

  /**
   * Get top branches
   */
  getTopBranches: async (params?: ReportQueryParams): Promise<TopBranch[]> => {
    const response = await Axios.get<TopBranch[]>('/api/report/top-branches', {
      params
    });
    return response.data;
  },

  /**
   * Get branch performance
   */
  getBranchPerformance: async (params?: ReportQueryParams): Promise<BranchPerformance[]> => {
    const response = await Axios.get<BranchPerformance[]>('/api/report/branch-performance', {
      params
    });
    return response.data;
  },

  /**
   * Get staff activity
   */
  getStaffActivity: async (params?: ReportQueryParams): Promise<StaffActivity[]> => {
    const response = await Axios.get<StaffActivity[]>('/api/report/staff-activity', {
      params
    });
    return response.data;
  },
};
