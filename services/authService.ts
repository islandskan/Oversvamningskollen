import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import * as AuthSession from 'expo-auth-session';
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
  role_id: number;
}

interface AuthResponse {
  token: string;
  user: User;
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

    if (isTokenExpired(token)) {
      console.log('Token is expired, attempting to refresh');
      try {
        // Try to refresh the token if it's expired
        const newToken = await this.refreshToken(token);
        return newToken;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        await this.setToken(null);
        return null;
      }
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

  async refreshToken(oldToken: string): Promise<string | null> {
    try {
      console.log('Attempting to refresh token');

      // Call the refresh token endpoint
      const response = await api.post<{ token: string }>('/refresh-token', {}, {
        headers: {
          Authorization: `Bearer ${oldToken}`
        }
      });

      if (response && response.token) {
        console.log('Token refreshed successfully');
        await this.setToken(response.token);
        return response.token;
      }

      throw new Error('No token received from refresh endpoint');
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, clear the token and force re-login
      await this.setToken(null);
      return null;
    }
  },

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      console.log('Attempting login with credentials:', { email: credentials.email });

      const response = await api.post<AuthResponse>('/login', {
        email: credentials.email,
        password: credentials.password
      });

      console.log('Login response received');

      if (response.token) {
        console.log('Token received, storing it');
        await this.setToken(response.token);
      } else {
        throw new Error('No token received from server');
      }

      return response.user;
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
      const response = await api.post<{ message: string }>('/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: data.role_id
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

  async loginWithGoogle(): Promise<User> {
    try {
      console.log('Attempting Google login');

      // Create a redirect URI using the scheme in app.json
      const redirectUri = AuthSession.makeRedirectUri();
      console.log('Redirect URI:', redirectUri);

      // Create the auth request
      const discovery = { authorizationEndpoint: `${getApiBaseUrl()}/auth/google` };

      // Create a request
      const request = new AuthSession.AuthRequest({
        clientId: 'client_id', // This is just a placeholder, as our backend handles the client ID
        redirectUri,
        responseType: AuthSession.ResponseType.Token,
      });

      console.log('Starting auth request with discovery:', discovery);

      // Prompt the user with a web browser to authenticate
      const result = await request.promptAsync(discovery);
      console.log('Auth request result received');

      if (result.type === 'success' && result.params?.token) {
        const { token } = result.params;
        console.log('Google auth token received, storing it');
        await this.setToken(token);

        // Get the user info
        const user = await this.getCurrentUser();
        if (!user) {
          throw new Error('Failed to get user info after Google login');
        }
        return user;
      }

      throw new Error('Google authentication failed');
    } catch (error) {
      console.error('Google login failed:', error);

      // Create a more user-friendly error message
      let errorMessage = 'Google login failed. Please try again.';

      if (error instanceof Error) {
        console.log(`Error type: ${error.name}, message: ${error.message}`);

        if (error.name === 'ApiError') {
          const apiError = error as any;

          // Handle specific API error codes
          if (apiError.status === 401) {
            errorMessage = 'Google authentication failed. Please try again.';
          } else if (apiError.status === 403) {
            errorMessage = 'Your Google account does not have permission to access this application.';
          } else {
            // Use the API error message if available
            errorMessage = apiError.message || errorMessage;
          }
        } else if (error.message.includes('Network request failed')) {
          errorMessage = 'Network connection error. Please check your internet connection.';
        } else if (error.name === 'AbortError' || error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else if (error.message.includes('canceled')) {
          errorMessage = 'Google login was canceled.';
        } else {
          // Use the original error message if it's meaningful
          errorMessage = error.message;
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
      const user = await api.get<User>('/login/me');
      console.log('Current user info received');
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
