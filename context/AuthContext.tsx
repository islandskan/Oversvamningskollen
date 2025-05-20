import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '@/services/authService';
import { showAlert } from '@/utils/alert';
import { User } from '@/types';
import { router } from 'expo-router';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Function to handle authentication state changes
  const handleAuthStateChange = (isAuth: boolean) => {
    setIsAuthenticated(isAuth);
    setCurrentUser(isAuth ? currentUser : null);

    // If authentication is lost, redirect to login screen
    if (!isAuth) {
      console.log('Authentication lost, redirecting to login screen');
      router.replace('/login');

      // Only show alert if we're not already on the login screen
      if (router.canGoBack()) {
        showAlert('Session Expired', 'Your session has expired. Please log in again.', 'warning');
      }
    }
  };

  useEffect(() => {
    // Check login status when app starts
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);

        const token = await authService.getToken();

        if (!token) {
          handleAuthStateChange(false);
          return;
        }

        // Validate token by getting current user
        const user = await authService.getCurrentUser();

        if (user) {
          setCurrentUser(user);
          handleAuthStateChange(true);
        } else {
          handleAuthStateChange(false);
        }
      } catch (error) {
        console.error('Failed to check login status:', error);
        handleAuthStateChange(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Set up a listener for token expiration
    const tokenCheckInterval = setInterval(async () => {
      const token = await authService.getToken();
      if (!token && isAuthenticated) {
        console.log('Token expired or removed during app usage');
        handleAuthStateChange(false);
      }
    }, 60000); // Check every minute

    return () => clearInterval(tokenCheckInterval);
  }, [isAuthenticated]); // Add isAuthenticated as a dependency

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting login with email:', email);

      const user = await authService.login({ email, password });

      setCurrentUser(user);
      handleAuthStateChange(true);
    } catch (error) {
      console.error('AuthContext: Login failed:', error);

      // Get error message from the error object
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';

      // Determine error type based on message content
      let title = 'Login Failed';
      let type: 'info' | 'success' | 'warning' | 'error' = 'error';

      if (message.includes('Invalid email or password') ||
          message.includes('Authentication failed')) {
        title = 'Invalid Credentials';
        type = 'error';
      } else if (message.includes('Network connection') ||
                message.includes('Server error') ||
                message.includes('timeout')) {
        title = 'Connection Error';
        type = 'warning';
      } else if (message.includes('permission')) {
        title = 'Access Denied';
        type = 'error';
      }

      showAlert(title, message, type);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting to register user with email:', email);
      // Backend assigns the 'user' role automatically
      await authService.register({ name, email, password });
    } catch (error) {
      console.error('AuthContext: Registration failed:', error);

      // Get error message from the error object
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';

      // Determine error type based on message content
      let title = 'Registration Failed';
      let type: 'info' | 'success' | 'warning' | 'error' = 'error';

      if (message.includes('email is already registered') ||
          message.includes('email') && message.includes('registered')) {
        title = 'Email Already Exists';
        type = 'error';
      } else if (message.includes('Network connection') ||
                message.includes('Server error') ||
                message.includes('timeout')) {
        title = 'Connection Error';
        type = 'warning';
      } else if (message.includes('Password')) {
        title = 'Password Error';
        type = 'error';
      } else if (message.includes('Database configuration error')) {
        title = 'Database Setup Error';
        type = 'error';
      }

      showAlert(title, message, type);
      throw error;
    }
  };



  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      handleAuthStateChange(false);
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