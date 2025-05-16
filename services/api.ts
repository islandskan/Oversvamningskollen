import { getApiBaseUrl, isConnected, isServerReachable } from '@/utils/networkUtils';
import { authService } from './authService';

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

async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(
      data.message || 'An error occurred',
      response.status,
      data
    );
  }

  return data;
}

export const api = {
  async request<T = any>(
    method: string,
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    console.log(`API ${method} request to: ${url}`);

    const connected = await isConnected();
    if (!connected) {
      console.error('No network connection available');
      throw new ApiError('No network connection. Please check your internet connection and try again.', 0);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      // Get auth token
      const token = await authService.getToken();

      // Prepare headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Add Authorization header if token exists
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

      // Handle 401 Unauthorized - clear token
      if (response.status === 401) {
        await authService.setToken(null);
        throw new ApiError('Authentication failed. Please log in again.', 401);
      }

      console.log(`API response status: ${response.status}`);
      return handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`API ${method} error for ${url}:`, error);

      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Checking if server is reachable...');
        const isReachable = await isServerReachable(BASE_URL, 3000);
        if (!isReachable) {
          console.error(`Server at ${BASE_URL} is not reachable`);
          throw new ApiError(
            `Server at ${BASE_URL} is not reachable. Please ensure your backend server is running and accessible on your local network.`,
            0
          );
        } else {
          console.log('Server is reachable, but the request timed out');
          throw new ApiError('Request timeout', 408);
        }
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
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

