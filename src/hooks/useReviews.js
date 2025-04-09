// front-end/src/hooks/useReviews.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
// Import both regular and file-based API methods
import {
  createReview as createReviewRegular,
  getReviewsForCourse as getReviewsForCourseRegular,
  updateReview as updateReviewRegular,
  deleteReview as deleteReviewRegular,
  markReviewAsHelpful as markReviewAsHelpfulRegular,
  hasMarkedReviewAsHelpful as hasMarkedReviewAsHelpfulRegular
} from '@/utils/reviewApi';

// Import file-based review API methods
import axios from 'axios';

// Direct-reviews API methods
const getReviewsForCourseDirect = async (courseId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`/api/direct-reviews/course/${courseId}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error getting reviews from direct-reviews API:', error);
    throw error;
  }
};

// File-based review API methods
const getReviewsForCourseFile = async (courseId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`/api/file-reviews/course/${courseId}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error getting reviews from file API:', error);
    throw error;
  }
};

const createReviewDirect = async (courseId, content, rating, userId = null, userName = null) => {
  try {
    // Get user ID from parameter or localStorage
    const actualUserId = userId || 'anonymous_user';
    const actualUserName = userName || 'Anonymous User';

    console.log('Creating review with direct API:', { userId: actualUserId, userName: actualUserName, courseId, content, rating });
    const response = await axios.post('/api/direct-reviews', {
      userId: actualUserId,
      userName: actualUserName,
      courseId,
      content,
      rating
    });
    console.log('Direct-reviews API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating review with direct API:', error);
    throw error;
  }
};

const createReviewFile = async (courseId, content, rating, userId = null, userName = null) => {
  try {
    // Get user ID from parameter or localStorage
    const actualUserId = userId || 'anonymous_user';
    const actualUserName = userName || 'Anonymous User';

    console.log('Creating review with file API:', { userId: actualUserId, userName: actualUserName, courseId, content, rating });
    const response = await axios.post('/api/file-reviews', {
      userId: actualUserId,
      userName: actualUserName,
      courseId,
      content,
      rating
    });
    return response.data;
  } catch (error) {
    console.error('Error creating review with file API:', error);
    throw error;
  }
};

