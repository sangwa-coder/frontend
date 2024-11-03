import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActionArea, CardMedia, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { getAllResearch, getAllPublicKnowledge, getAllInfographics } from '../services/PublicServices';
import '../index.css'; // Ensure you import the index.css
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
  const [researchList, setResearchList] = useState([]);
  const [publicKnowledgeList, setPublicKnowledgeList] = useState([]);
  const [infographicsList, setInfographicsList] = useState([]);

  useEffect(() => {
    fetchResearch();
    fetchPublicKnowledge();
    fetchInfographics();
  }, []);

  const fetchResearch = async () => {
    try {
      const data = await getAllResearch();
      setResearchList(data);
    } catch (error) {
      console.error('Error fetching research', error);
    }
  };

  const fetchPublicKnowledge = async () => {
    try {
      const data = await getAllPublicKnowledge();
      setPublicKnowledgeList(data);
    } catch (error) {
      console.error('Error fetching public knowledge', error);
    }
  };

  const fetchInfographics = async () => {
    try {
      const data = await getAllInfographics();
      setInfographicsList(data);
    } catch (error) {
      console.error('Error fetching infographics', error);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const heroImages = [
    require('../assets/Irrigation-Field.jpg'),
    require('../assets/slide2-scaled.jpg'),
    require('../assets/rwanda_story.jpeg'),
  ];

  return (
    <div>
      <Box className="min-h-screen">
        <Slider {...sliderSettings}>
          {heroImages.map((image, index) => (
            <div key={index}>
              <Box
                sx={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '80vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box className="text-center bg-white bg-opacity-75 p-10 rounded-lg shadow-lg">
                  <Typography variant="h2" className="text-green-800 font-bold" gutterBottom>
                    Welcome to Agrillnovate
                  </Typography>
                  <Typography variant="h5" className="text-green-600 mb-6">
                    Innovating Agriculture for a Better Future
                  </Typography>
                  <Button
                    variant="contained"
                    className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
                    component={Link}
                    to="/agricultureresearch"
                  >
                    Explore Research
                  </Button>
                </Box>
              </Box>
            </div>
          ))}
        </Slider>
      </Box>
      <Container>
        <Typography variant="h4" className="text-center text-green-800 font-bold my-8">
          Featured Research
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {researchList.slice(0, 3).map((research) => (
            <Grid item xs={12} sm={6} md={4} key={research.researchID}>
              <Card className="shadow-lg rounded-lg overflow-hidden h-full">
                <CardActionArea component={Link} to={`/research/${research.researchID}`}>
                  <CardMedia
                    className="h-48"
                    component="img"
                    alt={research.title}
                    image={`data:image/jpeg;base64,${research.images[0].image}`} // Assuming first image
                    title={research.title}
                  />
                  <CardContent className="p-4">
                    <Typography gutterBottom variant="h5" component="div" className="font-bold text-gray-900">
                      {research.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" className="mb-4">
                      {research.content.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" className="text-center text-green-800 font-bold my-8">
          Public Knowledge
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {publicKnowledgeList.slice(0, 3).map((knowledge) => (
            <Grid item xs={12} sm={6} md={4} key={knowledge.id}>
              <Card className="shadow-lg rounded-lg overflow-hidden h-full">
                <CardActionArea component={Link} to={`/public-knowledge/${knowledge.id}`}>
                  <CardMedia
                    className="h-48"
                    component="img"
                    alt={knowledge.title}
                    image={`data:image/jpeg;base64,${knowledge.image}`}
                    title={knowledge.title}
                  />
                  <CardContent className="p-4">
                    <Typography gutterBottom variant="h5" component="div" className="font-bold text-gray-900">
                      {knowledge.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" className="mb-4">
                      {knowledge.content.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" className="text-center text-green-800 font-bold my-8">
          Infographics
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {infographicsList.slice(0, 3).map((infographic) => (
            <Grid item xs={12} sm={6} md={4} key={infographic.id}>
              <Card className="shadow-lg rounded-lg overflow-hidden h-full">
                <CardActionArea component={Link} to={`/infographics/${infographic.id}`}>
                  <CardMedia
                    className="h-48"
                    component="img"
                    alt={infographic.title}
                    image={`data:image/jpeg;base64,${infographic.image}`}
                    title={infographic.title}
                  />
                  <CardContent className="p-4">
                    <Typography gutterBottom variant="h5" component="div" className="font-bold text-gray-900">
                      {infographic.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" className="mb-4">
                      {infographic.description.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
