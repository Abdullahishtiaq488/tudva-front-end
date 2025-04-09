// front-end/src/hooks/useReviews.js
import { useState, useEffect, useCallback } from 'react';
import {
  createReview,
  getReviewsForCourse,
  updateReview,
  deleteReview,
  markReviewAsHelpful,
  hasMarkedReviewAsHelpful
} from '@/utils/reviewApi';

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

  // Fetch reviews for a course
  const fetchReviews = useCallback(async (page = 1, limit = 10) => {
    if (!courseId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getReviewsForCourse(courseId, page, limit);

      if (response.success) {
        setReviews(response.reviews || []);
        setPagination(response.pagination || {
          page,
          limit,
          total: response.reviews?.length || 0,
          totalPages: Math.ceil((response.reviews?.length || 0) / limit)
        });
      } else {
        setError(response.error || 'Failed to fetch reviews');
      }
    } catch (err) {
      setError(err.message || 'Error fetching reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  // Submit a new review
  const submitReview = useCallback(async (reviewData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await createReview({
        ...reviewData,
        course_id: courseId
      });

      if (response.success) {
        // Refresh reviews after submission
        await fetchReviews(pagination.page, pagination.limit);
        return { success: true, review: response.review };
      } else {
        setError(response.error || 'Failed to submit review');
        return { success: false, error: response.error };
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
