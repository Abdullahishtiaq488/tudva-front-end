// front-end/src/hooks/useReviews.js
import { useState, useEffect, useCallback } from 'react';
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

const createReviewFile = async (courseId, content, rating, userId = null) => {
  try {
    // Get user ID from parameter or localStorage
    const actualUserId = userId || localStorage.getItem('userId') || 'anonymous_user';

    console.log('Creating review with file API:', { userId: actualUserId, courseId, content, rating });
    const response = await axios.post('/api/file-reviews', {
      userId: actualUserId,
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
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found');
    }

    const response = await axios.put(`/api/file-reviews/${reviewId}`, {
      userId,
      ...data
    });
    return response.data;
  } catch (error) {
    console.error('Error updating review with file API:', error);
    throw error;
  }
};

const deleteReviewFile = async (reviewId) => {
  try {
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found');
    }

    const response = await axios.delete(`/api/file-reviews/${reviewId}`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting review with file API:', error);
    throw error;
  }
};

const markReviewAsHelpfulFile = async (reviewId) => {
  try {
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found');
    }

    const response = await axios.post(`/api/file-reviews/${reviewId}/helpful`, {
      userId
    });
    return response.data;
  } catch (error) {
    console.error('Error marking review as helpful with file API:', error);
    throw error;
  }
};

const hasMarkedReviewAsHelpfulFile = async (reviewId) => {
  try {
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found');
    }

    const response = await axios.get(`/api/file-reviews/${reviewId}/helpful?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking if review is marked as helpful with file API:', error);
    throw error;
  }
};

export const useReviews = (courseId) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch reviews for a course - try file-based API first, then regular API
  const fetchReviews = useCallback(async (page = 1, limit = 10) => {
    if (!courseId) {
      console.warn('No courseId provided to fetchReviews');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log(`Fetching reviews for course ${courseId}`);

      // Try file-based API first
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
        console.warn('File-based API failed:', fileError.message);
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
        console.error('Regular API failed:', regularError.message);
        setError('Could not load reviews. Please try again later.');
        setReviews([]);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        });
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

  // Submit a new review - try file-based API first, then regular API
  const submitReview = useCallback(async (reviewData) => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      let success = false;

      // Get user ID from reviewData or localStorage
      const userId = reviewData.userId || localStorage.getItem('userId') || 'anonymous_user';
      console.log('Using user ID for review submission:', userId);

      // Try file-based API first
      try {
        console.log('Trying file-based API for submitting review...');
        response = await createReviewFile(courseId, reviewData.content, reviewData.rating, userId);
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
            userId: userId // Include userId in the request
          });
          if (response.success) {
            console.log('Successfully submitted review with regular API');
            success = true;
          }
        } catch (regularError) {
          console.warn('Regular API failed for submit:', regularError.message);
          // If both fail, throw the file error as it's likely more relevant
          throw fileError;
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
      setError(err.message || 'Error submitting review');
      console.error('Error submitting review:', err);
      return { success: false, error: err.message || 'Error submitting review' };
    } finally {
      setIsLoading(false);
    }
  }, [courseId, fetchReviews, pagination.page, pagination.limit]);

  // Update an existing review
  const updateUserReview = useCallback(async (reviewId, reviewData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await updateReview(reviewId, reviewData);

      if (response.success) {
        // Refresh reviews after update
        await fetchReviews(pagination.page, pagination.limit);
        return { success: true, review: response.review };
      } else {
        setError(response.error || 'Failed to update review');
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError(err.message || 'Error updating review');
      console.error('Error updating review:', err);
      return { success: false, error: err.message || 'Error updating review' };
    } finally {
      setIsLoading(false);
    }
  }, [fetchReviews, pagination.page, pagination.limit]);

  // Delete a review
  const deleteUserReview = useCallback(async (reviewId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await deleteReview(reviewId);

      if (response.success) {
        // Refresh reviews after deletion
        await fetchReviews(pagination.page, pagination.limit);
        return { success: true };
      } else {
        setError(response.error || 'Failed to delete review');
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError(err.message || 'Error deleting review');
      console.error('Error deleting review:', err);
      return { success: false, error: err.message || 'Error deleting review' };
    } finally {
      setIsLoading(false);
    }
  }, [fetchReviews, pagination.page, pagination.limit]);

  // Mark a review as helpful
  const markAsHelpful = useCallback(async (reviewId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await markReviewAsHelpful(reviewId);

      if (response.success) {
        // Update the review in the local state
        setReviews(prev =>
          prev.map(review =>
            review.id === reviewId
              ? { ...review, helpfulCount: response.helpfulCount }
              : review
          )
        );
        return { success: true, helpfulCount: response.helpfulCount };
      } else {
        setError(response.error || 'Failed to mark review as helpful');
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError(err.message || 'Error marking review as helpful');
      console.error('Error marking review as helpful:', err);
      return { success: false, error: err.message || 'Error marking review as helpful' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if a user has marked a review as helpful
  const checkIfMarkedAsHelpful = useCallback(async (reviewId) => {
    try {
      const response = await hasMarkedReviewAsHelpful(reviewId);
      return response;
    } catch (err) {
      console.error('Error checking if review is marked as helpful:', err);
      return { success: false, hasMarked: false };
    }
  }, []);

  // Change page
  const changePage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchReviews(newPage, pagination.limit);
    }
  }, [fetchReviews, pagination.totalPages, pagination.limit]);

  // Initial fetch
  useEffect(() => {
    fetchReviews(1, 10);
  }, [fetchReviews]);

  return {
    reviews,
    isLoading,
    error,
    pagination,
    fetchReviews,
    submitReview,
    updateUserReview,
    deleteUserReview,
    markAsHelpful,
    checkIfMarkedAsHelpful,
    changePage
  };
};
