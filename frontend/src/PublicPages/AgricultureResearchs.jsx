import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActionArea, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllResearch } from '../services/PublicServices';
import './public.css'; // Ensure you import the public.css

const AgriculturalResearch = () => {
  const [researchList, setResearchList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchAllResearch();
  }, []);

  const fetchAllResearch = async () => {
    try {
      const data = await getAllResearch();
      setResearchList(data);
    } catch (error) {
      console.error('Error fetching research list', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const filteredResearchList = researchList.filter((research) =>
    research.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredResearchList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResearchList = filteredResearchList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <Container className="flex-grow py-10">
        <Typography variant="h4" className="text-center text-green-800 font-bold my-8">
          Agricultural Research
        </Typography>
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            className="search-input p-2 border border-gray-300 rounded-lg w-full max-w-md"
            placeholder="Search research..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Grid container spacing={4} justifyContent="center">
          {paginatedResearchList.map((research) => (
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
                  <CardContent className="p-4 flex flex-col justify-between">
                    <Typography gutterBottom variant="h5" component="div" className="font-bold text-gray-900">
                      {research.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" className="mb-4 flex-grow">
                      {research.content.substring(0, 100)}...
                    </Typography>
                    <div className="text-right">
                      <Link to={`/research/${research.researchID}`} className="text-green-600 hover:text-green-800">
                        Read More
                      </Link>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-green-600 text-white rounded-lg mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </Container>
    </div>
  );
};

export default AgriculturalResearch;
