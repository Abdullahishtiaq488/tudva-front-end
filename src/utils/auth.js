/**
 * Authentication Utilities
 * 
 * This file contains utility functions for authentication.
 */

/**
 * Get the authentication header with the JWT token
 * @returns {Object} The authentication header
 */
export const getAuthHeader = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        Authorization: `Bearer ${token}`
      };
    }
  } catch (error) {
    console.error('Error getting auth header:', error);
  }

  return {};
};

/**
 * Check if the user is authenticated
 * @returns {boolean} Whether the user is authenticated
 */
export const isAuthenticated = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const token = localStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get the current user ID from localStorage
 * @returns {string|null} The user ID or null if not found
 */
export const getCurrentUserId = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem('userId');
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

/**
 * Get the current user data from localStorage
 * @returns {Object|null} The user data or null if not found
 */
export const getCurrentUser = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error getting user data:', error);
  }

  return null;
};
