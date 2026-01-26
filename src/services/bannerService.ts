import Axios from '@/axios/axios';

// ============================================================================
// Type Definitions
// ============================================================================

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  targetUrl: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBannerPayload {
  title: string;
  subtitle: string;
  targetUrl: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive';
  image: File;
}

export interface UpdateBannerPayload {
  title?: string;
  subtitle?: string;
  targetUrl?: string;
  startDate?: string;
  endDate?: string;
  status?: 'Active' | 'Inactive';
  image?: File;
}

// ============================================================================
// Banner Service
// ============================================================================

export const bannerService = {
  /**
   * Get all active banners
   */
  getBanners: async (): Promise<Banner[]> => {
    const response = await Axios.get<Banner[]>('/api/cms/banners');
    return response.data;
  },

  /**
   * Create new banner with image upload
   */
  createBanner: async (payload: CreateBannerPayload): Promise<Banner> => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('subtitle', payload.subtitle);
    formData.append('targetUrl', payload.targetUrl);
    formData.append('startDate', payload.startDate);
    formData.append('endDate', payload.endDate);
    formData.append('status', payload.status);
    formData.append('image', payload.image);

    const response = await Axios.post<Banner>('/api/cms/banners', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update banner with optional image upload
   */
  updateBanner: async (id: string, payload: UpdateBannerPayload): Promise<Banner> => {
    const formData = new FormData();
    if (payload.title) formData.append('title', payload.title);
    if (payload.subtitle) formData.append('subtitle', payload.subtitle);
    if (payload.targetUrl) formData.append('targetUrl', payload.targetUrl);
    if (payload.startDate) formData.append('startDate', payload.startDate);
    if (payload.endDate) formData.append('endDate', payload.endDate);
    if (payload.status) formData.append('status', payload.status);
    if (payload.image) formData.append('image', payload.image);

    const response = await Axios.put<Banner>(`/api/banners/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete (deactivate) banner
   */
  deleteBanner: async (id: string): Promise<{ message: string }> => {
    const response = await Axios.delete<{ message: string }>(`/api/cms/banners/${id}`);
    return response.data;
  },
};
