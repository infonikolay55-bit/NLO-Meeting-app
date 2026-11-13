import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import api from '../api';

const getNotificationData = (data) => ({
  notifications: Array.isArray(data) ? data : Array.isArray(data?.notifications) ? data.notifications : [],
  unreadCount: Number(data?.unread_count) || 0,
});

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications');
      const result = getNotificationData(data);
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
      return result.unreadCount;
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
      return 0;
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleBellClick = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    const currentUnreadCount = await fetchNotifications();
    if (currentUnreadCount > 0) {
      try {
        const { data } = await api.post('/notifications/mark-read');
        setUnreadCount(Number(data?.unread_count) || 0);
        setNotifications((current) => current.map((notification) => ({ ...notification, is_read: true })));
      } catch (error) {
        console.error('Failed to mark notifications as read:', error);
      }
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={handleBellClick} className="relative p-1 text-gray-400 hover:text-gray-600" aria-label="Notifications" aria-expanded={isOpen}>
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-500">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="border-b border-gray-100 px-4 py-3 last:border-b-0">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <time dateTime={notification.created_at} className="mt-1 block text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </time>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
