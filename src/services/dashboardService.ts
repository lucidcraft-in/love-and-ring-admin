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
    year?: number;
  };
  count: number;
}

export interface DemographicStat {
  _id: string; // City name
  users: number;
}

export interface ActivityItem {
  id: string;
  user: string;
  avatar?: string;
  action: string;
  time?: string;
  createdAt?: string;
  type?: string; // "view" | "interest" | "signup" | "like"
}

export interface SupportTicketDashboardItem {
  id: string;
  ticketId: string;
  name: string;
  email?: string;
  avatar?: string;
  subject: string;
  category?: string;
  priority?: string;
  status: string;
  message: string;
  messages?: any[];
  createdAt?: string;
}

export interface DashboardAnalytics {
  cards: DashboardCards;
  visitors: VisitorStat[];
  demographics: DemographicStat[];
  activities?: ActivityItem[];
  supportTickets?: SupportTicketDashboardItem[];
}

export interface CmsStats {
  staticPages: number;
  successStories: number;
  banners: number;
}

export interface DashboardQueryParams {
  timeframe?: string;
  visitorsRange?: string;
}

export const dashboardService = {
  getAnalytics: async (params?: DashboardQueryParams): Promise<DashboardAnalytics> => {
    const response = await Axios.get<{ success: boolean; data: DashboardAnalytics }>("/api/dashboard/analytics", { params });
    return response.data.data;
  },

  getCmsStats: async (): Promise<CmsStats> => {
    const response = await Axios.get<{ success: boolean; data: CmsStats }>("/api/dashboard/cms-stats");
    return response.data.data;
  },
};
