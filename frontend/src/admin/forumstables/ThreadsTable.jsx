import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ThreadsTable = ({ threads }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Thread ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>User ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {threads.map((thread) => (
            <TableRow key={thread.threadId}>
              <TableCell>{thread.threadId}</TableCell>
              <TableCell>{thread.title}</TableCell>
              <TableCell>{thread.createdAt}</TableCell>
              <TableCell>{thread.userId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ThreadsTable;
