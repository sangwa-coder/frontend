import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useTheme
} from '@mui/material';
import { getComments, getFeedback } from '../services/AdminService';

const AllCommentsAndFeedbacks = () => {
    const [comments, setComments] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const commentsData = await getComments();
                const feedbacksData = await getFeedback();

                setComments(commentsData);
                setFeedbacks(feedbacksData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card elevation={3} sx={{ borderRadius: 3, backgroundColor: theme.palette.background.paper }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                All Comments
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Content</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Phone</TableCell>
                                            <TableCell>Date Submitted</TableCell>
                                            <TableCell>Research ID</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {comments.map((comment) => (
                                            <TableRow key={comment.commentID}>
                                                <TableCell>{comment.commentID}</TableCell>
                                                <TableCell>{comment.content}</TableCell>
                                                <TableCell>{comment.name}</TableCell>
                                                <TableCell>{comment.email}</TableCell>
                                                <TableCell>{comment.phone}</TableCell>
                                                <TableCell>{new Date(comment.dateSubmitted).toLocaleDateString()}</TableCell>
                                                <TableCell>{comment.researchID}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card elevation={3} sx={{ borderRadius: 3, backgroundColor: theme.palette.background.paper }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                All Feedback
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Content</TableCell>
                                            <TableCell>Date Submitted</TableCell>
                                            <TableCell>Research ID</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {feedbacks.map((feedback) => (
                                            <TableRow key={feedback.feedbackID}>
                                                <TableCell>{feedback.feedbackID}</TableCell>
                                                <TableCell>{feedback.content}</TableCell>
                                                <TableCell>{new Date(feedback.dateSubmitted).toLocaleDateString()}</TableCell>
                                                <TableCell>{feedback.researchID}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AllCommentsAndFeedbacks;
