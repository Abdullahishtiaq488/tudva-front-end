/**
 * Mock Notification Service
 *
 * This file provides mock notification services.
 */

import { mockDb } from '../utils/mockDb';
import { randomDelay } from '../utils/delay';
import { ApiError, ErrorType } from '../utils/errors';
import { createSuccessResponse, createPaginatedResponse } from '../utils/response';
import { getItem } from '../utils/storage';
import {
  Notification,
  NotificationPreference,
  mockNotifications,
  mockNotificationPreferences
} from '../data/index';

// Initialize notifications in the mock database
const initNotifications = () => {
  const existingNotifications = mockDb.getAll<Notification>('notifications');
  if (existingNotifications.length === 0) {
    // Initialize notifications
    mockNotifications.forEach(notification => {
      mockDb.create('notifications', notification);
    });

    // Initialize notification preferences
    mockNotificationPreferences.forEach(preference => {
      mockDb.create('notificationPreferences', preference);
    });
  }
};

// Get notifications for a user with pagination
export const getUserNotifications = async (userId: string, page = 1, limit = 10, unreadOnly = false) => {
  await randomDelay();

  // Initialize notifications if needed
  initNotifications();

  // Check if user is authenticated
  const userData = getItem<{id?: string; role?: string}>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is requesting their own notifications or is an admin
  if (userData.id !== userId && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to view these notifications');
  }

  // Get notifications for this user
  let notifications = mockDb.query<Notification>('notifications', notification => notification.user_id === userId);

  // Filter by read status if requested
  if (unreadOnly) {
    notifications = notifications.filter(notification => !notification.isRead);
  }

  // Sort notifications by date (newest first)
  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply pagination
  const total = notifications.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNotifications = notifications.slice(startIndex, endIndex);

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  // Return paginated response
  return createPaginatedResponse(
    paginatedNotifications,
    page,
    limit,
    total,
    'Notifications retrieved successfully'
  );
};

// Mark a notification as read
export const markNotificationRead = async (notificationId: string) => {
  await randomDelay();

  // Initialize notifications if needed
  initNotifications();

  // Check if user is authenticated
  const userData = getItem<{id?: string; role?: string}>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Get notification
  const notification = mockDb.getById<Notification>('notifications', notificationId);

  if (!notification) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Notification not found');
  }

  // Check if user is the owner of this notification or an admin
  if (notification.user_id !== userData.id && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to mark this notification as read');
  }

  // Update notification
  const updatedNotification = mockDb.update('notifications', notificationId, {
    isRead: true,
    updatedAt: new Date().toISOString(),
  });

  if (!updatedNotification) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Notification not found');
  }

  // Return success response
  return createSuccessResponse(updatedNotification, 'Notification marked as read');
};

// Mark all notifications as read
export const markAllNotificationsRead = async (userId: string) => {
  await randomDelay();

  // Initialize notifications if needed
  initNotifications();

  // Check if user is authenticated
  const userData = getItem<{id?: string; role?: string}>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is marking their own notifications or is an admin
  if (userData.id !== userId && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to mark these notifications as read');
  }

  // Get unread notifications for this user
  const unreadNotifications = mockDb.query<Notification>('notifications', notification =>
    notification.user_id === userId && !notification.isRead
  );

  // Mark each notification as read
  unreadNotifications.forEach(notification => {
    mockDb.update('notifications', notification.id, {
      isRead: true,
      updatedAt: new Date().toISOString(),
    });
  });

  // Return success response
  return createSuccessResponse(null, `${unreadNotifications.length} notifications marked as read`);
};

// Create a new notification
export const createNotification = async (notification: Partial<Notification>) => {
  await randomDelay();

  // Initialize notifications if needed
  initNotifications();

  // Check if user is authenticated
  const userData = getItem<{id?: string; role?: string}>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is an admin or instructor
  if (userData.role !== 'admin' && userData.role !== 'instructor') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to create notifications');
  }

  // Create new notification
  const newNotification: Notification = {
    id: mockDb.generateId(),
    user_id: notification.user_id || '',
    title: notification.title || '',
    message: notification.message || '',
    type: notification.type || 'system',
    isRead: false,
    relatedId: notification.relatedId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save notification to database
  const savedNotification = mockDb.create('notifications', newNotification);

  // Return success response
  return createSuccessResponse(savedNotification, 'Notification created successfully');
};

// Get notification preferences for a user
export const getNotificationPreferences = async (userId: string) => {
  await randomDelay();

  // Initialize notifications if needed
  initNotifications();

  // Check if user is authenticated
  const userData = getItem<{id?: string; role?: string}>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is requesting their own preferences or is an admin
  if (userData.id !== userId && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to view these notification preferences');
  }

  // Get preferences for this user
  const preferences = mockDb.query<NotificationPreference>('notificationPreferences', pref => pref.user_id === userId);

  // If no preferences exist, create default preferences
  if (preferences.length === 0) {
    const defaultPreferences: NotificationPreference = {
      id: mockDb.generateId(),
      user_id: userId,
      email_course_updates: true,
      email_new_lectures: true,
      email_enrollment_confirmation: true,
      push_course_updates: true,
      push_new_lectures: true,
      push_enrollment_confirmation: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedPreferences = mockDb.create('notificationPreferences', defaultPreferences);

    // Return success response
    return createSuccessResponse(savedPreferences, 'Default notification preferences created');
  }

  // Return success response
  return createSuccessResponse(preferences[0], 'Notification preferences retrieved successfully');
};

// Update notification preferences
export const updateNotificationPreferences = async (userId: string, updates: Partial<NotificationPreference>) => {
  await randomDelay();

  // Initialize notifications if needed
  initNotifications();

  // Check if user is authenticated
  const userData = getItem<{id?: string; role?: string}>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is updating their own preferences or is an admin
  if (userData.id !== userId && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to update these notification preferences');
  }

  // Get preferences for this user
  const preferences = mockDb.query<NotificationPreference>('notificationPreferences', pref => pref.user_id === userId);

  // If no preferences exist, create new preferences
  if (preferences.length === 0) {
    const newPreferences: NotificationPreference = {
      id: mockDb.generateId(),
      user_id: userId,
      email_course_updates: updates.email_course_updates !== undefined ? updates.email_course_updates : true,
      email_new_lectures: updates.email_new_lectures !== undefined ? updates.email_new_lectures : true,
      email_enrollment_confirmation: updates.email_enrollment_confirmation !== undefined ? updates.email_enrollment_confirmation : true,
      push_course_updates: updates.push_course_updates !== undefined ? updates.push_course_updates : true,
      push_new_lectures: updates.push_new_lectures !== undefined ? updates.push_new_lectures : true,
      push_enrollment_confirmation: updates.push_enrollment_confirmation !== undefined ? updates.push_enrollment_confirmation : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedPreferences = mockDb.create('notificationPreferences', newPreferences);

    // Return success response
    return createSuccessResponse(savedPreferences, 'Notification preferences created');
  }

  // Update preferences
  const updatedPreferences = mockDb.update('notificationPreferences', preferences[0].id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  if (!updatedPreferences) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Notification preferences not found');
  }

  // Return success response
  return createSuccessResponse(updatedPreferences, 'Notification preferences updated successfully');
};

export default {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  createNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
};
