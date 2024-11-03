// src/components/AdminExpertReportPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Button, Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, MenuItem, FormControl, Select, InputLabel, Checkbox, FormControlLabel,
  FormGroup, Collapse, IconButton
} from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getExperts, getResearchByExpert } from '../services/AdminService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import logo from '../assets/logo.png'; // Import the logo image

const AdminExpertReportPage = () => {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState('');
  const [researchReports, setResearchReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [reportOptions, setReportOptions] = useState({
    includeTitle: true,
    includeAuthor: true,
    includeDate: true,
    includeCategory: true,
    includeCoordinates: true,
    includeImages: true,
    includeFeedback: true,
  });

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const data = await getExperts();
        setExperts(data);
      } catch (error) {
        console.error('Error fetching experts:', error);
      }
    };
    fetchExperts();
  }, []);

  const handleExpertChange = async (event) => {
    setSelectedExpert(event.target.value);
    setLoading(true);
    try {
      const data = await getResearchByExpert(event.target.value);
      setResearchReports(data);
    } catch (error) {
      console.error('Error fetching research by expert:', error);
    }
    setLoading(false);
  };

  const handleOptionChange = (event) => {
    setReportOptions({
      ...reportOptions,
      [event.target.name]: event.target.checked,
    });
  };

  const handleToggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };
  const handleDownloadPDF = () => {
    const currentUser = {
      userName: "admin TC", // Replace with actual logic to extract from JWT token
    };
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
  
    const doc = new jsPDF('p', 'pt', 'a4');
    
    // Set agriculture-themed colors using correct RGB values
    const primaryColor = [34, 139, 34]; // ForestGreen
    const secondaryColor = [107, 142, 35]; // OliveDrab
    
    // Add logo and header
    doc.addImage(logo, 'PNG', 40, 30, 50, 50); // Add logo
    doc.setFontSize(18);
    doc.setTextColor(...primaryColor); // Use spread operator to pass array elements as separate arguments
    doc.text("Expert Research Reports", 110, 60);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Reset to black for standard text
    doc.text(`Generated by: ${currentUser.userName}`, 110, 80);
    doc.text(`Date: ${formattedDate} | Time: ${formattedTime}`, 110, 95);
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200); // Light grey line color
    doc.line(40, 110, 555, 110); // Draw line
  
    // Determine columns based on user selection
    const tableColumns = [];
    const tableRows = [];
  
    if (reportOptions.includeTitle) tableColumns.push("Title");
    if (reportOptions.includeAuthor) tableColumns.push("Author");
    if (reportOptions.includeDate) tableColumns.push("Date Published");
    if (reportOptions.includeCategory) tableColumns.push("Category");
    if (reportOptions.includeCoordinates) tableColumns.push("Coordinates");
  
    researchReports.forEach(report => {
      const rowData = [];
      if (reportOptions.includeTitle) rowData.push(report.title);
      if (reportOptions.includeAuthor) rowData.push(report.author);
      if (reportOptions.includeDate) rowData.push(new Date(report.datePublished).toLocaleDateString());
      if (reportOptions.includeCategory) rowData.push(report.category);
      if (reportOptions.includeCoordinates) rowData.push(`${report.latitude}, ${report.longitude}`);
      tableRows.push(rowData);
    });
  
    doc.autoTable({
      startY: 120,
      head: [tableColumns],
      body: tableRows,
      theme: 'grid',
      styles: { cellPadding: 5, fontSize: 10 },
      headStyles: { fillColor: primaryColor },
      bodyStyles: { textColor: [0, 0, 0] }, // Black text
      alternateRowStyles: { fillColor: [245, 245, 245] }, // Light grey
      margin: { left: 40, right: 40 },
    });
  
    if (reportOptions.includeImages || reportOptions.includeFeedback) {
      researchReports.forEach((report) => {
        if (reportOptions.includeImages && report.images.length > 0) {
          report.images.forEach((image, imgIndex) => {
            doc.addPage();
            doc.setFontSize(14);
            doc.setTextColor(...primaryColor);
            doc.text(`Research ID: ${report.researchID} - Images`, 40, 30);
            doc.addImage(`data:image/jpeg;base64,${image.image}`, 'JPEG', 40, 50, 500, 375); // Adjust size and position as needed
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(`Description: Image ${imgIndex + 1} for Research ID ${report.researchID}`, 40, 440);
          });
        }
  
        if (reportOptions.includeFeedback && report.feedbacks.length > 0) {
          report.feedbacks.forEach((feedback, fbIndex) => {
            doc.addPage();
            doc.setFontSize(14);
            doc.setTextColor(...primaryColor);
            doc.text(`Feedback for Research ID: ${report.researchID}`, 40, 30);
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Feedback ${fbIndex + 1}:`, 40, 50 + fbIndex * 20);
            doc.setFontSize(10);
            doc.text(feedback.content, 40, 65 + fbIndex * 20, { maxWidth: 500 });
          });
        }
      });
    }
  
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("This report is confidential and intended solely for the use of the individual or entity to whom it is addressed. Unauthorized review, use, disclosure, or distribution is prohibited.", 40, doc.internal.pageSize.height - 30, { maxWidth: 500 });
  
    doc.save("expert_research_reports.pdf");
  };
  
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Expert Research Reports
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
          Download Report as PDF
        </Button>
      </Box>
      <FormControl fullWidth margin="normal">
        <InputLabel id="expert-select-label">Select Expert</InputLabel>
        <Select
          labelId="expert-select-label"
          id="expert-select"
          value={selectedExpert}
          onChange={handleExpertChange}
        >
          {experts.map((expert) => (
            <MenuItem key={expert.userID} value={expert.userID}>
              {expert.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={reportOptions.includeTitle} onChange={handleOptionChange} name="includeTitle" />}
          label="Include Title"
        />
        <FormControlLabel
          control={<Checkbox checked={reportOptions.includeAuthor} onChange={handleOptionChange} name="includeAuthor" />}
          label="Include Author"
        />
        <FormControlLabel
          control={<Checkbox checked={reportOptions.includeDate} onChange={handleOptionChange} name="includeDate" />}
          label="Include Date Published"
        />
        <FormControlLabel
          control={<Checkbox checked={reportOptions.includeCategory} onChange={handleOptionChange} name="includeCategory" />}
          label="Include Category"
        />
        <FormControlLabel
          control={<Checkbox checked={reportOptions.includeCoordinates} onChange={handleOptionChange} name="includeCoordinates" />}
          label="Include Coordinates"
        />
        <FormControlLabel
          control={<Checkbox checked={reportOptions.includeImages} onChange={handleOptionChange} name="includeImages" />}
          label="Include Images"
        />
        <FormControlLabel
          control={<Checkbox checked={reportOptions.includeFeedback} onChange={handleOptionChange} name="includeFeedback" />}
          label="Include Feedback"
        />
      </FormGroup>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  {reportOptions.includeTitle && <TableCell>Title</TableCell>}
                  {reportOptions.includeAuthor && <TableCell>Author</TableCell>}
                  {reportOptions.includeDate && <TableCell>Date Published</TableCell>}
                  {reportOptions.includeCategory && <TableCell>Category</TableCell>}
                  {reportOptions.includeCoordinates && <TableCell>Coordinates</TableCell>}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {researchReports.map((report) => (
                  <React.Fragment key={report.researchID}>
                    <TableRow>
                      <TableCell>{report.researchID}</TableCell>
                      {reportOptions.includeTitle && <TableCell>{report.title}</TableCell>}
                      {reportOptions.includeAuthor && <TableCell>{report.author}</TableCell>}
                      {reportOptions.includeDate && <TableCell>{new Date(report.datePublished).toLocaleDateString()}</TableCell>}
                      {reportOptions.includeCategory && <TableCell>{report.category}</TableCell>}
                      {reportOptions.includeCoordinates && <TableCell>{report.latitude}, {report.longitude}</TableCell>}
                      <TableCell>
                        <IconButton onClick={() => handleToggleExpand(report.researchID)}>
                          {expanded === report.researchID ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                        <Collapse in={expanded === report.researchID} timeout="auto" unmountOnExit>
                          <Box margin={2}>
                            <Typography variant="h6" gutterBottom>
                              Content
                            </Typography>
                            <div dangerouslySetInnerHTML={{ __html: report.content }} />
                            {report.images.map((image, index) => (
                              <img
                                key={index}
                                src={`data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(image.image)))}`}
                                alt={`Research ${report.researchID} Image ${index}`}
                                style={{ maxWidth: '100%', marginTop: '1rem' }}
                              />
                            ))}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default AdminExpertReportPage;
