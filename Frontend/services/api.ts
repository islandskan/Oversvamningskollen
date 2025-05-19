import { getApiBaseUrl, isConnected, isServerReachable } from '@/Frontend/utils/networkUtils';

// Base URL for API requests
// Use localhost for web and iOS simulator, use 10.0.2.2 for Android emulator
const BASE_URL = getApiBaseUrl();
// Leave this for now but can probably set it back to original value of 5000
// API request timeout in milliseconds (increased for slower connections)
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


function timeoutPromise(ms: number) {
  return new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new ApiError('Request timeout', 408));
    }, ms);
  });
}


export const api = {

  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    console.log(`API GET request to: ${url}`);

    const connected = await isConnected();
    if (!connected) {
      console.error('No network connection available');
      throw new ApiError('No network connection. Please check your internet connection and try again.', 0);
    }

    try {
      console.log(`Fetching with timeout: ${TIMEOUT}ms`);
      const response = await Promise.race([
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        }),
        timeoutPromise(TIMEOUT),
      ]);

      console.log(`API response status: ${response.status}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`API GET error for ${url}:`, error);

      if (error instanceof ApiError && error.message === 'Request timeout') {
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


  async post<T = any>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    console.log(`API POST request to: ${url}`);

    const connected = await isConnected();
    if (!connected) {
      console.error('No network connection available');
      throw new ApiError('No network connection. Please check your internet connection and try again.', 0);
    }

    try {
      console.log(`Posting data with timeout: ${TIMEOUT}ms`, { endpoint });
      const response = await Promise.race([
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: JSON.stringify(data),
          ...options,
        }),
        timeoutPromise(TIMEOUT),
      ]);

      console.log(`API response status: ${response.status}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`API POST error for ${url}:`, error);

      if (error instanceof ApiError && error.message === 'Request timeout') {
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


  async patch<T = any>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    try {
      const response = await Promise.race([
        fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: JSON.stringify(data),
          ...options,
        }),
        timeoutPromise(TIMEOUT),
      ]);

      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  },


  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    try {
      const response = await Promise.race([
        fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        }),
        timeoutPromise(TIMEOUT),
      ]);

      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  },
};
