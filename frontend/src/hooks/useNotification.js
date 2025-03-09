import { useState } from 'react';

const useNotification = () => {
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'info',
    duration: 3000
  });

  const showNotification = (message, type = 'success', duration = 3000) => {
    setNotification({
      visible: true,
      message,
      type,
      duration
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      visible: false
    }));
  };

  return {
    notification,
    setNotification,
    showNotification,
    hideNotification
  };
};

export default useNotification;