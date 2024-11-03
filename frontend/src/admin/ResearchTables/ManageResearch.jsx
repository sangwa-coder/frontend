import React, { useEffect, useState } from 'react';
import { getResearch, deleteResearch } from '../../services/AdminService';
import {
  Button,
  Typography,
  Container,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  TablePagination,
} from '@mui/material';
import { Delete, Edit, Info } from '@mui/icons-material';
import AddResearch from './AdminAddResearch';
import AdminUpdateResearch from './AdminUpdateResearch';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const ManageResearch = () => {
  const [research, setResearch] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [fullContent, setFullContent] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAwSoEbsNk6EWrGdcaLPUxyp2FPUJ5eBQg',
  });

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = () => {
    getResearch()
      .then((response) => {
        setResearch(response);
      })
      .catch((error) => {
        console.error('There was an error fetching the research!', error);
      });
  };

  const handleDelete = (id) => {
    setSelectedResearch(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteResearch(selectedResearch)
      .then(() => {
        setResearch(research.filter((item) => item.researchID !== selectedResearch));
        setDeleteDialogOpen(false);
      })
      .catch((error) => {
        console.error('There was an error deleting the research!', error);
        setDeleteDialogOpen(false);
      });
  };

  const handleUpdate = (id) => {
    setSelectedResearch(id);
    setUpdateDialogOpen(true);
  };

  const handleAddOpen = () => setAddDialogOpen(true);
  const handleAddClose = () => {
    setAddDialogOpen(false);
    fetchResearch();
  };

  const handleUpdateClose = () => {
    setUpdateDialogOpen(false);
    fetchResearch();
  };

  const handleContentClick = (content) => {
    setFullContent(content);
    setContentDialogOpen(true);
  };

  const handleContentClose = () => {
    setContentDialogOpen(false);
  };

  const truncateContent = (content, length) => {
    return content.length > length ? content.substring(0, length) + '...' : content;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" component="h1" sx={{ marginBottom: 4, textAlign: 'center' }}>
        Manage Research
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddOpen}
        sx={{ marginBottom: 2, float: 'right' }}
      >
        Add Research
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, border: '1px solid #e0e0e0' }} aria-label="research table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {research.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <TableRow key={item.researchID}>
                <TableCell>
                  {item.images && item.images.length > 0 && (
                    <img
                      src={`data:image/jpeg;base64,${item.images[0].image}`}
                      alt="Research"
                      style={{ width: '100px', height: 'auto', borderRadius: '4px', border: '1px solid #e0e0e0' }}
                    />
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.title}
                </TableCell>
                <TableCell>{item.author}</TableCell>
                <TableCell>
                  <Tooltip title={item.content}>
                    <span>
                      {truncateContent(item.content, 50)}
                      <IconButton size="small" color="info" onClick={() => handleContentClick(item.content)}>
                        <Info />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {isLoaded && item.latitude && item.longitude && (
                    <Box sx={{ position: 'relative', height: '100px', marginBottom: 2 }}>
                      <GoogleMap
                        center={{ lat: item.latitude, lng: item.longitude }}
                        zoom={8}
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                      >
                        <Marker position={{ lat: item.latitude, lng: item.longitude }} />
                      </GoogleMap>
                    </Box>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleUpdate(item.researchID)}
                      size="small"
                      sx={{ marginLeft: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item.researchID)}
                      size="small"
                      sx={{ marginLeft: 1 }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={research.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this research?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={addDialogOpen} onClose={handleAddClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Research</DialogTitle>
        <DialogContent>
          <AddResearch onClose={handleAddClose} />
        </DialogContent>
      </Dialog>
      <Dialog open={updateDialogOpen} onClose={handleUpdateClose} maxWidth="md" fullWidth>
        <DialogTitle>Update Research</DialogTitle>
        <DialogContent>
          <AdminUpdateResearch id={selectedResearch} onClose={handleUpdateClose} />
        </DialogContent>
      </Dialog>
      <Dialog open={contentDialogOpen} onClose={handleContentClose} maxWidth="md" fullWidth>
        <DialogTitle>Full Content</DialogTitle>
        <DialogContent>
          <Typography>{fullContent}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleContentClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageResearch;
