import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '@/services/authService';
import { showAlert } from '@/utils/alert';
import { User } from '@/types';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check login status when app starts
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);

        const token = await authService.getToken();

        if (!token) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          return;
        }

        // Validate token by getting current user
        const user = await authService.getCurrentUser();

        if (user) {
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

      const user = await authService.login({ email, password });

      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('AuthContext: Login failed:', error);

      // Determine error type and show appropriate message
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      const isCredentialError = message.includes('credentials') || message.includes('Authentication failed');

      const title = isCredentialError ? 'Login Failed' : 'Connection Error';
      const type = isCredentialError ? 'error' : 'warning';

      showAlert(title, message, type);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
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