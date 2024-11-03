import React, { useState, useEffect } from 'react';
import { connect, getStompClient } from '../services/WebSocketService'; // Adjust path as needed

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleMessageReceived = (message) => {
      setNotifications((prevNotifications) => [...prevNotifications, message]);
    };

    connect(handleMessageReceived);

    return () => {
      // Clean up connection if needed
      const stompClient = getStompClient();
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  return (
    <div>
      <h1>Admin Notifications</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminNotifications;
