import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService, User } from '@/services/userService';
import { showAlert } from '@/utils/alert';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Temporary setup , either i or the backend will figure out a safer way to handle this

// Key for storing user data in AsyncStorage
const USER_STORAGE_KEY = 'user_data';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check login status when app starts
    const checkAuthStatus = async () => {
      try {
        // Get stored user data
        const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);

        if (userData) {
          const user = JSON.parse(userData) as User;
          setCurrentUser(user);
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to check login status:', error);
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting login with email:', email);

      const user = await userService.login({ email, password });

      if (user) {
        console.log('AuthContext: Login successful, storing user data');
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        console.log('AuthContext: Login failed - invalid credentials');
        showAlert('Login Failed', 'Invalid email or password', 'error');
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('AuthContext: Login failed:', error);

      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          showAlert(
            'Connection Timeout',
            'The request timed out while trying to connect to the server. Please try again or check your connection.',
            'warning'
          );
        } else if (error.message.includes('network') || error.message.includes('connection')) {
          showAlert(
            'Network Error',
            'Unable to connect to the server. Please check your internet connection and try again.',
            'warning'
          );
        } else if (error.message.includes('not reachable')) {
          showAlert(
            'Server Unreachable',
            'The server is currently unreachable. Please ensure your backend server is running on 0.0.0.0 and accessible at 192.168.0.103:3000.',
            'warning'
          );
        } else if (error.message.includes('Invalid credentials')) {
          // This is already handled above, but just in case
          showAlert('Login Failed', 'Invalid email or password', 'error');
        } else {
          showAlert('Login Error', 'An error occurred during login. Please try again.', 'error');
        }
      } else {
        showAlert('Login Error', 'An unexpected error occurred. Please try again.', 'error');
      }

      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      currentUser,
      login,
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