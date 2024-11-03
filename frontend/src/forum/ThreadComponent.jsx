import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ForumService from '../services/ForumService';
import { connectWebSocket, disconnectWebSocket, sendMessage } from '../services/WebSocketService';
import { Container, Typography, Paper, TextField, Button, Box } from '@mui/material';

const ThreadComponent = ({ isAuthenticated }) => {
  const { threadId } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        const response = await ForumService.getPosts(threadId);
        const postsData = response.data;
        setPosts(postsData);

        const userIds = [...new Set(postsData.map(post => post.userId))];
        const userNamesMap = await fetchUserNames(userIds);
        setUserNames(userNamesMap);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch posts', error);
        setLoading(false);
      }
    };

    const handleNewPost = (message) => {
      if (message.threadId === threadId) {
        setPosts(prevPosts => [...prevPosts, message.newPost]);
        if (!userNames[message.newPost.userId]) {
          fetchUserNames([message.newPost.userId]).then(userNamesMap => {
            setUserNames(prevUserNames => ({
              ...prevUserNames,
              ...userNamesMap
            }));
          });
        }
      }
    };

    fetchPostsAndUsers();
    connectWebSocket(handleNewPost);

    return () => {
      disconnectWebSocket();
    };
  }, [threadId, userNames]);

  const fetchUserNames = async (userIds) => {
    const userNamesMap = {};
    const userPromises = userIds.map(userId =>
      ForumService.getUserById(userId).then(user => {
        userNamesMap[userId] = user.name;
      })
    );
    await Promise.all(userPromises);
    return userNamesMap;
  };

  const handlePostSubmit = async () => {
    try {
      const response = await ForumService.createPost(threadId, newPost);
      const newPostData = response.data;

      sendMessage('/topic/posts', {
        threadId,
        newPost: newPostData
      });

      setNewPost('');
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" className="py-8">
      <Typography variant="h4" component="h2" className="mb-8 text-center">
        Thread Details
      </Typography>
      <Paper elevation={3} className="p-6 mb-8 bg-gray-50 rounded-lg shadow-lg">
        {posts.length === 0 ? (
          <Typography>No comments yet</Typography>
        ) : (
          posts.map((post, index) => (
            <Box key={index} className="mb-4">
              <Typography>{post.content}</Typography>
              {isAuthenticated && (
                <Typography variant="caption" className="text-gray-500">
                  Reply by: {userNames[post.userId]}
                </Typography>
              )}
            </Box>
          ))
        )}
      </Paper>
      {isAuthenticated ? (
        <Box>
          <TextField
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            fullWidth
            placeholder="Type your message"
            variant="outlined"
            className="mb-4"
          />
          <Button variant="contained" color="primary" onClick={handlePostSubmit}>
            Post
          </Button>
        </Box>
      ) : (
        <Typography variant="body1" color="textSecondary" align="center" className="mt-4">
          You must be logged in to comment.
        </Typography>
      )}
    </Container>
  );
};

export default ThreadComponent;
