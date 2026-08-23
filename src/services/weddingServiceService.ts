import Axios from "@/axios/axios";

export interface WeddingServiceItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  priceRange?: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: "Active" | "Inactive";
  order?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceEnquiryItem {
  _id: string;
  enquiryId: string;
  service?: WeddingServiceItem;
  serviceTitle: string;
  serviceCategory: string;
  name: string;
  email: string;
  phone?: string;
  eventDate?: string;
  message?: string;
  status: "Pending" | "Contacted" | "Resolved" | "Cancelled";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const weddingServiceCategories = [
  "Photographers",
  "Catering Teams",
  "Wedding Halls & Venues",
  "Decorators",
  "Makeup Artists",
  "DJ & Music",
  "Bridal Wear",
  "Transportation",
  "Event Management",
  "Cocktail Launch",
  "Anchors & Hostesses",
  "Other Services",
];

export const weddingServiceService = {
  getWeddingServices: async (): Promise<WeddingServiceItem[]> => {
    const response = await Axios.get<WeddingServiceItem[]>("/api/cms/wedding-services");
    return response.data;
  },

  createWeddingService: async (formData: FormData): Promise<WeddingServiceItem> => {
    const response = await Axios.post<WeddingServiceItem>("/api/cms/wedding-services", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateWeddingService: async (id: string, formData: FormData): Promise<WeddingServiceItem> => {
    const response = await Axios.put<WeddingServiceItem>(`/api/cms/wedding-services/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteWeddingService: async (id: string): Promise<{ message: string }> => {
    const response = await Axios.delete<{ message: string }>(`/api/cms/wedding-services/${id}`);
    return response.data;
  },

  toggleWeddingServiceStatus: async (id: string): Promise<WeddingServiceItem> => {
    const response = await Axios.patch<WeddingServiceItem>(`/api/cms/wedding-services/${id}/toggle-status`);
    return response.data;
  },

  // Service Enquiries
  getServiceEnquiries: async (): Promise<ServiceEnquiryItem[]> => {
    const response = await Axios.get<ServiceEnquiryItem[]>("/api/cms/wedding-services/enquiries");
    return response.data;
  },

  updateServiceEnquiryStatus: async (
    id: string,
    payload: { status?: string; notes?: string; notifyClient?: boolean }
  ): Promise<ServiceEnquiryItem> => {
    const response = await Axios.patch<ServiceEnquiryItem>(
      `/api/cms/wedding-services/enquiries/${id}`,
      payload
    );
    return response.data;
  },

  deleteServiceEnquiry: async (id: string): Promise<{ message: string }> => {
    const response = await Axios.delete<{ message: string }>(
      `/api/cms/wedding-services/enquiries/${id}`
    );
    return response.data;
  },
};
