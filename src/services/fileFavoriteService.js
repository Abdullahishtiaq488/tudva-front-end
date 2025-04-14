// front-end/src/services/fileFavoriteService.js
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authUtils';

// Get all favorites for the current user
export const getFileFavorites = async () => {
  try {
    const response = await axios.get('/api/file-favorites', {
      headers: getAuthHeaders()
    });
    return response.data.favorites || [];
  } catch (error) {
    console.error('Error getting favorites from file API:', error);
    return [];
  }
};

// Add a course to favorites
export const addToFileFavorites = async (courseId) => {
  try {
    console.log('Adding to favorites with file API:', courseId);
    const response = await axios.post('/api/file-favorites', 
      { courseId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites with file API:', error);
    throw error;
  }
};

// Remove a course from favorites
export const removeFromFileFavorites = async (courseId) => {
  try {
    console.log('Removing from favorites with file API:', courseId);
    const response = await axios.delete(`/api/file-favorites/${courseId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites with file API:', error);
    throw error;
  }
};

// Check if a course is in favorites
export const checkIsFileFavorite = async (courseId) => {
  try {
    console.log('Checking if course is in favorites with file API:', courseId);
    const response = await axios.get(`/api/file-favorites/${courseId}`, {
      headers: getAuthHeaders()
    });
    return response.data.isFavorite;
  } catch (error) {
    console.error('Error checking favorite status with file API:', error);
    return false;
  }
};
