import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Grid,
    Paper
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import AdminForumService from '../services/AdminForumService';

const ManageForums = () => {
    const [threads, setThreads] = useState([]);
    const [posts, setPosts] = useState([]);
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [postDialogOpen, setPostDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [selectedThreadId, setSelectedThreadId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchThreads();
    }, []);

    const fetchThreads = async () => {
        setLoading(true);
        try {
            const response = await AdminForumService.getAllThreads();
            setThreads(response.data);
        } catch (error) {
            console.error('Error fetching threads', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPostsByThread = async (threadId) => {
        setLoading(true);
        try {
            const response = await AdminForumService.getPostsByThreadId(threadId);
            setPosts(response.data);
            setPostDialogOpen(true);
        } catch (error) {
            console.error('Error fetching posts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateThread = async () => {
        if (newThreadTitle.trim() === '') return;
        setLoading(true);
        try {
            await AdminForumService.createThread({ title: newThreadTitle });
            setNewThreadTitle('');
            fetchThreads();
            setSnackbarMessage('Thread created successfully');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error creating thread', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDialogSubmit = async () => {
        setLoading(true);
        try {
            await AdminForumService.updateThread(selectedThreadId, { title: dialogContent });
            fetchThreads();
            setSnackbarMessage('Thread updated successfully');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error updating thread', error);
        } finally {
            setLoading(false);
            setDialogOpen(false);
        }
    };

    const handleDeleteThread = async (threadId) => {
        setLoading(true);
        try {
            await AdminForumService.deleteThread(threadId);
            fetchThreads();
            setSnackbarMessage('Thread deleted successfully');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting thread', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth={false} style={{ minHeight: '100vh', padding: '2rem', backgroundColor: '#f4f6f8' }}>
            <Paper elevation={3} style={{ padding: '2rem' }}>
                <Typography variant="h4" gutterBottom>
                    Manage Forums
                </Typography>

                <Box display="flex" alignItems="center" mb={3}>
                    <TextField
                        label="New Thread Title"
                        variant="outlined"
                        fullWidth
                        value={newThreadTitle}
                        onChange={(e) => setNewThreadTitle(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateThread}
                        style={{ marginLeft: '1rem', height: '56px' }}
                    >
                        Create Thread
                    </Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {threads.map((thread) => (
                            <Grid item xs={12} md={6} lg={4} key={thread.threadId}>
                                <Paper elevation={1} style={{ padding: '1rem', position: 'relative' }}>
                                    <Typography variant="h6" gutterBottom>
                                        {thread.title}
                                    </Typography>
                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => fetchPostsByThread(thread.threadId)}
                                        >
                                            View Posts
                                        </Button>
                                        <Box>
                                            <IconButton
                                                color="primary"
                                                onClick={() => {
                                                    setSelectedThreadId(thread.threadId);
                                                    setDialogTitle('Edit Thread');
                                                    setDialogContent(thread.title);
                                                    setDialogOpen(true);
                                                }}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => handleDeleteThread(thread.threadId)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>

            {/* Dialog for editing thread */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>Edit the thread title below:</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        fullWidth
                        variant="outlined"
                        value={dialogContent}
                        onChange={(e) => setDialogContent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleDialogSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for viewing posts */}
            <Dialog open={postDialogOpen} onClose={() => setPostDialogOpen(false)}>
                <DialogTitle>Posts in Thread</DialogTitle>
                <DialogContent>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Paper elevation={1} style={{ padding: '1rem', marginBottom: '1rem' }} key={post.postId}>
                                <Typography variant="body1">{post.content}</Typography>
                            </Paper>
                        ))
                    ) : (
                        <DialogContentText>No posts available.</DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPostDialogOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default ManageForums;
