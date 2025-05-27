import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types';
import { router } from 'expo-router';
import { showAlert } from '@/utils/alert';
import { apiRequest, getAuthToken, setAuthToken, clearAuthToken, ApiError } from '@/utils/apiClient';

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

  const redirectToLogin = () => {
    if (router.canGoBack()) {
      router.replace('/login');
    }
  };

  const resetAuthState = async () => {
    await clearAuthToken();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = await getAuthToken();

        if (!token) {
          await resetAuthState();
          redirectToLogin();
          return;
        }

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
          await resetAuthState();
          redirectToLogin();
        }
      } catch (error) {
        console.error('Auth check error:', error);

        if (error instanceof ApiError && error.status === 401) {
          await resetAuthState();
        }

        redirectToLogin();
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

      await setAuthToken(response.token);

      const userData = await apiRequest('GET', '/login/me');

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
      await resetAuthState();
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

export { ApiError };