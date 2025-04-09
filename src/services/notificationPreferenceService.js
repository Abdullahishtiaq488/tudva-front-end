// front-end/src/services/notificationPreferenceService.js
import axios from 'axios';
import { getAuthHeader } from '@/utils/auth';

/**
 * Get notification preferences for the authenticated user
 */
export const getNotificationPreferences = async () => {
  try {
    const response = await axios.get('/api/notification-preferences', {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
};

/**
 * Update a notification preference
 */
export const updateNotificationPreference = async (preferenceId, enabled) => {
  try {
    const response = await axios.patch(
      `/api/notification-preferences/${preferenceId}`,
      { enabled },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating notification preference:', error);
    throw error;
  }
};

/**
 * Update multiple notification preferences at once
 */
export const updateMultiplePreferences = async (preferenceIds, enabled) => {
  try {
    const response = await axios.patch(
      '/api/notification-preferences',
      { preferenceIds, enabled },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating multiple notification preferences:', error);
    throw error;
  }
};

/**
 * Reset notification preferences to default
 */
export const resetNotificationPreferences = async () => {
  try {
    const response = await axios.post(
      '/api/notification-preferences/reset',
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error resetting notification preferences:', error);
    throw error;
  }
};
