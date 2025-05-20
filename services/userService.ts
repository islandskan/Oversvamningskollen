import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl, isConnected } from '@/utils/networkUtils';
import { ApiError } from '@/context/AuthContext';

const BASE_URL = getApiBaseUrl();
const TIMEOUT = 15000;
const AUTH_TOKEN_KEY = 'auth_token';

interface UserResponse {
  message: string;
  user?: User;
  users?: User[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

export interface UpdateUser {
  userName?: string;
  mail?: string;
  password?: string;
}

// Helper function to get token
const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
};

// API request function
async function apiRequest<T = any>(
  method: string,
  endpoint: string,
  data?: any
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
    };

    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: controller.signal,
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
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await apiRequest<UserResponse>('GET', '/api/users');
    return response.users || [];
  },

  async getUserById(id: number): Promise<User | null> {
    try {
      const response = await apiRequest<UserResponse>('GET', `/api/users/${id}`);
      return response.user || null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async createUser(userData: RegisterUser): Promise<User> {
    const response = await apiRequest<UserResponse>('POST', '/api/users', {
      userName: userData.name,
      mail: userData.email,
      password: userData.password,
      role: userData.role_id,
    });

    if (!response.user) {
      throw new Error('Failed to create user');
    }

    return response.user;
  },

  async updateUser(id: number, userData: UpdateUser): Promise<User> {
    const response = await apiRequest<UserResponse>('PATCH', `/api/users/${id}`, userData);

    if (!response.user) {
      throw new Error('Failed to update user');
    }

    return response.user;
  },

  async deleteUser(id: number): Promise<User> {
    const response = await apiRequest<UserResponse>('DELETE', `/api/users/${id}`);

    if (!response.user) {
      throw new Error('Failed to delete user');
    }

    return response.user;
  },
};
