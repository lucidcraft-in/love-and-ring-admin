import Axios from '@/axios/axios';

// ============================================================================
// Type Definitions
// ============================================================================

export interface SuccessStory {
  _id: string;
  coupleName: string;
  story: string;
  imageUrl: string;
  status: 'Published' | 'Pending';
  date: string;
  createdAt?: string;
  updatedAt?: string;
  isPrimary?:boolean;
}

export interface CreateStoryPayload {
  coupleName : string;
  story: string;
  status: 'Published' | 'Pending';
  date: string;
  image: File;
  isPrimary:boolean;

}

export interface UpdateStoryPayload {
  coupleName?: string;
  story?: string;
  status?: 'Published' | 'Pending';
  date?: string;
  image?: File;
  isPrimary?:boolean;
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
   * Create new story with image upload
   */
  createStory: async (payload: CreateStoryPayload): Promise<SuccessStory> => {
    const formData = new FormData();
    formData.append('coupleName', payload.coupleName);
    formData.append('story', payload.story);
    formData.append('status', payload.status);
    formData.append('date', payload.date);
    formData.append('image', payload.image);

    const response = await Axios.post<SuccessStory>('/api/cms/success-stories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update story with optional image upload
   */
  updateStory: async (id: string, payload: UpdateStoryPayload): Promise<SuccessStory> => {
    const formData = new FormData();
    if (payload.coupleName) formData.append('coupleName', payload.coupleName);
    if (payload.story) formData.append('story', payload.story);
    if (payload.status) formData.append('status', payload.status);
    if (payload.date) formData.append('date', payload.date);
    if (payload.image) formData.append('image', payload.image);
    if (payload.isPrimary) formData.append('isPrimary', String(payload.isPrimary));

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
