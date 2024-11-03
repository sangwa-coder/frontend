import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Container, TextField, Button, Box, Typography, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { createResearch, getCategories } from '../services/ResearchService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  position: 'relative',
};

const initialCenter = {
  lat: -1.970579,
  lng: 30.104429,
};

const searchBoxStyle = {
  boxSizing: 'border-box',
  border: '1px solid transparent',
  width: '300px',
  height: '40px',
  padding: '0 12px',
  borderRadius: '3px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  fontSize: '16px',
  outline: 'none',
  textOverflow: 'ellipses',
  position: 'absolute',
  top: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
};

const libraries = ['places'];

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

const AddResearch = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [datePublished, setDatePublished] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const searchBoxRef = useRef(null);
  const quillRef = useRef(null); // Ref for Quill editor

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const researchData = {
      title,
      author,
      datePublished,
      content,
      latitude: location ? location.lat : null,
      longitude: location ? location.lng : null,
      category: selectedCategory === 'new' ? newCategory : selectedCategory, // Send selected category or new category
    };

    const formData = new FormData();
    formData.append('research', new Blob([JSON.stringify(researchData)], { type: 'application/json' }));

    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    try {
      await createResearch(formData);
      toast.success('Research submitted successfully!');
      // Reset form fields
      setTitle('');
      setAuthor('');
      setDatePublished('');
      setContent('');
      setThumbnail(null);
      setThumbnailPreview('');
      setImages([]);
      setLocation(null);
      setSelectedCategory('');
      setNewCategory('');
    } catch (error) {
      console.error('Error submitting research:', error);
      toast.error('Error submitting research');
    }
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];
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
      setImages((prevImages) => [...prevImages, file]);
    };
  };

  const handleMapClick = useCallback((event) => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setLocation(location);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Add Research
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="author"
          label="Author"
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="datePublished"
          label="Date Published"
          name="datePublished"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={datePublished}
          onChange={(e) => setDatePublished(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
        {selectedCategory === 'new' && (
          <TextField
            margin="normal"
            fullWidth
            id="newCategory"
            label="New Category"
            name="newCategory"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        )}
        <Typography variant="h6" gutterBottom>
          Content
        </Typography>
        <ReactQuill
          ref={quillRef} // Attach the ref to Quill editor
          theme="snow"
          value={content}
          onChange={setContent}
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
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Upload Thumbnail
          <input type="file" hidden onChange={handleThumbnailChange} />
        </Button>
        {thumbnailPreview && (
          <Box mt={2}>
            <img src={thumbnailPreview} alt="Thumbnail Preview" style={{ width: '100%' }} />
          </Box>
        )}
        <Box mt={3}>
          <Typography variant="h6">Select Research Location</Typography>
          <LoadScript
            googleMapsApiKey="AIzaSyAwSoEbsNk6EWrGdcaLPUxyp2FPUJ5eBQg" // Make sure to replace with your actual API key
            libraries={libraries}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location || initialCenter}
              zoom={8}A
              onClick={handleMapClick}
            >
              <StandaloneSearchBox
                onLoad={(ref) => (searchBoxRef.current = ref)}
                onPlacesChanged={handlePlacesChanged}
              >
                <input
                  type="text"
                  placeholder="Search for places"
                  style={searchBoxStyle}
                />
              </StandaloneSearchBox>
              {location && <Marker position={location} />}
            </GoogleMap>
          </LoadScript>
        </Box>
        {location && (
          <Box mt={2}>
            <Typography variant="body1">Selected Location: {location.lat}, {location.lng}</Typography>
          </Box>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default AddResearch;
