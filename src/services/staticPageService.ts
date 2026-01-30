import Axios from '@/axios/axios';

// ============================================================================
// Type Definitions
// ============================================================================

export interface StaticPage {
  _id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  lastUpdatedBy?: string;
  pageType: 'DEFAULT' | 'CONTACT';
  sections?: any[];
}

export interface CreatePagePayload {
  title: string;
  content: string;
  slug: string;
  pageType?: 'DEFAULT' | 'CONTACT';
  sections?: any[];
}

export interface UpdatePagePayload {
  title?: string;
  content?: string;
  slug?: string;
  pageType?: 'DEFAULT' | 'CONTACT';
  sections?: any[];
}

// ============================================================================
// Static Page Service
// ============================================================================

export const staticPageService = {
  /**
   * Get all static pages
   */
  getAllPages: async (): Promise<StaticPage[]> => {
    const response = await Axios.get<StaticPage[]>('/api/cms/static-pages');
    return response.data;
  },

  /**
   * Create new static page
   */
  createPage: async (payload: CreatePagePayload): Promise<StaticPage> => {
    const response = await Axios.post<StaticPage>('/api/cms/static-pages', payload);
    return response.data;
  },

  /**
   * Get page by slug
   */
  getPageBySlug: async (slug: string): Promise<StaticPage> => {
    const response = await Axios.get<StaticPage>(`/api/cms/static-pages/${slug}`);
    return response.data;
  },

  /**
   * Update page content
   */
  updatePage: async (id: string, payload: UpdatePagePayload): Promise<StaticPage> => {
    const response = await Axios.put<StaticPage>(`/api/cms/static-pages/${id}`, payload);
    return response.data;
  },
};
