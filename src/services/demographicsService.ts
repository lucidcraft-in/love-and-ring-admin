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

export const demographicsService = {
  getDemographics: async (): Promise<DemographicsData> => {
    const response = await Axios.get<{ success: boolean; data: DemographicsData }>("/api/demographics");
    return response.data.data;
  },
};
