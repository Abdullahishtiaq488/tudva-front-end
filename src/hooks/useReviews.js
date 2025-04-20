// front-end/src/hooks/useReviews.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
// Import regular API methods
import {
  createReview as createReviewRegular,
  getReviewsForCourse as getReviewsForCourseRegular,
  updateReview as updateReviewRegular,
  deleteReview as deleteReviewRegular,
  markReviewAsHelpful as markReviewAsHelpfulRegular,
  hasMarkedReviewAsHelpful as hasMarkedReviewAsHelpfulRegular
} from '@/utils/reviewApi';

import axios from 'axios';

// Regular API wrapper for creating a review through the API route
const createReviewApi = async (courseId, content, rating, userId = null, userName = null) => {
  try {
    // Get user ID from parameter or localStorage
    const actualUserId = userId || 'anonymous_user';
    const actualUserName = userName || 'Anonymous User';

    console.log('Creating review with API:', { userId: actualUserId, userName: actualUserName, courseId, content, rating });
    const response = await axios.post('/api/reviews', {
      userId: actualUserId,
      userName: actualUserName,
      courseId,
      content,
      rating
    });
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating review with API:', error);
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

      // Try to fetch reviews from the API
      try {
        console.log('Fetching reviews from API...');
        const response = await axios.get(`/api/reviews/course/${courseId}?page=${page}&limit=${limit}`);

        if (response.data && response.data.success && response.data.reviews) {
          console.log('Successfully fetched reviews from API:', response.data.reviews);
          setReviews(response.data.reviews);
          setPagination(response.data.pagination || {
            page,
            limit,
            total: response.data.reviews.length,
            totalPages: Math.ceil(response.data.reviews.length / limit)
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
      } catch (error) {
        console.warn('API failed for reviews:', error.message);
        // If API fails, set empty array
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

  // Submit a new review - try ALL APIs in parallel to ensure data consistency
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

      // Try to submit the review to the API
      try {
        // Use the regular API
        response = await createReviewRegular({
          ...reviewData,
          course_id: courseId,
          userId: userId, // Include userId in the request
          userName: userName // Include userName in the request
        });

        if (response && response.success) {
          success = true;
          console.log('Successfully submitted review with API');
        } else {
          throw new Error(response?.error || 'Failed to submit review');
        }
      } catch (error) {
        console.warn('API failed for submit:', error.message);
        throw error;
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

      // Try to update the review using the API
      try {
        console.log('Updating review with API...');
        response = await updateReviewRegular(reviewId, data);
        if (response.success) {
          console.log('Successfully updated review with API');
          success = true;
        } else {
          throw new Error(response?.error || 'Failed to update review');
        }
      } catch (error) {
        console.warn('API failed for update:', error.message);
        throw error;
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

      // Try to delete the review using the API
      try {
        console.log('Deleting review with API...');
        response = await deleteReviewRegular(reviewId);
        if (response.success) {
          console.log('Successfully deleted review with API');
          success = true;
        } else {
          throw new Error(response?.error || 'Failed to delete review');
        }
      } catch (error) {
        console.warn('API failed for delete:', error.message);
        setError('Failed to delete review: ' + error.message);
        return { success: false, error: error.message };
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

      // Try to mark the review as helpful using the API
      try {
        console.log('Marking review as helpful with API...');
        response = await markReviewAsHelpfulRegular(reviewId);
        if (response.success) {
          console.log('Successfully marked review as helpful with API');
          success = true;
        } else {
          throw new Error(response?.error || 'Failed to mark review as helpful');
        }
      } catch (error) {
        console.warn('API failed for marking as helpful:', error.message);
        throw error;
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

      // Try to check if the review is marked as helpful using the API
      try {
        console.log('Checking if review is marked as helpful with API...');
        response = await hasMarkedReviewAsHelpfulRegular(reviewId);
        if (response.success) {
          console.log('Successfully checked if review is marked as helpful with API');
          success = true;
        } else {
          throw new Error(response?.error || 'Failed to check if review is marked as helpful');
        }
      } catch (error) {
        console.warn('API failed for checking if marked as helpful:', error.message);
        throw error;
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
