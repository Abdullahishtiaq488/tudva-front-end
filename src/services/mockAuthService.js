// Simple authentication service using mock data directly
import { users } from '../data/mockData';

class AuthService {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'auth_user';
  }

  // Login user
  login(email, password) {
    console.log('Login attempt with:', { email });

    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      console.log('Login failed: Invalid credentials');
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }

    // Generate a simple token
    const token = `mock_token_${user.id}_${Date.now()}`;

    // Store in localStorage
    this.setToken(token);
    this.setUser(user);

    console.log('Login successful:', user);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        profilePicture: user.profilePicture
      },
      token: token
    };
  }

  // Register user (not implemented for mock system)
  register(userData) {
    console.log('Register attempt with:', userData);

    // Check if email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());

    if (existingUser) {
      return {
        success: false,
        message: 'Email already registered'
      };
    }

    // In a real app, we would create a new user
    // For mock, we'll just pretend it worked
    return {
      success: true,
      message: 'Registration successful! Please log in.'
    };
  }

  // Logout user
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    console.log('User logged out');
    return { success: true };
  }

  // Get current user
  getCurrentUser() {
    const user = this.getUser();
    return user ? { success: true, user } : null;
  }

  // Update user profile
  updateProfile(userData) {
    const currentUser = this.getUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'Not authenticated'
      };
    }

    // Update user data
    const updatedUser = {
      ...currentUser,
      ...userData,
      // Don't allow changing these fields
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role
    };

    // Save updated user
    this.setUser(updatedUser);

    return {
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    };
  }

  // Helper methods
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  getUser() {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data:', e);
      localStorage.removeItem(this.userKey);
      return null;
    }
  }

  setUser(user) {
    // Don't store password in localStorage
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(this.userKey, JSON.stringify(userWithoutPassword));
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getUser();
  }

  // Get user role
  getUserRole() {
    const user = this.getUser();
    return user ? user.role : null;
  }
}

export default new AuthService();
