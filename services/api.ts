import { apiClient, ApiError } from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth_token';

// Re-export ApiError for other modules to use
export { ApiError };

// Helper function to get token
const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
};

// Helper function to handle 401 errors
const handleUnauthorized = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
};

export const api = {
  async request<T = any>(
    method: string,
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const token = await getToken();
      const response = await apiClient.request<T>(method, endpoint, data, options, token);
      return response;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await handleUnauthorized();
      }
      throw error;
    }
  },

  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  },

  async post<T = any>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>('POST', endpoint, data, options);
  },

  async patch<T = any>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, options);
  },

  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  },
};

