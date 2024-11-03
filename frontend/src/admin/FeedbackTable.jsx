import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: theme.shape?.borderRadius || 4,
    margin: '10px 0',
    maxWidth: '100%',
    boxShadow: theme.shadows?.[3] || '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  },
  table: {
    minWidth: 650,
  },
  tableHead: {
    backgroundColor: theme.palette?.primary?.light || '#e0e0e0',
  },
  tableCellHead: {
    color: theme.palette?.common?.white || '#fff',
    fontWeight: 'bold',
  },
}));

const FeedbackTable = ({ feedback }) => {
  const classes = useStyles();
  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell className={classes.tableCellHead}>ID</TableCell>
            <TableCell className={classes.tableCellHead}>Content</TableCell>
            <TableCell className={classes.tableCellHead}>Date Submitted</TableCell>
            <TableCell className={classes.tableCellHead}>Research ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feedback.map((feedbackItem) => (
            <TableRow key={feedbackItem.feedbackID}>
              <TableCell>{feedbackItem.feedbackID}</TableCell>
              <TableCell>{feedbackItem.content}</TableCell>
              <TableCell>{new Date(feedbackItem.dateSubmitted).toLocaleDateString()}</TableCell>
              <TableCell>{feedbackItem.researchID}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FeedbackTable;
