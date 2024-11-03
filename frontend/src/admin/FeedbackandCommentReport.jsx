import React, { useEffect, useState, useRef } from 'react';
import { getCommentsByDate, getFeedbackByDate } from '../services/ReportService';
import { getReport } from '../services/AdminService';
import { Container, Grid, Typography, Paper, Button, CircularProgress, Box } from '@mui/material';
import { FiDownload } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logo from '../assets/logo.png'; // Agricultural-themed logo
import leafIcon from '../assets/LeafIcon.png'; // Agricultural-themed icon
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentsData, setCommentsData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const componentRef = useRef();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getReport();
        setReport(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const fetchCommentsFeedbackDataByDate = async (date) => {
    try {
      setLoading(true);
      const dateString = date.toISOString().split('T')[0];
      const commentsStats = await getCommentsByDate(dateString);
      const feedbackStats = await getFeedbackByDate(dateString);
      setCommentsData(commentsStats);
      setFeedbackData(feedbackStats);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchCommentsFeedbackDataByDate(date);
  };

  const handleDownloadCommentsFeedbackReport = () => {
    const formattedDate = selectedDate.toLocaleDateString();
    const disclaimer = "This report is confidential and intended solely for agricultural analysis purposes.";

    const doc = new jsPDF('p', 'pt', 'a4');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.addImage(logo, 'PNG', 40, 30, 50, 50);
    doc.text("Agricultural Comments & Feedback Report", 100, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${formattedDate}`, 40, 105);

    doc.setLineWidth(0.5);
    doc.line(40, 115, 555, 115);

    // Comments section
    doc.text("Comments", 40, 130);
    doc.autoTable({
      startY: 150,
      head: [['Name', 'Content', 'Email', 'Phone', 'Date Submitted']],
      body: commentsData.map(item => [item.name, item.content, item.email, item.phone, new Date(item.dateSubmitted).toLocaleString()]),
      theme: 'grid',
      styles: { cellPadding: 5, fontSize: 10 },
      headStyles: { fillColor: [0, 128, 0] },
      margin: { left: 40, right: 40 },
    });

    // Feedback section
    doc.addPage();
    doc.text("Feedback", 40, 40);
    doc.autoTable({
      startY: 60,
      head: [['Content', 'Date Submitted']],
      body: feedbackData.map(item => [item.content, new Date(item.dateSubmitted).toLocaleString()]),
      theme: 'grid',
      styles: { cellPadding: 5, fontSize: 10 },
      headStyles: { fillColor: [0, 128, 0] },
      margin: { left: 40, right: 40 },
    });

    // Disclaimer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(disclaimer, 40, doc.internal.pageSize.height - 30);

    doc.save(`comments_feedback_report_${formattedDate}.pdf`);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <Typography variant="h6" color="error">
            Error: {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container ref={componentRef} maxWidth="lg" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        <img src={leafIcon} alt="Leaf Icon" style={{ marginRight: '10px', verticalAlign: 'middle', width: '30px', height: '30px' }} />
        Agricultural System Report
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Paper elevation={3} style={{ padding: '20px', display: 'inline-block' }}>
            <Typography variant="subtitle1" gutterBottom>Select Date for Report:</Typography>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              inline
            />
          </Paper>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
        <Button variant="contained" color="success" onClick={handleDownloadCommentsFeedbackReport} startIcon={<FiDownload />}>
          Download Comments & Feedback Report
        </Button>
      </Grid>
    </Container>
  );
};

export default ReportPage;
