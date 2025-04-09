'use client';

import { useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/services/notificationService';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Initialize socket connection with retry logic
  useEffect(() => {
    if (!user) return;

    let socketInstance = null;
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 3000; // 3 seconds
    let retryTimeout = null;

    const connectSocket = () => {
      try {
        // Clean up previous socket if it exists
        if (socketInstance) {
          socketInstance.disconnect();
        }

        console.log('Attempting to connect to socket server...');
        socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001', {
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000
        });
        setSocket(socketInstance);

        // Set up event handlers
        socketInstance.on('connect', () => {
          console.log('Socket connected successfully');
          retryCount = 0; // Reset retry count on successful connection

          // Authenticate with socket
          const token = localStorage.getItem('auth_token');
          if (token) {
            socketInstance.emit('authenticate', token);
          }
        });

        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          handleReconnect();
        });

        socketInstance.on('disconnect', (reason) => {
          console.warn('Socket disconnected:', reason);
          if (reason === 'io server disconnect') {
            // The server has forcefully disconnected the socket
            handleReconnect();
          }
          // else the socket will automatically try to reconnect
        });

        // Listen for authentication response
        socketInstance.on('authenticated', (response) => {
          if (response.success) {
            console.log('Socket authenticated successfully');
          } else {
            console.error('Socket authentication failed:', response.error);
          }
        });

        // Listen for new notifications
        socketInstance.on('notification', (notification) => {
          console.log('New notification received:', notification);
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);

          // Show a toast notification
          toast.success(notification.title, {
            description: notification.message,
          });
        });
      } catch (error) {
        console.error('Error initializing socket:', error);
        handleReconnect();
      }
    };

    const handleReconnect = () => {
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying socket connection (${retryCount}/${maxRetries}) in ${retryDelay}ms...`);

        // Clear any existing timeout
        if (retryTimeout) {
          clearTimeout(retryTimeout);
        }

        // Set a new timeout for retry
        retryTimeout = setTimeout(connectSocket, retryDelay);
      } else {
        console.error(`Failed to connect after ${maxRetries} attempts`);
      }
    };

    // Initial connection
    connectSocket();

    // Cleanup function
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [user]);

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

  // Initial fetch
  useEffect(() => {
    fetchNotifications(1, 10);
  }, [fetchNotifications]);

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
