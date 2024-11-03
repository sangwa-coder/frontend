import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
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

const ResearchTable = ({ research }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper className={classes.tableContainer}>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell className={classes.tableCellHead}>ID</TableCell>
              <TableCell className={classes.tableCellHead}>Title</TableCell>
              <TableCell className={classes.tableCellHead}>Author</TableCell>
              <TableCell className={classes.tableCellHead}>Status</TableCell>
              <TableCell className={classes.tableCellHead}>Date Published</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {research.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((res) => (
              <TableRow key={res.researchID}>
                <TableCell>{res.researchID}</TableCell>
                <TableCell>{res.title}</TableCell>
                <TableCell>{res.author}</TableCell>
                <TableCell>{res.status}</TableCell>
                <TableCell>{res.datePublished}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={research.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ResearchTable;
