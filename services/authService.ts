import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { getApiBaseUrl } from '@/utils/networkUtils';

const AUTH_TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_BUFFER = 300; // 5 minutes buffer before actual expiration

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role_id?: number; // Optional - backend assigns role automatically
}

// Response types
interface LoginResponse {
  message: string;
  token: string;
}

interface UserResponse {
  id: number;
  email: string;
  // Other potential user fields from backend
}

interface JwtPayload {
  userId: string;
  role: string;
  exp: number;
  iat: number;
}

function isTokenExpired(token: string): boolean {
  try {
    // Parse JWT token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );

    const payload: JwtPayload = JSON.parse(jsonPayload);
    const now = Date.now() / 1000;

    // Add buffer time to consider token as expired slightly before actual expiration
    return (payload.exp - TOKEN_EXPIRY_BUFFER) < now;
  } catch (e) {
    console.error('Error checking token expiration:', e);
    return true; // If we can't decode the token, consider it expired
  }
}

export const authService = {
  async getToken(): Promise<string | null> {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      return null;
    }

    // If token is expired, clear it and force re-login
    if (isTokenExpired(token)) {
      console.log('Token is expired, clearing it');
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
      console.log('Attempting login with credentials:', { email: credentials.email });

      const response = await api.post<LoginResponse>('/login', {
        email: credentials.email,
        password: credentials.password
      });

      console.log('Login response received');

      if (response.token) {
        console.log('Token received, storing it');
        await this.setToken(response.token);

        // After storing the token, fetch the user data
        const user = await this.getCurrentUser();
        if (!user) {
          throw new Error('Failed to get user info after login');
        }
        return user;
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login failed:', error);

      // Create a more user-friendly error message
      let errorMessage = 'Login failed. Please check your credentials and try again.';

      if (error instanceof Error) {
        console.log(`Error type: ${error.name}, message: ${error.message}`);

        if (error.name === 'ApiError') {
          const apiError = error as any;

          // Handle specific API error codes
          if (apiError.status === 401) {
            errorMessage = 'Invalid email or password. Please try again.';
          } else if (apiError.status === 403) {
            errorMessage = 'Your account does not have permission to access this application.';
          } else if (apiError.status === 429) {
            errorMessage = 'Too many login attempts. Please try again later.';
          } else if (apiError.message.includes('fel lösenord')) {
            // Handle the specific Swedish error message for wrong password
            errorMessage = 'Invalid password. Please try again.';
          } else {
            // Use the API error message if available
            errorMessage = apiError.message || errorMessage;
          }
        } else if (error.message.includes('Network request failed')) {
          errorMessage = 'Network connection error. Please check your internet connection.';
        } else if (error.name === 'AbortError' || error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else if (error.message.includes('No token')) {
          errorMessage = 'Authentication failed. Please try again.';
        }
      }

      // Create a new error with the user-friendly message
      const userFriendlyError = new Error(errorMessage);
      throw userFriendlyError;
    }
  },

  async register(data: RegisterData): Promise<void> {
    try {
      console.log('Attempting to register user:', { email: data.email });

      // Send registration request to the backend
      // The backend assigns the 'user' role automatically
      const response = await api.post<{ message: string, user: { id: number, name: string, email: string, role_id: number } }>('/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });

      console.log('Registration successful:', response.message || 'User registered');
    } catch (error) {
      console.error('Registration failed:', error);

      // Create a more user-friendly error message
      let errorMessage = 'Registration failed. Please try again.';

      if (error instanceof Error) {
        console.log(`Error type: ${error.name}, message: ${error.message}`);

        if (error.name === 'ApiError') {
          const apiError = error as any;

          // Handle specific API error codes
          if (apiError.status === 400) {
            if (apiError.message.includes('email') || apiError.data?.errors?.email) {
              errorMessage = 'This email is already registered or invalid. Please use a different email.';
            } else if (apiError.message.includes('password') || apiError.data?.errors?.password) {
              errorMessage = 'Password does not meet requirements. Please use a stronger password.';
            } else {
              // Use the API error message if available
              errorMessage = apiError.message || errorMessage;
            }
          } else if (apiError.status === 409) {
            errorMessage = 'This email is already registered. Please use a different email or try to log in.';
          } else {
            // Use the API error message if available
            errorMessage = apiError.message || errorMessage;
          }
        } else if (error.message.includes('Network request failed')) {
          errorMessage = 'Network connection error. Please check your internet connection.';
        } else if (error.name === 'AbortError' || error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        }
      }

      // Create a new error with the user-friendly message
      const userFriendlyError = new Error(errorMessage);
      throw userFriendlyError;
    }
  },



  async logout(): Promise<void> {
    // Simply clear the token from AsyncStorage
    console.log('Logging out user');
    await this.setToken(null);
    console.log('User logged out successfully');
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await this.getToken();

      if (!token) {
        console.log('No token available, user is not authenticated');
        return null;
      }

      console.log('Fetching current user info');
      const userData = await api.get<UserResponse>('/login/me');
      console.log('Current user info received');

      // Convert the limited user data from backend to our full User type
      // Note: The backend only returns id and email, so we need to create a User object
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.email.split('@')[0], // Use part of email as name if not provided
        role_id: 2, // Default role_id if not provided
        password: '' // We don't store the password client-side
      };

      return user;
    } catch (error) {
      console.error('Get current user failed:', error);

      // If we get a 401 Unauthorized, the token is invalid
      if (error instanceof Error && error.name === 'ApiError' && (error as any).status === 401) {
        console.log('Token is invalid, clearing it');
        await this.setToken(null);
      }

      return null;
    }
  }
};
