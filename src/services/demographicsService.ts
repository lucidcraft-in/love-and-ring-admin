import Axios from "../axios/axios";

export interface DistributionItem {
  _id: string;
  count: number;
}

export interface AgeDistributionItem {
  _id: number; // Age range start
  male: number;
  female: number;
}

export interface DemographicsData {
  genderDistribution: DistributionItem[];
  religionDistribution: DistributionItem[];
  ageDistribution: AgeDistributionItem[];
  topLocations: DistributionItem[];
  educationLevel: DistributionItem[];
}

export interface DemographicsQueryParams {
  timeline?: string;
  startDate?: string;
  endDate?: string;
}

export const demographicsService = {
  getDemographics: async (params?: DemographicsQueryParams | string): Promise<DemographicsData> => {
    const queryParams = typeof params === "string" ? { timeline: params } : params;
    const response = await Axios.get<{ success: boolean; data: DemographicsData }>("/api/demographics", {
      params: queryParams
    });
    return response.data.data;
  },
};
