/**
 * Mock Review Service
 *
 * This file provides mock review services.
 */

import { mockDb } from '../utils/mockDb';
import { randomDelay } from '../utils/delay';
import { ApiError, ErrorType } from '../utils/errors';
import { createSuccessResponse, createPaginatedResponse } from '../utils/response';
import { getItem } from '../utils/storage';
import {
  Review,
  ReviewHelpful,
  Course,
  mockReviews,
  mockReviewHelpful
} from '../data/index';

// Initialize reviews in the mock database
const initReviews = () => {
  const existingReviews = mockDb.getAll<Review>('reviews');
  if (existingReviews.length === 0) {
    // Initialize reviews
    mockReviews.forEach(review => {
      mockDb.create('reviews', review);
    });

    // Initialize review helpful records
    mockReviewHelpful.forEach(helpful => {
      mockDb.create('reviewHelpful', helpful);
    });
  }
};

// Get reviews for a course with pagination
export const getCourseReviews = async (courseId: string, page = 1, limit = 10) => {
  await randomDelay();

  // Initialize reviews if needed
  initReviews();

  // Check if course exists
  const course = mockDb.getById<Course>('courses', courseId);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Get reviews for this course
  const reviews = mockDb.query<Review>('reviews', review => review.course_id === courseId);

  // Sort reviews by date (newest first)
  reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply pagination
  const total = reviews.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReviews = reviews.slice(startIndex, endIndex);

  // Return paginated response
  return createPaginatedResponse(
    paginatedReviews,
    page,
    limit,
    total,
    'Reviews retrieved successfully'
  );
};

// Create a new review
export const createReview = async (userId: string, courseId: string, reviewData: Partial<Review>) => {
  await randomDelay();

  // Initialize reviews if needed
  initReviews();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is creating a review for themselves or is an admin
  if (userData.id !== userId && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to create reviews for this user');
  }

  // Check if course exists
  const course = mockDb.getById<Course>('courses', courseId);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Check if user has already reviewed this course
  const existingReview = mockDb.query<Review>('reviews', review =>
    review.user_id === userId && review.course_id === courseId
  );

  if (existingReview.length > 0) {
    throw new ApiError(ErrorType.CONFLICT, 'You have already reviewed this course');
  }

  // Create new review
  const newReview: Review = {
    id: mockDb.generateId(),
    user_id: userId,
    course_id: courseId,
    rating: reviewData.rating || 5,
    content: reviewData.content || '',
    isHelpful: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save review to database
  const savedReview = mockDb.create('reviews', newReview);

  // Update course average rating and review count
  const courseReviews = mockDb.query<Review>('reviews', review => review.course_id === courseId);
  const totalRating = courseReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / courseReviews.length;

  mockDb.update('courses', courseId, {
    averageRating,
    reviewCount: courseReviews.length,
    updatedAt: new Date().toISOString(),
  });

  // Return success response
  return createSuccessResponse(savedReview, 'Review created successfully');
};

// Update a review
export const updateReview = async (reviewId: string, updates: Partial<Review>) => {
  await randomDelay();

  // Initialize reviews if needed
  initReviews();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Get review
  const review = mockDb.getById<Review>('reviews', reviewId);

  if (!review) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Review not found');
  }

  // Check if user is the author of this review or an admin
  if (review.user_id !== userData.id && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to update this review');
  }

  // Update review
  const updatedReview = mockDb.update('reviews', reviewId, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  if (!updatedReview) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Review not found');
  }

  // Update course average rating if rating was changed
  if (updates.rating) {
    const courseReviews = mockDb.query<Review>('reviews', review => review.course_id === updatedReview.course_id);
    const totalRating = courseReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / courseReviews.length;

    mockDb.update('courses', updatedReview.course_id, {
      averageRating,
      updatedAt: new Date().toISOString(),
    });
  }

  // Return success response
  return createSuccessResponse(updatedReview, 'Review updated successfully');
};

// Delete a review
export const deleteReview = async (reviewId: string) => {
  await randomDelay();

  // Initialize reviews if needed
  initReviews();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Get review
  const review = mockDb.getById<Review>('reviews', reviewId);

  if (!review) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Review not found');
  }

  // Check if user is the author of this review or an admin
  if (review.user_id !== userData.id && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to delete this review');
  }

  // Delete review
  const deleted = mockDb.remove('reviews', reviewId);

  if (!deleted) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Review not found');
  }

  // Update course average rating and review count
  const courseReviews = mockDb.query<Review>('reviews', r => r.course_id === review.course_id);
  const totalRating = courseReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = courseReviews.length > 0 ? totalRating / courseReviews.length : 0;

  mockDb.update('courses', review.course_id, {
    averageRating,
    reviewCount: courseReviews.length,
    updatedAt: new Date().toISOString(),
  });

  // Return success response
  return createSuccessResponse(null, 'Review deleted successfully');
};

// Mark a review as helpful
export const markReviewHelpful = async (userId: string, reviewId: string, isHelpful: boolean) => {
  await randomDelay();

  // Initialize reviews if needed
  initReviews();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Get review
  const review = mockDb.getById<Review>('reviews', reviewId);

  if (!review) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Review not found');
  }

  // Check if user has already marked this review
  const existingMark = mockDb.query<ReviewHelpful>('reviewHelpful', mark =>
    mark.user_id === userId && mark.review_id === reviewId
  );

  if (existingMark.length > 0) {
    // Update existing mark
    mockDb.update('reviewHelpful', existingMark[0].id, {
      isHelpful,
      updatedAt: new Date().toISOString(),
    });
  } else {
    // Create new mark
    const newMark: ReviewHelpful = {
      id: mockDb.generateId(),
      user_id: userId,
      review_id: reviewId,
      isHelpful,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDb.create('reviewHelpful', newMark);
  }

  // Update review helpful count
  const helpfulMarks = mockDb.query<ReviewHelpful>('reviewHelpful', mark =>
    mark.review_id === reviewId && mark.isHelpful
  );

  mockDb.update('reviews', reviewId, {
    isHelpful: helpfulMarks.length,
    updatedAt: new Date().toISOString(),
  });

  // Return success response
  return createSuccessResponse(null, isHelpful ? 'Review marked as helpful' : 'Review marked as not helpful');
};

export default {
  getCourseReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
};
