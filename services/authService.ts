import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

const AUTH_TOKEN_KEY = 'auth_token';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(AUTH_TOKEN_KEY);
  },

  async setToken(token: string | null): Promise<void> {
    if (token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }
  },

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // When the backend implements JWT auth, this will change to use the auth endpoint
      // For now, we'll use the existing login implementation
      const response = await api.post<AuthResponse>('/api/auth/login', {
        mail: credentials.email,
        password: credentials.password
      });
      
      if (response.token) {
        await this.setToken(response.token);
      }
      
      return response.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  async logout(): Promise<void> {
    await this.setToken(null);
  },
  
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await this.getToken();
      
      if (!token) {
        return null;
      }
      
      // When the backend implements JWT auth, this will use the /api/auth/me endpoint
      // For now, we'll return null
      return null;
    } catch (error) {
      console.error('Get current user failed:', error);
      return null;
    }
  }
};
