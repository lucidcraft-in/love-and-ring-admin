import Axios from '@/axios/axios';

// ============================================================================
// Type Definitions
// ============================================================================

export interface ServiceUsedItem {
  serviceId?: string;
  title: string;
  category: string;
  priceRange?: string;
  location?: string;
  imageUrl?: string;
}

export interface SuccessStory {
  _id: string;
  coupleName: string;
  story: string;
  imageUrl: string;
  galleryPhotos?: string[];
  videoUrl?: string;
  servicesUsed?: ServiceUsedItem[];
  status: 'Published' | 'Pending';
  date: string;
  createdAt?: string;
  updatedAt?: string;
  isPrimary?: boolean;
}

export interface CreateStoryPayload {
  coupleName: string;
  story: string;
  status: 'Published' | 'Pending';
  date: string;
  image: File;
  galleryPhotos?: string[];
  galleryFiles?: File[];
  videoUrl?: string;
  servicesUsed?: ServiceUsedItem[];
  isPrimary: boolean;
}

export interface UpdateStoryPayload {
  coupleName?: string;
  story?: string;
  status?: 'Published' | 'Pending';
  date?: string;
  image?: File;
  galleryPhotos?: string[];
  galleryFiles?: File[];
  videoUrl?: string;
  servicesUsed?: ServiceUsedItem[];
  isPrimary?: boolean;
}

export interface GetStoriesParams {
  skip?: number;
  take?: number;
  status?: 'Published' | 'Pending';
}

// ============================================================================
// Success Story Service
// ============================================================================

export const successStoryService = {
  /**
   * Get filtered and paginated stories
   */
  getStories: async (params?: GetStoriesParams): Promise<SuccessStory[]> => {
    const response = await Axios.get<SuccessStory[]>('/api/cms/success-stories', {
      params: {
        skip: params?.skip || 0,
        take: params?.take || 10,
        status: params?.status,
      },
    });
    return response.data;
  },

  /**
   * Create new story with image & video & service attachments
   */
  createStory: async (payload: CreateStoryPayload): Promise<SuccessStory> => {
    const formData = new FormData();
    formData.append('coupleName', payload.coupleName);
    formData.append('story', payload.story);
    formData.append('status', payload.status);
    formData.append('date', payload.date);
    formData.append('image', payload.image);
    formData.append('isPrimary', String(payload.isPrimary));

    if (payload.videoUrl) {
      formData.append('videoUrl', payload.videoUrl);
    }

    if (payload.galleryPhotos && payload.galleryPhotos.length > 0) {
      formData.append('galleryPhotos', JSON.stringify(payload.galleryPhotos));
    }

    if (payload.galleryFiles && payload.galleryFiles.length > 0) {
      payload.galleryFiles.forEach((file, index) => {
        formData.append(`galleryPhoto_${index}`, file);
      });
    }

    if (payload.servicesUsed && payload.servicesUsed.length > 0) {
      formData.append('servicesUsed', JSON.stringify(payload.servicesUsed));
    }

    const response = await Axios.post<SuccessStory>('/api/cms/success-stories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update story with optional image, video & service attachments
   */
  updateStory: async (id: string, payload: UpdateStoryPayload): Promise<SuccessStory> => {
    const formData = new FormData();
    if (payload.coupleName) formData.append('coupleName', payload.coupleName);
    if (payload.story) formData.append('story', payload.story);
    if (payload.status) formData.append('status', payload.status);
    if (payload.date) formData.append('date', payload.date);
    if (payload.image) formData.append('image', payload.image);
    if (payload.isPrimary !== undefined) formData.append('isPrimary', String(payload.isPrimary));

    if (payload.videoUrl !== undefined) {
      formData.append('videoUrl', payload.videoUrl);
    }

    if (payload.galleryPhotos !== undefined) {
      formData.append('galleryPhotos', JSON.stringify(payload.galleryPhotos));
    }

    if (payload.galleryFiles && payload.galleryFiles.length > 0) {
      payload.galleryFiles.forEach((file, index) => {
        formData.append(`galleryPhoto_${index}`, file);
      });
    }

    if (payload.servicesUsed !== undefined) {
      formData.append('servicesUsed', JSON.stringify(payload.servicesUsed));
    }

    const response = await Axios.put<SuccessStory>(`/api/cms/success-stories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete story
   */
  deleteStory: async (id: string): Promise<{ message: string }> => {
    const response = await Axios.delete<{ message: string }>(`/api/cms/success-stories/${id}`);
    return response.data;
  },
};
