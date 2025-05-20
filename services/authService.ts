import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { api } from './api';

const AUTH_TOKEN_KEY = 'auth_token';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface UserResponse {
  id: number;
  email: string;
}

export const authService = {
  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(AUTH_TOKEN_KEY);
  },

  async clearToken(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  },

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post<LoginResponse>('/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (!response.token) {
        throw new Error('No token received from server');
      }

      await this.saveToken(response.token);

      const userData = await api.get<UserResponse>('/login/me');

      return {
        id: userData.id,
        email: userData.email,
        name: userData.email.split('@')[0],
        role_id: 2,
        password: ''
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Login failed');
    }
  },

  async register(data: RegisterData): Promise<void> {
    try {
      await api.post('/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed');
    }
  },

  async logout(): Promise<void> {
    await this.clearToken();
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await this.getToken();
      if (!token) return null;

      const userData = await api.get<UserResponse>('/login/me');

      return {
        id: userData.id,
        email: userData.email,
        name: userData.email.split('@')[0],
        role_id: 2,
        password: ''
      };
    } catch (error) {
      if (error instanceof Error &&
          error.name === 'ApiError' &&
          (error as any).status === 401) {
        await this.clearToken();
      }
      return null;
    }
  }
};