const updateReviewFile = async (reviewId, data) => {
  try {
    // Get user ID from localStorage
    const response = await axios.put(`/api/file-reviews/${reviewId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating review with file API:', error);
    throw error;
  }
};

const deleteReviewFile = async (reviewId) => {
  try {
    const response = await axios.delete(`/api/file-reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review with file API:', error);
    throw error;
  }
};

const markReviewAsHelpfulFile = async (reviewId) => {
  try {
    const response = await axios.post(`/api/file-reviews/${reviewId}/helpful`);
    return response.data;
  } catch (error) {
    console.error('Error marking review as helpful with file API:', error);
    throw error;
  }
};

const hasMarkedReviewAsHelpfulFile = async (reviewId) => {
  try {
    const response = await axios.get(`/api/file-reviews/${reviewId}/helpful`);
    return response.data;
  } catch (error) {
    console.error('Error checking if review is marked as helpful with file API:', error);
    throw error;
  }
};

export const useReviews = (courseId) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch reviews for a course - try direct-reviews API first, then file-based API, then regular API
  const fetchReviews = useCallback(async (page = 1, limit = 10) => {
    if (!courseId) {
      console.warn('No courseId provided to fetchReviews');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log(`Fetching reviews for course ${courseId}`);

      // Try direct-reviews API first
      try {
        console.log('Trying direct-reviews API for reviews...');
        const directResponse = await getReviewsForCourseDirect(courseId, page, limit);

        if (directResponse && directResponse.success && directResponse.reviews) {
          console.log('Successfully fetched reviews from direct-reviews API:', directResponse.reviews);
          setReviews(directResponse.reviews);
          setPagination(directResponse.pagination || {
            page,
            limit,
            total: directResponse.reviews.length,
            totalPages: Math.ceil(directResponse.reviews.length / limit)
          });
          setIsLoading(false);
          return; // Exit early if successful
        }
      } catch (directError) {
        console.warn('Direct-reviews API failed for reviews:', directError.message);

        // Try file-based API next
        try {
          console.log('Trying file-based API for reviews...');
          const fileResponse = await getReviewsForCourseFile(courseId, page, limit);

          if (fileResponse && fileResponse.success && fileResponse.reviews) {
            console.log('Successfully fetched reviews from file-based API:', fileResponse.reviews);
            setReviews(fileResponse.reviews);
            setPagination(fileResponse.pagination || {
              page,
              limit,
              total: fileResponse.reviews.length,
              totalPages: Math.ceil(fileResponse.reviews.length / limit)
            });
            setIsLoading(false);
            return; // Exit early if successful
          }
        } catch (fileError) {
          console.warn('File-based API failed for reviews:', fileError.message);
          // Continue to try regular API
        }

        // If file-based API failed, try regular API
        try {
          console.log('Trying regular API for reviews...');
          const response = await getReviewsForCourseRegular(courseId, page, limit);

          if (response && response.success && response.reviews) {
            console.log('Successfully fetched reviews from regular API:', response.reviews);
            setReviews(response.reviews);
            setPagination(response.pagination || {
              page,
              limit,
              total: response.reviews.length,
              totalPages: Math.ceil(response.reviews.length / limit)
            });
          } else {
            // If no reviews found, set empty array
            console.log('No reviews found for this course');
            setReviews([]);
            setPagination({
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0
            });
          }
        } catch (regularError) {
          console.warn('Regular API failed for reviews:', regularError.message);
          // If all APIs fail, set empty array
          setReviews([]);
          setPagination({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
          });
        }
      }
    } catch (err) {
      console.error('Error in fetchReviews:', err);
      setError('Could not load reviews. Please try again later.');
      setReviews([]);
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      });
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  // Submit a new review - try direct-reviews API first, then file-based API, then regular API
  const submitReview = useCallback(async (reviewData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        setError('You must be logged in to submit a review');
        return { success: false, error: 'You must be logged in to submit a review' };
      }

      let response;
      let success = false;

      // Get user ID and name from auth context
      const userId = user.id;
      const userName = user.fullName || user.name;
      console.log('Using authenticated user for review submission:', { userId, userName });

      // Try direct-reviews API first
      try {
        console.log('Trying direct-reviews API for submitting review...');
        response = await createReviewDirect(courseId, reviewData.content, reviewData.rating, userId, userName);
        if (response.success) {
          console.log('Successfully submitted review with direct-reviews API');
          success = true;
        }
      } catch (directError) {
        console.warn('Direct-reviews API failed for submit:', directError.message);

        // If direct-reviews API fails, try file-based API
        try {
          console.log('Trying file-based API for submitting review...');
          response = await createReviewFile(courseId, reviewData.content, reviewData.rating, userId, userName);
          if (response.success) {
            console.log('Successfully submitted review with file-based API');
            success = true;
          }
        } catch (fileError) {
          console.warn('File-based API failed for submit:', fileError.message);

          // If file-based API fails, try regular API
          try {
            console.log('Trying regular API for submitting review...');
            response = await createReviewRegular({
              ...reviewData,
              course_id: courseId,
              userId: userId, // Include userId in the request
              userName: userName // Include userName in the request
            });
            if (response.success) {
              console.log('Successfully submitted review with regular API');
              success = true;
            }
          } catch (regularError) {
            console.warn('Regular API failed for submit:', regularError.message);
            // If all APIs fail, throw the direct error as it's likely more relevant
            throw directError;
          }
        }
      }

      if (success && response.success) {
        // Refresh reviews after submission
        await fetchReviews(pagination.page, pagination.limit);
        return { success: true, review: response.review };
      } else {
        setError(response?.error || 'Failed to submit review');
        return { success: false, error: response?.error };
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [courseId, user, isAuthenticated, pagination.page, pagination.limit, fetchReviews]);

  // Update a review - try file-based API first, then regular API
  const updateReview = useCallback(async (reviewId, data) => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      let success = false;

      // Try file-based API first
      try {
        console.log('Trying file-based API for updating review...');
        response = await updateReviewFile(reviewId, data);
        if (response.success) {
          console.log('Successfully updated review with file-based API');
          success = true;
        }
      } catch (fileError) {
        console.warn('File-based API failed for update:', fileError.message);

        // If file-based API fails, try regular API
        try {
          console.log('Trying regular API for updating review...');
          response = await updateReviewRegular(reviewId, data);
          if (response.success) {
            console.log('Successfully updated review with regular API');
            success = true;
          }
        } catch (regularError) {
          console.warn('Regular API failed for update:', regularError.message);
          // If both fail, throw the file error as it's likely more relevant
          throw fileError;
        }
      }

      if (success && response.success) {
        // Refresh reviews after update
        await fetchReviews(pagination.page, pagination.limit);
        return { success: true, review: response.review };
      } else {
        setError(response?.error || 'Failed to update review');
        return { success: false, error: response?.error };
      }
    } catch (err) {
      console.error('Error updating review:', err);
      setError(err.message || 'Failed to update review');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, fetchReviews]);

  // Delete a review - try file-based API first, then regular API
  const deleteReview = useCallback(async (reviewId) => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      let success = false;

      // Try file-based API first
      try {
        console.log('Trying file-based API for deleting review...');
        response = await deleteReviewFile(reviewId);
        if (response.success) {
          console.log('Successfully deleted review with file-based API');
          success = true;
        }
      } catch (fileError) {
        console.warn('File-based API failed for delete:', fileError.message);
        // If file-based API fails, show error but don't throw
        setError('Failed to delete review: ' + fileError.message);
        return { success: false, error: fileError.message };
      }

      if (success && response.success) {
        // Refresh reviews after deletion
        await fetchReviews(pagination.page, pagination.limit);
        return { success: true };
      } else {
        setError(response?.error || 'Failed to delete review');
        return { success: false, error: response?.error };
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      setError(err.message || 'Failed to delete review');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, fetchReviews]);

  // Mark a review as helpful - try file-based API first, then regular API
  const markReviewAsHelpful = useCallback(async (reviewId) => {
    try {
      setError(null);

      let response;
      let success = false;

      // Try file-based API first
      try {
        console.log('Trying file-based API for marking review as helpful...');
        response = await markReviewAsHelpfulFile(reviewId);
        if (response.success) {
          console.log('Successfully marked review as helpful with file-based API');
          success = true;
        }
      } catch (fileError) {
        console.warn('File-based API failed for marking as helpful:', fileError.message);

        // If file-based API fails, try regular API
        try {
          console.log('Trying regular API for marking review as helpful...');
          response = await markReviewAsHelpfulRegular(reviewId);
          if (response.success) {
            console.log('Successfully marked review as helpful with regular API');
            success = true;
          }
        } catch (regularError) {
          console.warn('Regular API failed for marking as helpful:', regularError.message);
          // If both fail, throw the file error as it's likely more relevant
          throw fileError;
        }
      }

      if (success && response.success) {
        // Refresh reviews after marking as helpful
        await fetchReviews(pagination.page, pagination.limit);
        return { success: true };
      } else {
        setError(response?.error || 'Failed to mark review as helpful');
        return { success: false, error: response?.error };
      }
    } catch (err) {
      console.error('Error marking review as helpful:', err);
      setError(err.message || 'Failed to mark review as helpful');
      return { success: false, error: err.message };
    }
  }, [pagination.page, pagination.limit, fetchReviews]);

  // Check if user has marked a review as helpful - try file-based API first, then regular API
  const hasMarkedReviewAsHelpful = useCallback(async (reviewId) => {
    try {
      setError(null);

      let response;
      let success = false;

      // Try file-based API first
      try {
        console.log('Trying file-based API for checking if review is marked as helpful...');
        response = await hasMarkedReviewAsHelpfulFile(reviewId);
        if (response.success) {
          console.log('Successfully checked if review is marked as helpful with file-based API');
          success = true;
        }
      } catch (fileError) {
        console.warn('File-based API failed for checking if marked as helpful:', fileError.message);

        // If file-based API fails, try regular API
        try {
          console.log('Trying regular API for checking if review is marked as helpful...');
          response = await hasMarkedReviewAsHelpfulRegular(reviewId);
          if (response.success) {
            console.log('Successfully checked if review is marked as helpful with regular API');
            success = true;
          }
        } catch (regularError) {
          console.warn('Regular API failed for checking if marked as helpful:', regularError.message);
          // If both fail, throw the file error as it's likely more relevant
          throw fileError;
        }
      }

      if (success && response.success) {
        return { success: true, hasMarked: response.hasMarked };
      } else {
        setError(response?.error || 'Failed to check if review is marked as helpful');
        return { success: false, error: response?.error };
      }
    } catch (err) {
      console.error('Error checking if review is marked as helpful:', err);
      setError(err.message || 'Failed to check if review is marked as helpful');
      return { success: false, error: err.message };
    }
  }, []);

  // Fetch reviews on mount and when courseId changes
  useEffect(() => {
    if (courseId) {
      fetchReviews();
    }
  }, [courseId, fetchReviews]);

  return {
    reviews,
    isLoading,
    error,
    pagination,
    fetchReviews,
    submitReview,
    updateReview,
    deleteReview,
    markReviewAsHelpful,
    hasMarkedReviewAsHelpful
  };
};
