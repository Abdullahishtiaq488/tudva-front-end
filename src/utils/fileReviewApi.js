import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// Fallback implementation of getAuthHeader in case auth.js is missing
const getAuthHeader = () => {
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
 * Get reviews for a course using the file-based API
 * @param {string} courseId - The course ID
 * @param {number} page - The page number
 * @param {number} limit - The number of reviews per page
 * @returns {Promise<Object>} - The reviews and pagination info
 */
export const getReviewsForCourse = async (courseId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${getBackendUrl()}/api/file-reviews/course/${courseId}?page=${page}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
};

/**
 * Create a review using the file-based API
 * @param {string} userId - The user ID
 * @param {string} courseId - The course ID
 * @param {string} content - The review content
 * @param {number} rating - The review rating
 * @returns {Promise<Object>} - The created review
 */
export const createReview = async (userId, courseId, content, rating) => {
  try {
    const authHeader = getAuthHeader();

    const response = await axios.post(
      `${getBackendUrl()}/api/file-reviews`,
      {
        userId,
        courseId,
        content,
        rating
      },
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

/**
 * Update a review using the file-based API
 * @param {string} reviewId - The review ID
 * @param {string} userId - The user ID
 * @param {boolean} isAdmin - Whether the user is an admin
 * @param {Object} data - The updated review data
 * @returns {Promise<Object>} - The updated review
 */
export const updateReview = async (reviewId, userId, isAdmin, data) => {
  try {
    const authHeader = getAuthHeader();

    const response = await axios.put(
      `${getBackendUrl()}/api/file-reviews/${reviewId}`,
      {
        userId,
        isAdmin,
        ...data
      },
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

/**
 * Delete a review using the file-based API
 * @param {string} reviewId - The review ID
 * @param {string} userId - The user ID
 * @param {boolean} isAdmin - Whether the user is an admin
 * @returns {Promise<Object>} - The result
 */
export const deleteReview = async (reviewId, userId, isAdmin) => {
  try {
    const authHeader = getAuthHeader();

    const response = await axios.delete(
      `${getBackendUrl()}/api/file-reviews/${reviewId}`,
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        data: {
          userId,
          isAdmin
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

/**
 * Mark a review as helpful using the file-based API
 * @param {string} reviewId - The review ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The result
 */
export const markReviewAsHelpful = async (reviewId, userId) => {
  try {
    const authHeader = getAuthHeader();

    const response = await axios.post(
      `${getBackendUrl()}/api/file-reviews/${reviewId}/helpful`,
      {
        userId
      },
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    throw error;
  }
};

/**
 * Check if a user has marked a review as helpful using the file-based API
 * @param {string} reviewId - The review ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The result
 */
export const hasMarkedReviewAsHelpful = async (reviewId, userId) => {
  try {
    const authHeader = getAuthHeader();

    const response = await axios.get(
      `${getBackendUrl()}/api/file-reviews/${reviewId}/helpful?userId=${userId}`,
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error checking if review is marked as helpful:', error);
    throw error;
  }
};
