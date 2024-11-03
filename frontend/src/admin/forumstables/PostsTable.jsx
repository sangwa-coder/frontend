import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PostsTable = ({ posts }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Post ID</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Thread ID</TableCell>
            <TableCell>User ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.postId}>
              <TableCell>{post.postId}</TableCell>
              <TableCell>{post.content}</TableCell>
              <TableCell>{post.createdAt}</TableCell>
              <TableCell>{post.threadId}</TableCell>
              <TableCell>{post.userId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PostsTable;
