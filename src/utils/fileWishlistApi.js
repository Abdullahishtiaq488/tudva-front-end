import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// Get a user's wishlist
export const getUserWishlist = async (userId) => {
  try {
    const response = await axios.get(`${getBackendUrl()}/api/file-wishlist/${userId}`);
    return response.data.wishlist || [];
  } catch (error) {
    console.error('Error getting user wishlist:', error);
    return [];
  }
};

// Add a course to a user's wishlist
export const addToWishlist = async (userId, courseId) => {
  try {
    const response = await axios.post(`${getBackendUrl()}/api/file-wishlist/${userId}/add/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Remove a course from a user's wishlist
export const removeFromWishlist = async (userId, courseId) => {
  try {
    const response = await axios.delete(`${getBackendUrl()}/api/file-wishlist/${userId}/remove/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

// Check if a course is in a user's wishlist
export const isInWishlist = async (userId, courseId) => {
  try {
    const response = await axios.get(`${getBackendUrl()}/api/file-wishlist/${userId}/check/${courseId}`);
    return response.data.isInWishlist;
  } catch (error) {
    console.error('Error checking if course is in wishlist:', error);
    return false;
  }
};
