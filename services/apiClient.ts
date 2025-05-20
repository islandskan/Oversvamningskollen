import { getApiBaseUrl, isConnected } from '@/utils/networkUtils';

const BASE_URL = getApiBaseUrl();
const TIMEOUT = 15000;

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiClient = {
  async request<T = any>(
    method: string,
    endpoint: string,
    data?: any,
    options: RequestInit = {},
    token?: string | null
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const connected = await isConnected();
    if (!connected) {
      throw new ApiError('No network connection', 0);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: controller.signal,
        ...options,
      };

      if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const responseData = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw new ApiError(
          responseData.message || 'An error occurred',
          response.status,
          responseData
        );
      }

      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  },

  async get<T = any>(endpoint: string, options: RequestInit = {}, token?: string | null): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options, token);
  },

  async post<T = any>(endpoint: string, data: any, options: RequestInit = {}, token?: string | null): Promise<T> {
    return this.request<T>('POST', endpoint, data, options, token);
  },

  async patch<T = any>(endpoint: string, data: any, options: RequestInit = {}, token?: string | null): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, options, token);
  },

  async delete<T = any>(endpoint: string, options: RequestInit = {}, token?: string | null): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options, token);
  },
};
