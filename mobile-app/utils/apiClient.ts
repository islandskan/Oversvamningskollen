import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, isConnected } from '@/utils/networkUtils';

const BASE_URL = API_BASE_URL;
const TIMEOUT = 15000;
const AUTH_TOKEN_KEY = 'auth_token';

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

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export async function setAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function clearAuthToken(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function apiRequest<T = any>(
  method: string,
  endpoint: string,
  data?: any,
  customToken?: string
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  if (!(await isConnected())) {
    throw new ApiError('No network connection', 0);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = customToken || await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (data && ['POST', 'PATCH', 'PUT'].includes(method)) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    const responseData = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

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

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}
