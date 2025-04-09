// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';

class AuthService {
  // Login user
  async login(email, password) {
    try {
      console.log('Attempting login with:', { email });
      const response = await axios.post(`${API_URL}/api/user/login`, { email, password });

      if (response.data.success) {
        console.log('Login API response success:', response.data);

        // Store token WITHOUT Bearer prefix - the backend expects just the token
        const token = response.data.token;
        const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;

        // Store auth data in localStorage
        this.setToken(cleanToken);
        this.setUser(response.data.user);

        // Verify token was stored correctly
        const storedToken = this.getToken();
        const storedUser = this.getUser();
        console.log('Stored auth data:', {
          tokenStored: !!storedToken,
          userStored: !!storedUser,
          role: storedUser?.role
        });

        return {
          success: true,
          user: response.data.user
        };
      }

      console.log('Login API response failure:', response.data);
      return {
        success: false,
        message: response.data.message || 'Login failed'
      };
    } catch (error) {
      console.error('Login API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/api/user/register`, userData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  }

  // Logout user
  async logout() {
    try {
      // Call the backend logout endpoint
      const token = this.getToken();
      if (token) {
        await axios.post(`${API_URL}/api/user/logout`, {}, {
          headers: { Authorization: token }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage regardless of API success
      this.clearAuth();
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      // First try to get user from localStorage
      const storedUser = this.getUser();
      const token = this.getToken();

      // If no token, we're definitely not authenticated
      if (!token) return null;

      // If we have a stored user, use it initially to avoid delays
      // This helps prevent flashing of unauthenticated state

      // Then try to validate with the server
      try {
        const response = await axios.get(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          // Update stored user data with latest from server
          this.setUser(response.data.user);
          return response.data.user;
        }

        // If request fails, clear auth data
        this.clearAuth();
        return null;
      } catch (error) {
        // If server validation fails but we have a stored user,
        // return the stored user for now to prevent UI flashing
        // This is a fallback for temporary network issues
        if (storedUser) {
          console.warn('Using cached user data due to API error');
          return storedUser;
        }

        console.error('Error getting current user:', error);
        this.clearAuth();
        return null;
      }
    } catch (error) {
      console.error('Unexpected error in getCurrentUser:', error);
      return null;
    }
  }

  // Helper methods
  getToken() {
    return localStorage.getItem('auth_token');
  }

  setToken(token) {
    localStorage.setItem('auth_token', token);
  }

  getUser() {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;

    try {
      const userData = JSON.parse(userStr);
      console.log('Retrieved user data from localStorage:', {
        id: userData?.id,
        email: userData?.email,
        role: userData?.role
      });
      return userData;
    } catch (e) {
      console.error('Error parsing user data:', e);
      // If we can't parse the data, it's corrupted, so remove it
      localStorage.removeItem('auth_user');
      return null;
    }
  }

  setUser(user) {
    if (!user) {
      localStorage.removeItem('auth_user');
      return;
    }

    try {
      localStorage.setItem('auth_user', JSON.stringify(user));
      console.log('User data stored in localStorage:', {
        id: user?.id,
        email: user?.email,
        role: user?.role
      });
    } catch (e) {
      console.error('Error storing user data:', e);
    }
  }

  clearAuth() {
    console.log('Clearing all authentication data');
    // Clear our primary auth items
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    // Clear any legacy or other auth-related items
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');

    // Log the result
    console.log('Auth data after clearing:', {
      token: localStorage.getItem('auth_token'),
      user: localStorage.getItem('auth_user')
    });
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();

    // We need both a token and user data to be considered authenticated
    const isAuth = !!token && !!user;

    if (token && !user) {
      console.warn('Token exists but no user data found - inconsistent auth state');
      // Clean up the inconsistent state
      this.clearAuth();
      return false;
    }

    return isAuth;
  }

  // Get auth header
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export default new AuthService();
