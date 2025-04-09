// front-end/src/services/favoriteService.js
import axios from 'axios';

// Helper function to get auth token
const getAuthHeader = () => {
  // Try different token storage keys
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Add a course to favorites
export const addToFavorites = async (courseId) => {
  try {
    const response = await axios.post(
      '/api/favorites',
      { courseId },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// Remove a course from favorites
export const removeFromFavorites = async (courseId) => {
  try {
    const response = await axios.delete(
      `/api/favorites/${courseId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Get all favorites for the current user
export const getFavorites = async () => {
  try {
    const response = await axios.get(
      '/api/favorites',
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

// Check if a course is in favorites
export const checkIsFavorite = async (courseId) => {
  try {
    const response = await axios.get(
      `/api/favorites/${courseId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return { success: false, isFavorite: false };
  }
};
