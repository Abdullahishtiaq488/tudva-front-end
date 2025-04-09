import axios from 'axios';
import { getBackendUrl } from './apiConfig';
import { getAuthHeader } from './auth';

/**
 * Get notifications for a user using the file-based API
 * @param {string} userId - The user ID
 * @param {number} page - The page number
 * @param {number} limit - The number of notifications per page
 * @param {boolean} unreadOnly - Whether to get only unread notifications
 * @returns {Promise<Object>} - The notifications and pagination info
 */
export const getUserNotifications = async (userId, page = 1, limit = 10, unreadOnly = false) => {
  try {
    const response = await axios.get(
      `${getBackendUrl()}/api/file-notifications/${userId}?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

/**
 * Create a notification using the file-based API
 * @param {string} userId - The user ID
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 * @param {string} type - The notification type
 * @param {string} courseId - The course ID (optional)
 * @param {string} lectureId - The lecture ID (optional)
 * @param {Object} metadata - Additional metadata (optional)
 * @returns {Promise<Object>} - The created notification
 */
export const createNotification = async (userId, title, message, type, courseId, lectureId, metadata) => {
  try {
    const authHeader = getAuthHeader();
    
    const response = await axios.post(
      `${getBackendUrl()}/api/file-notifications`,
      {
        userId,
        title,
        message,
        type,
        courseId,
        lectureId,
        metadata
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
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Mark a notification as read using the file-based API
 * @param {string} notificationId - The notification ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The result
 */
export const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const authHeader = getAuthHeader();
    
    const response = await axios.put(
      `${getBackendUrl()}/api/file-notifications/${notificationId}/read`,
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
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user using the file-based API
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The result
 */
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const authHeader = getAuthHeader();
    
    const response = await axios.put(
      `${getBackendUrl()}/api/file-notifications/${userId}/read-all`,
      {},
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete a notification using the file-based API
 * @param {string} notificationId - The notification ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The result
 */
export const deleteNotification = async (notificationId, userId) => {
  try {
    const authHeader = getAuthHeader();
    
    const response = await axios.delete(
      `${getBackendUrl()}/api/file-notifications/${notificationId}`,
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        data: {
          userId
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Trigger lecture reminders using the file-based API
 * @param {boolean} isAdmin - Whether the user is an admin
 * @returns {Promise<Object>} - The result
 */
export const triggerLectureReminders = async (isAdmin) => {
  try {
    const authHeader = getAuthHeader();
    
    const response = await axios.post(
      `${getBackendUrl()}/api/file-notifications/trigger-reminders`,
      {
        isAdmin
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
    console.error('Error triggering lecture reminders:', error);
    throw error;
  }
};
