import React, { useState } from 'react';
import { Button, TextField, Grid, Typography } from '@mui/material';
import { createResearch } from '../../services/AdminService';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const AdminAddResearch = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [datePublished, setDatePublished] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAwSoEbsNk6EWrGdcaLPUxyp2FPUJ5eBQg',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const researchData = { title, author, datePublished, content, latitude, longitude };

    try {
      const response = await createResearch(researchData, image);
      console.log('Research added successfully', response);
      if (onClose) onClose();
    } catch (error) {
      console.error('There was an error adding the research!', error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleMapClick = (event) => {
    setLatitude(event.latLng.lat());
    setLongitude(event.latLng.lng());
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Add New Research</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Author"
            fullWidth
            margin="normal"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Date Published"
            type="date"
            fullWidth
            margin="normal"
            value={datePublished}
            onChange={(e) => setDatePublished(e.target.value)}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Content"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
          >
            Upload Image
            <input
              type="file"
              hidden
              onChange={handleImageChange}
            />
          </Button>
        </Grid>
        <Grid item xs={12}>
          {isLoaded && (
            <GoogleMap
              center={{ lat: latitude || 0, lng: longitude || 0 }}
              zoom={8}
              mapContainerStyle={{ width: '100%', height: '400px' }}
              onClick={handleMapClick}
            >
              {latitude && longitude && (
                <Marker position={{ lat: latitude, lng: longitude }} />
              )}
            </GoogleMap>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Add Research
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AdminAddResearch;
