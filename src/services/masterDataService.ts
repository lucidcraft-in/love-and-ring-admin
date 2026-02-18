import Axios from '@/axios/axios';

// ============================================================================
// Type Definitions
// ============================================================================

export type MasterDataType = 'religions' | 'castes' | 'primaryEducations' | 'higherEducations' | 'occupations' | 'languages' | 'locations';

export interface MasterItem {
  _id: string;
  name: string;
  value: string;
  usersCount?: number;
  // For Caste which has relation to Religion
  primaryEducation?:string | {_id: string; name: string}
  religion?: string | { _id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface MasterDataCountResponse {
  religions: number;
  castes: number;
  primaryEducations: number;
  higherEducations:number;
  occupations: number;
  languages: number;
  locations: number;
}

export interface CreateMasterItemPayload {
  name: string;
  value?: string;
  // Optional Parent ID for related data (e.g. religionId for Caste)
  religion?: string;
}

export interface UpdateMasterItemPayload {
  name?: string;
  value?: string;
  religion?: string;
}

export interface GetMasterDataParams {
  skip?: number;
  take?: number;
  search?: string;
}

export interface MasterDataResponse {
  data: MasterItem[];
  total: number;
  skip: number;
  take: number;
}

// ============================================================================
// Master Data Service
// ============================================================================

export const masterDataService = {
  /**
   * Get items with pagination and search
   */
  getItems: async (type: MasterDataType, params?: GetMasterDataParams): Promise<MasterDataResponse> => {
    // If we want the one with counts, we should use the /count endpoint as requested
    // The user provided config shows router.get("/religions/count", ...)
    // which returns the data with usersCount.
    // Let's check if we should use the count endpoint for the list view to show user counts.
    // Usually admin panels show usage counts. Let's use the count endpoint for listing if available.

    // Based on user request code snippet:
    // router.get("/religions/count", getMasterWithUserCount(Religion, "religion"));
    // This endpoint returns paginated data too.

    // For now, let's assume we use the /count endpoint for the main list as it provides more info.
    const endpoint = `/api/master/${type}/count`;
    const response = await Axios.get<MasterDataResponse>(endpoint, {
      params: {
        skip: params?.skip || 0,
        take: params?.take || 1000,
        search: params?.search,
      },
    });
    return response.data;
  },

  /**
   * Get generic list (simple list without counts, maybe for dropdowns)
   */
  getSimpleList: async (type: MasterDataType): Promise<MasterDataResponse> => {
    const endpoint = `/api/master/${type}`;
    const response = await Axios.get<MasterDataResponse>(endpoint); // Assuming simple get returns generic pagination structure too
    return response.data;
  },

  /**
   * Create new item
   */
  createItem: async (type: MasterDataType, payload: CreateMasterItemPayload): Promise<MasterItem> => {
    const endpoint = `/api/master/${type}`;
    const response = await Axios.post<MasterItem>(endpoint, payload);
    return response.data;
  },

  /**
   * Update item
   */
  updateItem: async (type: MasterDataType, id: string, payload: UpdateMasterItemPayload): Promise<MasterItem> => {
    const endpoint = `/api/master/${type}/${id}`;
    const response = await Axios.put<MasterItem>(endpoint, payload);
    return response.data;
  },

  /**
   * Delete item
   */
  deleteItem: async (type: MasterDataType, id: string): Promise<{ message: string }> => {
    const endpoint = `/api/master/${type}/${id}`;
    const response = await Axios.delete<{ message: string }>(endpoint);
    return response.data;
  },

  getAllCount: async (): Promise<MasterDataCountResponse> => {
    const endpoint = `/api/master/counts`;
    const response = await Axios.get<MasterDataCountResponse>(endpoint);
    return response.data;
  },
};
