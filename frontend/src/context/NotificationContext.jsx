// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationsService } from '../services/notifications.service';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await notificationsService.getAll();
      setNotifications(data);
      setUnreadCount(data.filter(n => n.status === 'unread').length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const syncNotifications = useCallback(async () => {
    if (!user) return;
    try {
      await notificationsService.sync();
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to sync notifications:', err);
    }
  }, [user, fetchNotifications]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await notificationsService.update(id, 'read');
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAsDone = async (id) => {
    try {
      await notificationsService.update(id, 'done');
      // For "Done", we can either remove it from the active list or just update status
      // The user wants it moved to a "completed state" or removed from active.
      // We'll keep it in the list but with 'done' status.
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'done' } : n));
      // If it was unread, decrement count
      setNotifications(prev => {
        const item = prev.find(n => n.id === id);
        if (item && item.status === 'unread') {
            setUnreadCount(c => Math.max(0, c - 1));
        }
        return prev.map(n => n.id === id ? { ...n, status: 'done' } : n);
      });
    } catch (err) {
      console.error('Failed to mark as done:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationsService.delete(id);
      const item = notifications.find(n => n.id === id);
      if (item && item.status === 'unread') {
        setUnreadCount(c => Math.max(0, c - 1));
      }
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      syncNotifications,
      markAsRead,
      markAsDone,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
