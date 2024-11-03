import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import UsersTable from './UsersTable';
import ResearchTable from './ResearchTable';
import FeedbackTable from './FeedbackTable';
import ThreadsTable from './forumstables/ThreadsTable';
import PostsTable from './forumstables/PostsTable';
import AnalyticsChart from './AnalyticsChart';
import CommentsTable from './CommentsTable';

import { getUsers, getResearch, getFeedback, getThreads, getPosts, getComments, getNotifications } from '../services/AdminService';

const useStyles = makeStyles(() => ({
  card: {
    borderRadius: 4,
    backgroundColor: '#fff',
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
  },
  notificationIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    color: '#fff',
    backgroundColor: 'green',
    borderRadius: '50%',
    padding: 12,
    transform: 'rotate(45deg)', // Adds the angle
    '&:hover': {
      backgroundColor: '#228B22', // Darker green on hover
    },
  },
  menu: {
    mt: 1.5,
  },
}));

const AdminDashboard = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [research, setResearch] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [threads, setThreads] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        const researchData = await getResearch();
        const feedbackData = await getFeedback();
        const threadsData = await getThreads();
        const postsData = await getPosts();
        const commentsData = await getComments();
        const notificationsData = await getNotifications();

        setUsers(usersData);
        setResearch(researchData);
        setFeedback(feedbackData);
        setThreads(threadsData);
        setPosts(postsData);
        setComments(commentsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Set up interval to fetch notifications every second
    const intervalId = setInterval(async () => {
      try {
        const notificationsData = await getNotifications();
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <IconButton className={classes.notificationIcon} onClick={handleNotificationClick}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon fontSize="large" style={{ transform: 'rotate(-45deg)' }} /> {/* Rotate icon back */}
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleNotificationClose}
        className={classes.menu}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled>No notifications available</MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleNotificationClose}>
              <Typography variant="body2">
                {notification.message}
                <br />
                <Typography variant="caption" color="textSecondary">
                  {new Date(notification.timestamp).toLocaleString()}
                </Typography>
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} gutterBottom>
                Analytics
              </Typography>
              <AnalyticsChart />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} gutterBottom>
                Users
              </Typography>
              {users.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No users available
                </Typography>
              ) : (
                <UsersTable users={users} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} gutterBottom>
                Research
              </Typography>
              <ResearchTable research={research} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} gutterBottom>
                Feedback
              </Typography>
              <FeedbackTable feedback={feedback} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} gutterBottom>
                Threads
              </Typography>
              <ThreadsTable threads={threads} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} gutterBottom>
                Posts
              </Typography>
              <PostsTable posts={posts} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} gutterBottom>
                Comments
              </Typography>
              <CommentsTable comments={comments} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
