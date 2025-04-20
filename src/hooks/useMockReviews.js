// front-end/src/hooks/useMockReviews.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { reviews } from '@/data/mockData';

export const useMockReviews = (courseId) => {
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

  // Fetch reviews for a course
  const fetchReviews = useCallback(async (page = 1, limit = 10) => {
    if (!courseId) {
      console.warn('No courseId provided to fetchReviews');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log(`Fetching reviews for course ${courseId}`);

      // Get reviews directly from mock data
      const courseReviews = reviews.filter(review => review.course_id === courseId);

      if (courseReviews && courseReviews.length > 0) {
        console.log('Successfully fetched reviews:', courseReviews);

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedReviews = courseReviews.slice(startIndex, endIndex);

        setReviews(paginatedReviews);
        setPagination({
          page,
          limit,
          total: courseReviews.length,
          totalPages: Math.ceil(courseReviews.length / limit)
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

  // Submit a new review
  const submitReview = useCallback(async (reviewData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        setError('You must be logged in to submit a review');
        return { success: false, error: 'You must be logged in to submit a review' };
      }

      // Get user ID and name from auth context
      const userId = user.id;
      const userName = user.fullName || user.name;
      console.log('Using authenticated user for review submission:', { userId, userName });

      // Simulate adding a review
      const newReview = {
        ...reviewData,
        course_id: courseId,
        user_id: userId,
        user: {
          id: userId,
          fullName: userName
        }
      };

      // In a real app, we would save this to the database
      // For mock purposes, we'll just return the new review
      const response = newReview;

      // Refresh reviews after submission
      await fetchReviews(pagination.page, pagination.limit);
      return { success: true, review: response };
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [courseId, user, isAuthenticated, pagination.page, pagination.limit, fetchReviews]);

  // Update a review
  const updateUserReview = useCallback(async (reviewId, data) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate updating a review
      // In a real app, we would update the review in the database

      // Refresh reviews after update
      await fetchReviews(pagination.page, pagination.limit);
      return { success: true };
    } catch (err) {
      console.error('Error updating review:', err);
      setError(err.message || 'Failed to update review');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, fetchReviews]);

  // Delete a review
  const deleteUserReview = useCallback(async (reviewId) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate deleting a review
      // In a real app, we would delete the review from the database

      // Refresh reviews after deletion
      await fetchReviews(pagination.page, pagination.limit);
      return { success: true };
    } catch (err) {
      console.error('Error deleting review:', err);
      setError(err.message || 'Failed to delete review');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, fetchReviews]);

  // Change page
  const changePage = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) {
      return;
    }

    setPagination(prev => ({ ...prev, page: newPage }));
    fetchReviews(newPage, pagination.limit);
  }, [pagination.totalPages, pagination.limit, fetchReviews]);

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
    updateUserReview,
    deleteUserReview,
    changePage
  };
};

export default useMockReviews;
