import React, { useEffect } from 'react';
import '../styles/notification.css';

const Notification = ({ notification, setNotification }) => {
  useEffect(() => {
    // Auto-hide notification after specified duration
    let timer;
    if (notification.visible) {
      timer = setTimeout(() => {
        setNotification(prev => ({
          ...prev,
          visible: false
        }));
      }, notification.duration || 3000);
    }

    // Clean up timer on unmount or when notification changes
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [notification.visible, notification.duration, setNotification]);

  if (!notification.visible) return null;

  return (
    <div className={`notification ${notification.type} visible`}>
      {notification.message}
    </div>
  );
};

export default Notification;