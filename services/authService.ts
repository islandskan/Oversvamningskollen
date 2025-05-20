import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { getApiBaseUrl } from '@/utils/networkUtils';

const AUTH_TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_BUFFER = 300; // 5 minutes buffer before actual expiration

// Function to translate Swedish error messages to English
function translateErrorMessage(message: string): string {
  // Map of Swedish error messages to English translations
  const translations: Record<string, string> = {
    'E-postadressen är redan registrerad': 'This email is already registered',
    'Standardrollen "user" saknas i databasen': 'Database configuration error: The "user" role is missing. Please contact support.',
    'Serverfel vid registrering': 'Server error during registration',
    'Användaren registrerad': 'User registered successfully',
    'Fel användarnamn eller lösenord': 'Invalid username or password',
    'Fel vid registrering': 'Error during registration'
  };

  // Check if we have a translation for this message
  if (translations[message]) {
    return translations[message];
  }

  // If no direct match, check for partial matches
  if (message.includes('E-postadressen')) {
    return 'This email is already registered';
  }
  if (message.includes('lösenord')) {
    return 'Password error. Please check your password and try again.';
  }
  if (message.includes('Standardrollen') || message.includes('user saknas')) {
    return 'Database configuration error: The "user" role is missing. Please contact support.';
  }
  if (message.includes('Serverfel')) {
    return 'Server error. Please try again later.';
  }

  // Return the original message if no translation is found
  return message;
}

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

      // Log detailed error information for debugging
      if (error instanceof Error) {
        console.log(`Error details - Type: ${error.name}, Message: ${error.message}`);
        if (error.name === 'ApiError') {
          const apiError = error as any;
          console.log(`API Error Status: ${apiError.status}, Data:`, apiError.data);
        }
      }

      // Create a more user-friendly error message
      let errorMessage = 'Login failed. Please check your credentials and try again.';

      if (error instanceof Error) {
        if (error.name === 'ApiError') {
          const apiError = error as any;

          // First, check if there's an error message in the response data
          if (apiError.data?.error) {
            const dataErrorMessage = translateErrorMessage(apiError.data.error);
            errorMessage = dataErrorMessage;

            // Log the original error for debugging
            console.log('Original error from backend data:', apiError.data.error);
            console.log('Translated error message:', dataErrorMessage);
          }
          // Then try to translate the error message if it's in Swedish
          else if (apiError.message) {
            const translatedMessage = translateErrorMessage(apiError.message);

            // If translation changed the message, use it
            if (translatedMessage !== apiError.message) {
              errorMessage = translatedMessage;
            } else {
              // Handle specific API error codes with English messages
              if (apiError.status === 401) {
                errorMessage = 'Invalid email or password. Please try again.';
              } else if (apiError.status === 403) {
                errorMessage = 'Your account does not have permission to access this application.';
              } else if (apiError.status === 429) {
                errorMessage = 'Too many login attempts. Please try again later.';
              } else if (apiError.message.includes('fel lösenord') ||
                         apiError.message.includes('Fel användarnamn eller lösenord')) {
                // Handle the specific Swedish error messages for wrong credentials
                errorMessage = 'Invalid email or password. Please try again.';
              } else if (apiError.status === 500) {
                errorMessage = 'Server error. Please try again later.';
              } else {
                // Use the translated message as fallback
                errorMessage = translatedMessage;
              }
            }
          }
        } else if (error.message.includes('Network request failed')) {
          errorMessage = 'Network connection error. Please check your internet connection.';
        } else if (error.name === 'AbortError' || error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else if (error.message.includes('No token')) {
          errorMessage = 'Authentication failed. Please try again.';
        }
      }

      console.log('Final user-friendly error message:', errorMessage);

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

      // Translate success message if it's in Swedish
      const translatedMessage = translateErrorMessage(response.message);
      console.log('Registration successful:', translatedMessage || 'User registered');
    } catch (error) {
      console.error('Registration failed:', error);

      // Log detailed error information for debugging
      if (error instanceof Error) {
        console.log(`Error details - Type: ${error.name}, Message: ${error.message}`);
        if (error.name === 'ApiError') {
          const apiError = error as any;
          console.log(`API Error Status: ${apiError.status}, Data:`, apiError.data);
        }
      }

      // Create a more user-friendly error message
      let errorMessage = 'Registration failed. Please try again.';

      if (error instanceof Error) {
        if (error.name === 'ApiError') {
          const apiError = error as any;

          // First, check if there's an error message in the response data
          if (apiError.data?.error) {
            const dataErrorMessage = translateErrorMessage(apiError.data.error);
            errorMessage = dataErrorMessage;

            // Log the original error for debugging
            console.log('Original error from backend data:', apiError.data.error);
            console.log('Translated error message:', dataErrorMessage);
          }
          // Then try to translate the error message if it's in Swedish
          else if (apiError.message) {
            const translatedMessage = translateErrorMessage(apiError.message);

            // If translation changed the message, use it
            if (translatedMessage !== apiError.message) {
              errorMessage = translatedMessage;
            } else {
              // Handle specific API error codes with English messages
              if (apiError.status === 400) {
                // Check for email-related errors
                if (apiError.message.includes('email') ||
                    apiError.message.includes('E-post') ||
                    apiError.data?.errors?.email) {
                  errorMessage = 'This email is already registered or invalid. Please use a different email.';
                }
                // Check for password-related errors
                else if (apiError.message.includes('password') ||
                         apiError.message.includes('lösenord') ||
                         apiError.data?.errors?.password) {
                  errorMessage = 'Password does not meet requirements. Please use a stronger password.';
                }
                // Use translated message as fallback
                else {
                  errorMessage = translatedMessage;
                }
              }
              // Handle duplicate email errors
              else if (apiError.status === 409) {
                errorMessage = 'This email is already registered. Please use a different email or try to log in.';
              }
              // Handle server errors
              else if (apiError.status === 500) {
                // Check for the specific database role error
                if (apiError.data?.error &&
                    (apiError.data.error.includes('Standardrollen "user" saknas') ||
                     apiError.data.error.includes('user role is missing'))) {
                  errorMessage = 'Database configuration error: The "user" role is missing. Please contact support.';

                  // Log detailed instructions for developers
                  console.error('DATABASE SETUP ERROR: The "user" role is missing in the database.');
                  console.error('To fix this issue:');
                  console.error('1. Check if the roles table exists and has been properly initialized');
                  console.error('2. Run the database setup script: npm run create-tables');
                  console.error('3. Or manually add the role with SQL: INSERT INTO roles (name) VALUES (\'user\');');
                  console.error('4. Restart the server after fixing the database');
                } else {
                  errorMessage = 'Server error. Please try again later.';
                }
              }
              // Use translated message for other status codes
              else {
                errorMessage = translatedMessage;
              }
            }
          }
        }
        // Handle network errors
        else if (error.message.includes('Network request failed')) {
          errorMessage = 'Network connection error. Please check your internet connection.';
        }
        // Handle timeout errors
        else if (error.name === 'AbortError' || error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        }
      }

      console.log('Final user-friendly error message:', errorMessage);

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
