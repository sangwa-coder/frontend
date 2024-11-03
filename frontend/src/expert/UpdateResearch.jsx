import React, { useState, useEffect } from 'react';
import { updateResearch, getResearchById } from './../services/AdminService';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid } from '@mui/material';

const AdminUpdateResearch = ({ id, onClose }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [datePublished, setDatePublished] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    if (id) {
      getResearchById(id)
        .then(response => {
          const research = response;
          setTitle(research.title);
          setAuthor(research.author);
          setDatePublished(research.datePublished);
          setContent(research.content);
          setCurrentImage(`data:image/jpeg;base64,${research.image}`);
        })
        .catch(error => {
          console.error('There was an error fetching the research!', error);
        });
    }
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateResearch(id, { title, author, datePublished, content }, image)
      .then(response => {
        console.log('Research updated successfully', response);
        onClose();
      })
      .catch(error => {
        console.error('There was an error updating the research!', error);
      });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <Dialog open={!!id} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Research</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
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
              {currentImage && (
                <img
                  src={currentImage}
                  alt="Current Research"
                  style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                />
              )}
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
              <Button variant="contained" color="primary" type="submit">
                Update Research
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminUpdateResearch;
