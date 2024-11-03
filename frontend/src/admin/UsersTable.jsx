import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 4,
    margin: '10px 0',
    maxWidth: '100%',
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  },
  table: {
    minWidth: 400,
  },
  tableHead: {
    backgroundColor: theme?.palette?.primary?.light || '#f5f5f5',
  },
  tableCellHead: {
    color: theme?.palette?.common?.white || '#000',
    fontWeight: 'bold',
  },
  smallCell: {
    padding: '6px 8px',
  },
}));

const UsersTable = ({ users }) => {
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
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table size="small" className={classes.table}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell className={classes.tableCellHead}>Name</TableCell>
            <TableCell className={classes.tableCellHead}>Email</TableCell>
            <TableCell className={classes.tableCellHead}>Role</TableCell>
            <TableCell className={classes.tableCellHead}>Phone</TableCell>
            <TableCell className={classes.tableCellHead}>Address</TableCell>
            <TableCell className={classes.tableCellHead}>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
            <TableRow key={user.userID}>
              <TableCell className={classes.smallCell}>{user.name}</TableCell>
              <TableCell className={classes.smallCell}>{user.email}</TableCell>
              <TableCell className={classes.smallCell}>{user.role}</TableCell>
              <TableCell className={classes.smallCell}>{user.phone}</TableCell>
              <TableCell className={classes.smallCell}>{user.address}</TableCell>
              <TableCell className={classes.smallCell}>{new Date(user.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default UsersTable;
