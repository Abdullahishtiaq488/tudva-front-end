// front-end/src/services/fileFavoriteService.js
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authUtils';
import { wishlist } from '@/data/mockData';
import { wishlist } from '@/data/mockData';

// Get all favorites for the current user
export const getFileFavorites = async () => {
  try {
    // Try to get from API first
    try {
      const response = await axios.get('/api/file-favorites', {
        headers: getAuthHeaders()
      });
      return response.data.favorites || [];
    } catch (apiError) {
      console.log('API call failed, using mock data for favorites');
      // Use our centralized mock data
      return wishlist.map(item => ({
        id: item.id,
        courseId: item.course_id,
        userId: item.user_id,
        createdAt: item.createdAt
      }));
    }
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

    // Try to get from API first
    try {
      const response = await axios.get(`/api/file-favorites/${courseId}`, {
        headers: getAuthHeaders()
      });
      return response.data.isFavorite;
    } catch (apiError) {
      console.log('API call failed, using mock data for favorite check');

      // Use our centralized mock data
      // Check if the course exists in the wishlist
      const isFavorite = wishlist.some(item => item.course_id === courseId);
      console.log('Course in wishlist:', isFavorite);
      return isFavorite;
    }
  } catch (error) {
    console.error('Error checking favorite status with file API:', error);
    return false;
  }
};
