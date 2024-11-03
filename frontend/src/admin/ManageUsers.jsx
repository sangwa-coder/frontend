import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert } from '@mui/material';
import { getUsers, createUser, updateUser, deleteUser, approveUser, disableUser } from '../services/AdminService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: '' });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpen = (user) => {
    setCurrentUser(user);
    setNewUser(user ? { ...user } : {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      role: ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (currentUser) {
        await updateUser(currentUser.userID, newUser);
        setNotification({ open: true, message: 'User updated successfully', severity: 'success' });
      } else {
        await createUser(newUser);
        setNotification({ open: true, message: 'User created successfully', severity: 'success' });
      }
      const usersData = await getUsers();
      setUsers(usersData);
      handleClose();
    } catch (error) {
      console.error("Error saving user:", error);
      setNotification({ open: true, message: 'Error saving user', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      const usersData = await getUsers();
      setUsers(usersData);
      setNotification({ open: true, message: 'User deleted successfully', severity: 'success' });
    } catch (error) {
      console.error("Error deleting user:", error);
      setNotification({ open: true, message: 'Error deleting user', severity: 'error' });
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveUser(id);
      const usersData = await getUsers();
      setUsers(usersData);
      setNotification({ open: true, message: 'User approved successfully', severity: 'success' });
    } catch (error) {
      console.error("Error approving user:", error);
      setNotification({ open: true, message: 'Error approving user', severity: 'error' });
    }
  };
  const handleDownloadCV = (cvBase64) => {
    if (cvBase64) {
      // Decode Base64 string to byte array
      const byteCharacters = atob(cvBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'cv.pdf';
      link.click();
    } else {
      console.error('No CV data available for download.');
    }
  };

  const handleDisable = async (id) => {
    try {
      await disableUser(id);
      const usersData = await getUsers();
      setUsers(usersData);
      setNotification({ open: true, message: 'User disabled successfully', severity: 'success' });
    } catch (error) {
      console.error("Error disabling user:", error);
      setNotification({ open: true, message: 'Error disabling user', severity: 'error' });
    }
  };

  const handleNotificationClose = () => {
    setNotification({ open: false, message: '', severity: '' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Manage Users
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleOpen(null)} sx={{ mb: 2 }}>
                Add User
              </Button>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Approved</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <React.Fragment key={user.userID}>
                        <TableRow>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>{user.address}</TableCell>
                          <TableCell>{user.approved ? 'Yes' : 'No'}</TableCell>
                          <TableCell>
                            <Button variant="outlined" color="primary" onClick={() => handleOpen(user)} sx={{ mr: 1 }}>
                              Edit
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={() => handleDelete(user.userID)} sx={{ mr: 1 }}>
                              Delete
                            </Button>
                            {!user.approved ? (
                              <Button variant="contained" color="success" onClick={() => handleApprove(user.userID)}>
                                Approve
                              </Button>
                            ) : (
                              <Button variant="contained" color="warning" onClick={() => handleDisable(user.userID)}>
                                Disable
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                        {user.role === 'EXPERT' && (
                          <TableRow>
                            <TableCell colSpan={7} style={{ backgroundColor: '#f9f9f9', paddingLeft: 50 }}>
                              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Education Background:</Typography>
                              <Typography variant="body1" style={{ marginBottom: 10 }}>{user.educationBackground || 'No information provided'}</Typography>
                              {user.cv ? (
                             <Button
                             variant="contained"
                             color="primary"
                             sx={{ mt: 1 }}
                             onClick={() => handleDownloadCV(user.cv)}
                           >
                             Download CV
                           </Button>
                             
                              ) : (
                                <Typography variant="body2" style={{ marginTop: 10 }}>No CV uploaded</Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={newUser.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            value={newUser.phone}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            value={newUser.address}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="role"
            label="Role"
            type="text"
            fullWidth
            value={newUser.role}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {currentUser ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageUsers;
