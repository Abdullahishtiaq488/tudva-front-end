'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First check if we have a token in localStorage
        const token = authService.getToken();

        if (token) {
          // If we have a token, try to get the user data
          const storedUser = authService.getUser();

          // If we have stored user data, set it immediately to prevent UI flashing
          if (storedUser) {
            setUser(storedUser);
          }

          // Then validate with the server
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // If server validation fails, clear auth state
            setUser(null);
            authService.clearAuth();
          }
        } else {
          // No token, definitely not authenticated
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        // Set user state with the user data from the login response
        setUser(result.user);
        console.log('Login successful, user set:', result.user);
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.register(userData);
      return result;
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.push('/auth/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    setLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        console.log('User data refreshed successfully:', currentUser);
        return { success: true, user: currentUser };
      }
      console.warn('Failed to refresh user data: No user returned');
      return { success: false, message: 'Failed to refresh user data' };
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return { success: false, message: error.message || 'Failed to refresh user data' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
