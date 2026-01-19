import axiosInstance from './axiosConfig';
import { AxiosResponse } from 'axios';

// Generic API client with common HTTP methods
class ApiClient {
  async get<T>(url: string, config?: any): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
    return response.data;
  }
}

export default new ApiClient();
