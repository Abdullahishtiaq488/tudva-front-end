/**
 * Mock Wishlist Service
 *
 * This file provides mock wishlist services.
 */

import { mockDb } from '../utils/mockDb';
import { randomDelay } from '../utils/delay';
import { ApiError, ErrorType } from '../utils/errors';
import { createSuccessResponse } from '../utils/response';
import { getItem } from '../utils/storage';
import {
  Wishlist,
  Course,
  mockWishlist
} from '../data/index';

// Initialize wishlist in the mock database
const initWishlist = () => {
  const existingWishlist = mockDb.getAll<Wishlist>('wishlist');
  if (existingWishlist.length === 0) {
    // Initialize wishlist
    mockWishlist.forEach(item => {
      mockDb.create('wishlist', item);
    });
  }
};

// Get wishlist for a user
export const getUserWishlist = async (userId: string) => {
  await randomDelay();

  // Initialize wishlist if needed
  initWishlist();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is requesting their own wishlist or is an admin
  if (userData.id !== userId && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to view this wishlist');
  }

  // Get wishlist items for this user
  const wishlistItems = mockDb.query<Wishlist>('wishlist', item => item.user_id === userId);

  // Get course details for each wishlist item
  const wishlistWithCourses = await Promise.all(wishlistItems.map(async item => {
    const course = mockDb.getById<Course>('courses', item.course_id);

    return {
      ...item,
      course: course || { title: 'Unknown Course' },
    };
  }));

  // Return success response
  return createSuccessResponse(wishlistWithCourses, 'Wishlist retrieved successfully');
};

// Add a course to wishlist
export const addToWishlist = async (userId: string, courseId: string) => {
  await randomDelay();

  // Initialize wishlist if needed
  initWishlist();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is adding to their own wishlist or is an admin
  if (userData.id !== userId && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to modify this wishlist');
  }

  // Check if course exists
  const course = mockDb.getById<Course>('courses', courseId);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Check if course is already in wishlist
  const existingItem = mockDb.query<Wishlist>('wishlist', item =>
    item.user_id === userId && item.course_id === courseId
  );

  if (existingItem.length > 0) {
    throw new ApiError(ErrorType.CONFLICT, 'Course is already in wishlist');
  }

  // Create new wishlist item
  const newItem: Wishlist = {
    id: mockDb.generateId(),
    user_id: userId,
    course_id: courseId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save wishlist item to database
  const savedItem = mockDb.create('wishlist', newItem);

  // Return success response
  return createSuccessResponse(savedItem, 'Course added to wishlist');
};

// Remove a course from wishlist
export const removeFromWishlist = async (userId: string, courseId: string) => {
  await randomDelay();

  // Initialize wishlist if needed
  initWishlist();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is removing from their own wishlist or is an admin
  if (userData.id !== userId && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to modify this wishlist');
  }

  // Find wishlist item
  const wishlistItems = mockDb.query<Wishlist>('wishlist', item =>
    item.user_id === userId && item.course_id === courseId
  );

  if (wishlistItems.length === 0) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found in wishlist');
  }

  // Remove wishlist item
  const deleted = mockDb.remove('wishlist', wishlistItems[0].id);

  if (!deleted) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found in wishlist');
  }

  // Return success response
  return createSuccessResponse(null, 'Course removed from wishlist');
};

// Check if a course is in wishlist
export const isInWishlist = async (userId: string, courseId: string) => {
  await randomDelay();

  // Initialize wishlist if needed
  initWishlist();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is checking their own wishlist or is an admin
  if (userData.id !== userId && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to view this wishlist');
  }

  // Find wishlist item
  const wishlistItems = mockDb.query<Wishlist>('wishlist', item =>
    item.user_id === userId && item.course_id === courseId
  );

  // Return success response
  return createSuccessResponse({
    inWishlist: wishlistItems.length > 0,
  }, 'Wishlist status retrieved successfully');
};

export default {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
};
