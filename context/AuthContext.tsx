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

  const handleAuthChange = (isAuth: boolean, user: User | null, isManualLogout = false) => {
    setIsAuthenticated(isAuth);
    setCurrentUser(user);

    if (!isAuth) {
      router.replace('/login');

      if (router.canGoBack() && !isManualLogout) {
        showAlert('Session Expired', 'Your session has expired. Please log in again.', 'warning');
      }
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const token = await authService.getToken();

        if (!token) {
          handleAuthChange(false, null);
          return;
        }

        const user = await authService.getCurrentUser();
        handleAuthChange(!!user, user);
      } catch (error) {
        handleAuthChange(false, null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Check token validity every 5 minutes
    const tokenCheckInterval = setInterval(async () => {
      if (isAuthenticated) {
        const token = await authService.getToken();
        if (!token) handleAuthChange(false, null);
      }
    }, 300000);

    return () => clearInterval(tokenCheckInterval);
  }, [isAuthenticated]);

  const login = async (email: string, password: string) => {
    try {
      const user = await authService.login({ email, password });
      handleAuthChange(true, user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';

      // Determine alert type based on error message
      let alertType: 'error' | 'warning' = 'error';
      let title = 'Login Failed';

      if (message.includes('Network') || message.includes('Server') || message.includes('timeout')) {
        alertType = 'warning';
        title = 'Connection Error';
      }

      showAlert(title, message, alertType);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await authService.register({ name, email, password });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      showAlert('Registration Failed', message, 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      handleAuthChange(false, null, true);
    } catch (error) {
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