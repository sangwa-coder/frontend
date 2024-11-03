import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { getNotifications } from '../services/AdminService';

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationsData = await getNotifications();
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <List>
      {notifications.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No notifications available
        </Typography>
      ) : (
        notifications.map((notification) => (
          <ListItem key={notification.id}>
            <ListItemText
              primary={notification.message}
              secondary={new Date(notification.timestamp).toLocaleString()}
            />
          </ListItem>
        ))
      )}
    </List>
  );
};

export default NotificationsList;
