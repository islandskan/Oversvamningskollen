import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

const AUTH_TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_BUFFER = 300; // 5 minutes buffer before actual expiration

// Common translations for Swedish error messages
const ERROR_TRANSLATIONS: Record<string, string> = {
  'E-postadressen är redan registrerad': 'This email is already registered',
  'Standardrollen "user" saknas i databasen': 'Database configuration error: The "user" role is missing. Please contact support.',
  'Fel användarnamn eller lösenord': 'Invalid username or password',
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role_id?: number;
}

interface LoginResponse {
  message: string;
  token: string;
}

interface UserResponse {
  id: number;
  email: string;
}

interface JwtPayload {
  userId: string;
  role: string;
  exp: number;
  iat: number;
}

function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );

    const payload: JwtPayload = JSON.parse(jsonPayload);
    const now = Date.now() / 1000;
    return (payload.exp - TOKEN_EXPIRY_BUFFER) < now;
  } catch (e) {
    return true;
  }
}

function handleApiError(error: any): string {
  if (error?.name === 'ApiError') {
    // Check for error in response data
    if (error.data?.error) {
      const message = error.data.error;
      return ERROR_TRANSLATIONS[message] || message;
    }

    // Handle based on status code
    switch (error.status) {
      case 400: return getErrorByContent(error.message, 'Invalid request');
      case 401: return 'Invalid email or password. Please try again.';
      case 403: return 'Your account does not have permission to access this application.';
      case 409: return 'This email is already registered. Please use a different email.';
      case 429: return 'Too many attempts. Please try again later.';
      case 500: return 'Server error. Please try again later.';
      default: return error.message;
    }
  }

  // Handle network and timeout errors
  if (error instanceof Error) {
    if (error.message.includes('Network request failed')) {
      return 'Network connection error. Please check your internet connection.';
    }
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    return error.message;
  }

  return 'An unexpected error occurred';
}

function getErrorByContent(message: string, defaultMessage: string): string {
  if (message.includes('email') || message.includes('E-post')) {
    return 'This email is already registered or invalid. Please use a different email.';
  }
  if (message.includes('password') || message.includes('lösenord')) {
    return 'Password does not meet requirements. Please use a stronger password.';
  }
  if (message.includes('Standardrollen') || message.includes('user saknas')) {
    return 'Database configuration error: The "user" role is missing. Please contact support.';
  }
  return defaultMessage;
}

export const authService = {
  async getToken(): Promise<string | null> {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;

    if (isTokenExpired(token)) {
      await this.setToken(null);
      return null;
    }
    return token;
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
      const response = await api.post<LoginResponse>('/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (!response.token) {
        throw new Error('No token received from server');
      }

      await this.setToken(response.token);
      const user = await this.getCurrentUser();

      if (!user) {
        throw new Error('Failed to get user info after login');
      }

      return user;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
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
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  async logout(): Promise<void> {
    await this.setToken(null);
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
      if (error instanceof Error && error.name === 'ApiError' && (error as any).status === 401) {
        await this.setToken(null);
      }
      return null;
    }
  }
};
