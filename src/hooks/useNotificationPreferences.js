'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getNotificationPreferences,
  updateNotificationPreference,
  updateMultiplePreferences,
  resetNotificationPreferences
} from '@/services/notificationPreferenceService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch notification preferences
  const fetchPreferences = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getNotificationPreferences();

      if (response.success) {
        setPreferences(response.preferences);
      } else {
        setError(response.error || 'Failed to fetch notification preferences');
      }
    } catch (err) {
      setError(err.message || 'Error fetching notification preferences');
      console.error('Error fetching notification preferences:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Update a notification preference
  const updatePreference = useCallback(async (preferenceId, enabled) => {
    try {
      setError(null);

      const response = await updateNotificationPreference(preferenceId, enabled);

      if (response.success) {
        setPreferences(prev =>
          prev.map(pref =>
            pref.id === preferenceId
              ? { ...pref, enabled }
              : pref
          )
        );
        toast.success('Notification preference updated');
        return true;
      } else {
        setError(response.error || 'Failed to update notification preference');
        toast.error(response.error || 'Failed to update notification preference');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Error updating notification preference');
      console.error('Error updating notification preference:', err);
      toast.error(err.message || 'Error updating notification preference');
      return false;
    }
  }, []);

  // Update multiple notification preferences
  const updateMultiple = useCallback(async (preferenceIds, enabled) => {
    try {
      setError(null);

      const response = await updateMultiplePreferences(preferenceIds, enabled);

      if (response.success) {
        setPreferences(prev =>
          prev.map(pref =>
            preferenceIds.includes(pref.id)
              ? { ...pref, enabled }
              : pref
          )
        );
        toast.success('Notification preferences updated');
        return true;
      } else {
        setError(response.error || 'Failed to update notification preferences');
        toast.error(response.error || 'Failed to update notification preferences');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Error updating notification preferences');
      console.error('Error updating notification preferences:', err);
      toast.error(err.message || 'Error updating notification preferences');
      return false;
    }
  }, []);

  // Reset notification preferences
  const resetPreferences = useCallback(async () => {
    try {
      setError(null);

      const response = await resetNotificationPreferences();

      if (response.success) {
        setPreferences(response.preferences);
        toast.success('Notification preferences reset to default');
        return true;
      } else {
        setError(response.error || 'Failed to reset notification preferences');
        toast.error(response.error || 'Failed to reset notification preferences');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Error resetting notification preferences');
      console.error('Error resetting notification preferences:', err);
      toast.error(err.message || 'Error resetting notification preferences');
      return false;
    }
  }, []);

  // Get preferences by type and channel
  const getPreferencesByType = useCallback((notificationType) => {
    return preferences.filter(pref => pref.notificationType === notificationType);
  }, [preferences]);

  const getPreferencesByChannel = useCallback((channel) => {
    return preferences.filter(pref => pref.channel === channel);
  }, [preferences]);

  // Initial fetch
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    isLoading,
    error,
    fetchPreferences,
    updatePreference,
    updateMultiple,
    resetPreferences,
    getPreferencesByType,
    getPreferencesByChannel
  };
};
