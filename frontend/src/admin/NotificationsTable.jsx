import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles'; // Correct import
import { connectSSE, disconnectSSE } from '../services/AdminNotificationService';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: theme.shape.borderRadius,
    margin: '10px 0',
    maxWidth: '100%',
    boxShadow: theme.shadows[3],
  },
  table: {
    minWidth: 650,
  },
  tableHead: {
    backgroundColor: theme.palette.primary.light,
  },
  tableCellHead: {
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

const NotificationsTable = () => {
  const classes = useStyles();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    };

    const eventSource = connectSSE(handleNotification);

    return () => {
      disconnectSSE(eventSource);
    };
  }, []);

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table size="small" className={classes.table}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell className={classes.tableCellHead}>Message</TableCell>
            <TableCell className={classes.tableCellHead}>Date Sent</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notifications.map((notification) => (
            <TableRow key={notification.notificationID}>
              <TableCell>{notification.message}</TableCell>
              <TableCell>{moment(notification.dateSent).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NotificationsTable;
