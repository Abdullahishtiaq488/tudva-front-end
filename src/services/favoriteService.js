// front-end/src/services/favoriteService.js
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authUtils';
import {
  getFileFavorites,
  addToFileFavorites,
  removeFromFileFavorites,
  checkIsFileFavorite
} from './fileFavoriteService';

// Helper function to get auth token (legacy)
const getAuthHeader = () => {
  // Try different token storage keys
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Add a course to favorites
export const addToFavorites = async (courseId) => {
  try {
    // Try regular API first
    try {
      console.log('Trying regular API for adding to favorites...');
      const response = await axios.post(
        '/api/favorites',
        { courseId },
        { headers: getAuthHeaders() }
      );
      console.log('Successfully added to favorites with regular API');
      return response.data;
    } catch (regularError) {
      console.warn('Regular API failed for adding to favorites:', regularError.message);

      // If regular API fails, try file-based API
      console.log('Trying file-based API for adding to favorites...');
      const fileResponse = await addToFileFavorites(courseId);
      console.log('File API response for adding to favorites:', fileResponse);
      return fileResponse;
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// Remove a course from favorites
export const removeFromFavorites = async (courseId) => {
  try {
    // Try regular API first
    try {
      console.log('Trying regular API for removing from favorites...');
      const response = await axios.delete(
        `/api/favorites/${courseId}`,
        { headers: getAuthHeaders() }
      );
      console.log('Successfully removed from favorites with regular API');
      return response.data;
    } catch (regularError) {
      console.warn('Regular API failed for removing from favorites:', regularError.message);

      // If regular API fails, try file-based API
      console.log('Trying file-based API for removing from favorites...');
      const fileResponse = await removeFromFileFavorites(courseId);
      console.log('File API response for removing from favorites:', fileResponse);
      return fileResponse;
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Get all favorites for the current user
export const getFavorites = async () => {
  try {
    // Try regular API first
    try {
      console.log('Trying regular API for getting favorites...');
      const response = await axios.get(
        '/api/favorites',
        { headers: getAuthHeaders() }
      );
      console.log('Successfully got favorites with regular API');
      return response.data;
    } catch (regularError) {
      console.warn('Regular API failed for getting favorites:', regularError.message);

      // If regular API fails, try file-based API
      console.log('Trying file-based API for getting favorites...');
      const fileFavorites = await getFileFavorites();
      console.log('File API response for getting favorites:', fileFavorites);
      return {
        success: true,
        favorites: fileFavorites
      };
    }
  } catch (error) {
    console.error('Error getting favorites:', error);
    return {
      success: false,
      favorites: []
    };
  }
};

// Check if a course is in favorites
export const checkIsFavorite = async (courseId) => {
  try {
    // Try regular API first
    try {
      console.log('Trying regular API for checking favorite status...');
      const response = await axios.get(
        `/api/favorites/${courseId}`,
        { headers: getAuthHeaders() }
      );
      console.log('Successfully checked favorite status with regular API');
      return response.data;
    } catch (regularError) {
      console.warn('Regular API failed for checking favorite status:', regularError.message);

      // If regular API fails, try file-based API
      console.log('Trying file-based API for checking favorite status...');
      const isFavorite = await checkIsFileFavorite(courseId);
      console.log('File API response for checking favorite status:', isFavorite);
      return {
        success: true,
        isFavorite
      };
    }
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return { success: false, isFavorite: false };
  }
};
