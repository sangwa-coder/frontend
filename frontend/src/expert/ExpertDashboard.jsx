import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Container, Grid, Paper, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Avatar,
  ListItemAvatar, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Card, CardMedia, Drawer, Badge, Box,
  Alert, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Edit, Delete, Notifications } from '@mui/icons-material';
import {
  getResearchProjectsByExpert, getNotifications, updateResearchProject, deleteResearchProject,
  getCommentsStats, getFeedbackStats, getCommentsByResearchId, getFeedbackByResearchId, createCategory
} from '../services/ExpertServices';
import { getCategories } from '../services/ResearchService';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { PieChart, Pie, Tooltip, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { connectWebSocket, disconnectWebSocket } from '../services/WebSocketService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const containerStyle = {
  width: '100%',
  height: '300px'
};

const center = {
  lat: -1.94407,
  lng: 30.0619
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-header" defaultValue="" onChange={(e) => e.persist()}>
      <option value="1"></option>
      <option value="2"></option>
      <option value=""></option>
    </select>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <button className="ql-underline"></button>
    <button className="ql-image"></button>
  </div>
);

const ExpertDashboard = () => {
  const [researchProjects, setResearchProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState([]);
  const [commentsStats, setCommentsStats] = useState([]);
  const [comments, setComments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formValues, setFormValues] = useState({ title: '', author: '', content: '', latitude: '', longitude: '', category: '' });
  const [newImages, setNewImages] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const quillRef = useRef(null); // Ref for Quill editor

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAwSoEbsNk6EWrGdcaLPUxyp2FPUJ5eBQg',
    libraries: ['places']
  });

  useEffect(() => {
    fetchResearchProjects();
    fetchNotifications();
    fetchCommentsStats();
    fetchFeedbackStats();
    fetchCategories();
    connectWebSocket(handleNotificationReceived);

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const fetchResearchProjects = async () => {
    try {
      const data = await getResearchProjectsByExpert();
      setResearchProjects(data);
      if (data.length > 0) {
        handleProjectSelect(data[0]); // Select the first project by default
      }
    } catch (error) {
      console.error('Error fetching research projects', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  };

  const fetchCommentsStats = async () => {
    try {
      const data = await getCommentsStats();
      setCommentsStats(data);
    } catch (error) {
      console.error('Error fetching comments stats', error);
    }
  };

  const fetchFeedbackStats = async () => {
    try {
      const data = await getFeedbackStats();
      setFeedbackStats(data);
    } catch (error) {
      console.error('Error fetching feedback stats', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const fetchCommentsAndFeedback = async (researchId) => {
    try {
      const commentsData = await getCommentsByResearchId(researchId);
      setComments(commentsData || []);
      const feedbackData = await getFeedbackByResearchId(researchId);
      setFeedbacks(feedbackData || []);
    } catch (error) {
      console.error('Error fetching comments and feedback', error);
    }
  };

  const handleNotificationReceived = (message) => {
    setNotifications((prevNotifications) => [message, ...prevNotifications]);
  };

  const handleEditOpen = (project) => {
    setSelectedProject(project);
    setFormValues({
      title: project.title || '',
      author: project.author || '',
      content: project.content || '',
      latitude: project.latitude || '',
      longitude: project.longitude || '',
      category: project.category || ''
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedProject(null);
    setFormValues({ title: '', author: '', content: '', latitude: '', longitude: '', category: '' });
    setNewImages([]);
    setUpdateError('');
    setNewCategory('');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCategoryChange = (event) => {
    setFormValues({ ...formValues, category: event.target.value });
    setNewCategory('');
  };

  const handleNewCategoryChange = (event) => {
    setNewCategory(event.target.value);
  };

  const handleImageChange = (event) => {
    setNewImages(event.target.files);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.setAttribute('multiple', 'true');
    input.click();

    input.onchange = () => {
      const files = Array.from(input.files);
      const readers = files.map(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const quill = quillRef.current.getEditor();
          let range = quill.getSelection();
          if (!range) {
            range = { index: quill.getLength() - 1 }; // Set range to the end if no selection
          }
          quill.insertEmbed(range.index, 'image', reader.result);
        };
        reader.readAsDataURL(file);
        return file;
      });

      setNewImages(prevImages => [...prevImages, ...files]);
    };
  };

  const handleMapClick = (event) => {
    setFormValues({
      ...formValues,
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng()
    });
  };

  const handleUpdate = async () => {
    if (selectedProject) {
      try {
        const formData = new FormData();
        const updatedFields = {};

        if (formValues.title) updatedFields.title = formValues.title;
        if (formValues.author) updatedFields.author = formValues.author;
        if (formValues.content) updatedFields.content = formValues.content;
        if (formValues.latitude) updatedFields.latitude = formValues.latitude;
        if (formValues.longitude) updatedFields.longitude = formValues.longitude;
        updatedFields.category = formValues.category === 'new' ? newCategory : formValues.category;

        formData.append('research', new Blob([JSON.stringify(updatedFields)], { type: 'application/json' }));

        if (newImages.length > 0) {
          Array.from(newImages).forEach(file => formData.append('images', file));
        }

        await updateResearchProject(selectedProject.researchID, formData);
        fetchResearchProjects();
        handleEditClose();
      } catch (error) {
        console.error('Error updating research project', error);
        setUpdateError('Error updating research project. Please try again.');
      }
    }
  };

  const validateForm = () => {
    const { latitude, longitude } = formValues;
    if (latitude && isNaN(latitude)) {
      alert('Latitude must be a valid number');
      return false;
    }
    if (longitude && isNaN(longitude)) {
      alert('Longitude must be a valid number');
      return false;
    }
    return true;
  };

  const handleDelete = async (id) => {
    try {
      await deleteResearchProject(id);
      fetchResearchProjects();
    } catch (error) {
      console.error('Error deleting research project', error);
    }
  };

  const displayNewImages = () => {
    const imageUrls = Array.from(newImages).map(file => URL.createObjectURL(file));
    return imageUrls.map((url, index) => (
      <Card key={index} sx={{ maxWidth: '100%' }}>
        <CardMedia
          component="img"
          height="300"
          image={url}
          alt={`New Research Image ${index + 1}`}
        />
      </Card>
    ));
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    fetchCommentsAndFeedback(project.researchID);
  };

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Expert Dashboard
      </Typography>
      <Grid container spacing={3} justifyContent="space-between" alignItems="center">
        <Grid item>
          <IconButton onClick={() => setDrawerOpen(true)}>
            <Badge badgeContent={notifications.length} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
        </Grid>
      </Grid>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 350, padding: 2 }}>
          <Typography variant="h6">Notifications</Typography>
          <List>
            {notifications.map((notification, index) => (
              <ListItem key={index}>
                <ListItemText primary={notification.message} secondary={notification.timestamp} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">My Published Research Projects</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-sort-label">Sort by Category</InputLabel>
              <Select
                labelId="category-sort-label"
                id="category-sort"
                value={formValues.category}
                onChange={handleCategoryChange}
                label="Sort by Category"
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <List>
              {researchProjects.filter(project => !formValues.category || project.category === formValues.category).map((project, index) => (
                <ListItem key={index} onClick={() => handleProjectSelect(project)} button>
                  <ListItemAvatar>
                    <Avatar>{project.title ? project.title.charAt(0) : '?'}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`${project.researchID}: ${project.title}`} secondary={`Author: ${project.author}`} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditOpen(project)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(project.researchID)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12}>
      <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Comments Overview
        </Typography>
        <BarChart
          width={1000}
          height={400}
          data={commentsStats}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="researchTitle" tick={{ fill: '#333' }} />
          <YAxis tick={{ fill: '#333' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#333', color: '#fff', borderRadius: '5px' }}
            itemStyle={{ color: '#fff' }}
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ top: 0 }} />
          <Bar dataKey="commentCount" fill="#82ca9d" barSize={40} radius={[10, 10, 0, 0]} />
        </BarChart>
      </Paper>
    </Grid>
  
        
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Comments on My Research</Typography>
            <List>
              {Array.isArray(comments) && comments.map((comment, index) => (
                <ListItem key={index}>
                  <ListItemText primary={comment.content} secondary={`Research ID: ${comment.researchID}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Feedback on My Research</Typography>
            <List>
              {Array.isArray(feedbacks) && feedbacks.map((feedback, index) => (
                <ListItem key={index}>
                  <ListItemText primary={feedback.content} secondary={`Research ID: ${feedback.researchID}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Research Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {updateError && <Alert severity="error">{updateError}</Alert>}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                value={formValues.title}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Author"
                name="author"
                value={formValues.author}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Content
              </Typography>
              <ReactQuill
                ref={quillRef} // Attach the ref to Quill editor
                theme="snow"
                value={formValues.content}
                onChange={(content) => setFormValues({ ...formValues, content })}
                modules={{
                  toolbar: {
                    container: "#toolbar",
                    handlers: {
                      image: handleImageUpload,
                    },
                  },
                }}
                style={{ marginBottom: '1rem' }}
              />
              <CustomToolbar />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Latitude"
                name="latitude"
                value={formValues.latitude}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Longitude"
                name="longitude"
                value={formValues.longitude}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: parseFloat(formValues.latitude) || center.lat, lng: parseFloat(formValues.longitude) || center.lng }}
                zoom={10}
                onClick={handleMapClick}
              >
                <Marker position={{ lat: parseFloat(formValues.latitude) || center.lat, lng: parseFloat(formValues.longitude) || center.lng }} />
              </GoogleMap>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  value={formValues.category}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  {categories.map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                  <MenuItem value="new">Create New Category</MenuItem>
                </Select>
              </FormControl>
              {formValues.category === 'new' && (
                <TextField
                  margin="normal"
                  fullWidth
                  id="newCategory"
                  label="New Category"
                  name="newCategory"
                  value={newCategory}
                  onChange={handleNewCategoryChange}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="upload-images">
                <input
                  style={{ display: 'none' }}
                  id="upload-images"
                  name="upload-images"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <Button variant="contained" color="primary" component="span">
                  Upload New Images
                </Button>
              </label>
            </Grid>
            {selectedProject?.images && selectedProject.images.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Current Image:
                </Typography>
                <Card sx={{ maxWidth: '100%' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={`data:image/jpeg;base64,${selectedProject.images[0].image}`}
                    alt="Current Research Image"
                  />
                </Card>
              </Grid>
            )}
            {newImages.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  New Images:
                </Typography>
                {displayNewImages()}
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExpertDashboard;
