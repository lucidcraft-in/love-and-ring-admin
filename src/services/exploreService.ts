import Axios from "@/axios/axios";

export interface ExploreItem {
  _id: string;
  title: string;
  description?: string;
  coupleName?: string;
  weddingDate?: string;
  type: "image" | "video";
  imageUrl?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  thumbnailUrl?: string;
  status: "Active" | "Inactive";
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const exploreService = {
  getExploreItems: async (): Promise<ExploreItem[]> => {
    const response = await Axios.get<ExploreItem[]>("/api/cms/explore");
    return response.data;
  },

  createExploreItem: async (formData: FormData): Promise<ExploreItem> => {
    const response = await Axios.post<ExploreItem>("/api/cms/explore", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateExploreItem: async (id: string, formData: FormData): Promise<ExploreItem> => {
    const response = await Axios.put<ExploreItem>(`/api/cms/explore/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteExploreItem: async (id: string): Promise<{ message: string }> => {
    const response = await Axios.delete<{ message: string }>(`/api/cms/explore/${id}`);
    return response.data;
  },

  toggleExploreStatus: async (id: string): Promise<ExploreItem> => {
    const response = await Axios.patch<ExploreItem>(`/api/cms/explore/${id}/toggle-status`);
    return response.data;
  },
};
