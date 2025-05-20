import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { router } from 'expo-router';
import { showAlert } from '@/utils/alert';
import { getApiBaseUrl, isConnected } from '@/utils/networkUtils';

// Constants
const AUTH_TOKEN_KEY = 'auth_token';
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

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function apiRequest<T = any>(
  method: string,
  endpoint: string,
  data?: any,
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
    };

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const saveToken = async (token: string): Promise<void> => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  };

  const getToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem(AUTH_TOKEN_KEY);
  };

  const clearToken = async (): Promise<void> => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = await getToken();

        if (!token) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          if (router.canGoBack()) {
            router.replace('/login');
          }
          return;
        }

        // Get current user with token
        const userData = await apiRequest('GET', '/login/me', undefined, token);

        if (userData) {
          setCurrentUser({
            id: userData.id,
            email: userData.email,
            name: userData.email.split('@')[0],
            role_id: 2,
            password: ''
          });
          setIsAuthenticated(true);
        } else {
          await clearToken();
          setIsAuthenticated(false);
          setCurrentUser(null);
          if (router.canGoBack()) {
            router.replace('/login');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);

        // Handle unauthorized errors
        if (error instanceof ApiError && error.status === 401) {
          await clearToken();
        }

        setIsAuthenticated(false);
        setCurrentUser(null);

        if (router.canGoBack()) {
          router.replace('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest('POST', '/login', { email, password });

      if (!response.token) {
        throw new Error('No token received from server');
      }

      await saveToken(response.token);

      // Get user data
      const token = await getToken();
      const userData = await apiRequest('GET', '/login/me', undefined, token);

      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.email.split('@')[0],
        role_id: 2,
        password: ''
      };

      setIsAuthenticated(true);
      setCurrentUser(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      showAlert('Login Failed', message, 'error');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await apiRequest('POST', '/register', { name, email, password });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      showAlert('Registration Failed', message, 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clearToken();
      setIsAuthenticated(false);
      setCurrentUser(null);
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      currentUser,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};