import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationsPopup.css';

const NotificationsPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const togglePopup = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    // Fetch notifications from the server
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-wrapper">
      <button onClick={togglePopup} className="notification-button">Notifications</button>
      {isVisible && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={togglePopup}>&times;</span>
            <h2>Notifications</h2>
            <ul>
              {notifications.map((notification, index) => (
                <li key={index}>{notification.message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopup;
