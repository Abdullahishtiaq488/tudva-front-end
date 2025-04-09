'use client';

import { useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/services/notificationService';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, limit = 10, unreadOnly = false) => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getNotifications(page, limit, unreadOnly);

      if (response.success) {
        setNotifications(response.notifications || []);
        setUnreadCount(response.unreadCount || 0);
        setPagination(response.pagination || {
          page,
          limit,
          total: response.notifications?.length || 0,
          totalPages: Math.ceil((response.notifications?.length || 0) / limit)
        });
      } else {
        setError(response.error || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError(err.message || 'Error fetching notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchNotifications(1, 10);

    // Set up polling interval
    const pollInterval = setInterval(() => {
      fetchNotifications(1, 10);
    }, 30000); // 30 seconds

    // Cleanup function
    return () => {
      clearInterval(pollInterval);
    };
  }, [user, fetchNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await markNotificationAsRead(notificationId);

      if (response.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await markAllNotificationsAsRead();

      if (response.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  }, []);

  // Delete notification
  const removeNotification = useCallback(async (notificationId) => {
    try {
      const response = await deleteNotification(notificationId);

      if (response.success) {
        // Update local state
        const notificationToRemove = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));

        // Update unread count if the removed notification was unread
        if (notificationToRemove && !notificationToRemove.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }

        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting notification:', err);
      return false;
    }
  }, [notifications]);

  // Change page
  const changePage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchNotifications(newPage, pagination.limit);
    }
  }, [fetchNotifications, pagination.totalPages, pagination.limit]);

  // Initial fetch is handled by the polling effect

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    changePage
  };
};
