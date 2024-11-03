import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { getResearchById, updateResearch } from '../../services/AdminService';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const AdminUpdateResearch = ({ id, onClose }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [datePublished, setDatePublished] = useState('');
  const [content, setContent] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAwSoEbsNk6EWrGdcaLPUxyp2FPUJ5eBQg'
  });

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const research = await getResearchById(id);
        if (research) {
          setTitle(research.title || '');
          setAuthor(research.author || '');
          setDatePublished(research.datePublished || '');
          setContent(research.content || '');
          setLatitude(research.latitude || '');
          setLongitude(research.longitude || '');
          setImages(research.images || []);
        }
      } catch (error) {
        console.error('There was an error fetching the research!', error);
      }
    };

    if (id) {
      fetchResearch();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const researchData = { title, author, datePublished, content, latitude, longitude };

    try {
      const response = await updateResearch(id, researchData, newImages);
      console.log('Research updated successfully', response);
      if (onClose) onClose();
    } catch (error) {
      console.error('There was an error updating the research!', error);
    }
  };

  const handleImageChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleMapClick = (event) => {
    setLatitude(event.latLng.lat());
    setLongitude(event.latLng.lng());
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Update Research</Typography>
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
        <Grid item xs={6}>
          <TextField
            label="Latitude"
            fullWidth
            margin="normal"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Longitude"
            fullWidth
            margin="normal"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={{ lat: parseFloat(latitude) || center.lat, lng: parseFloat(longitude) || center.lng }}
                  zoom={10}
                  onClick={handleMapClick}
                >
                  <Marker position={{ lat: parseFloat(latitude) || center.lat, lng: parseFloat(longitude) || center.lng }} />
                </GoogleMap>
              ) : (
                <Typography>Loading Map...</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Current Images</Typography>
          <Grid container spacing={2}>
            {images.map((img, index) => (
              <Grid item xs={3} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`data:image/jpeg;base64,${img.image}`}
                    alt="Research Image"
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" component="label">
            Upload New Images
            <input type="file" hidden multiple onChange={handleImageChange} />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Update Research
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AdminUpdateResearch;
