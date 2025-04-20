import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

// Helper function to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to get user ID
const getUserId = () => {
  const userData = localStorage.getItem('user_data');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user.id;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  return null;
};

/**
 * Get notifications for the current user
 */
export const getNotifications = async (page = 1, limit = 10, unreadOnly = false) => {
  try {
    const userId = getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated', notifications: [], unreadCount: 0 };
    }

    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    queryParams.append('unreadOnly', unreadOnly);

    // Use regular API
    const response = await axios.get(
      `/api/notifications?${queryParams.toString()}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, error: error.message, notifications: [], unreadCount: 0 };
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const userId = getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Use regular API
    const response = await axios.put(
      `/api/notifications/read/${notificationId}`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const userId = getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Use regular API
    const response = await axios.put(
      '/api/notifications/read-all',
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    const userId = getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Use regular API
    const response = await axios.delete(
      `/api/notifications/${notificationId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, error: error.message };
  }
};
