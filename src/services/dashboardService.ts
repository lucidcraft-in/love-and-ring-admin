import Axios from "../axios/axios";

export interface DashboardCards {
  totalUsers: number;
  paidUsers: number;
  freeUsers: number;
  newUsers: number;
}

export interface VisitorStat {
  _id: {
    day: number;
    month: number;
  };
  count: number;
}

export interface DemographicStat {
  _id: string; // City name
  users: number;
}

export interface DashboardAnalytics {
  cards: DashboardCards;
  visitors: VisitorStat[];
  demographics: DemographicStat[];
}

export interface CmsStats {
  staticPages: number;
  successStories: number;
  banners: number;
}

export const dashboardService = {
  getAnalytics: async (): Promise<DashboardAnalytics> => {
    const response = await Axios.get<{ success: boolean; data: DashboardAnalytics }>("/api/dashboard/analytics");
    return response.data.data;
  },

  getCmsStats: async (): Promise<CmsStats> => {
    const response = await Axios.get<{ success: boolean; data: CmsStats }>("/api/dashboard/cms-stats");
    return response.data.data;
  },
};
