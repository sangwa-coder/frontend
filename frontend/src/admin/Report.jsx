import React, { useEffect, useState, useRef } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement } from 'chart.js';
import { getReport } from '../services/AdminService';
import { getCommentsPerDay, getFeedbackPerDay, getCommentsByDate, getFeedbackByDate } from '../services/ReportService'; // Import new methods
import { Container, Grid, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { FiDownload } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logo from '../assets/logo.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement);

const ReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentsData, setCommentsData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const componentRef = useRef();

  const getCurrentUser = () => {
    return {
      userName: "admin TC",
      userRole: "ROLE_ADMIN"
    };
  };

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

  useEffect(() => {
    const fetchCommentsFeedbackData = async () => {
      try {
        setLoading(true);
        const commentsStats = await getCommentsPerDay();
        const feedbackStats = await getFeedbackPerDay();
        setCommentsData(commentsStats);
        setFeedbackData(feedbackStats);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCommentsFeedbackData();
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

  const handleDownloadSystemReport = () => {
    if (!report) return;

    const { userName, userRole } = getCurrentUser();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    const doc = new jsPDF('p', 'pt', 'a4');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.addImage(logo, 'PNG', 40, 30, 50, 50);
    doc.text("System Report", 100, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated by: ${userName} (${userRole === "ROLE_ADMIN" ? "Admin" : "User"})`, 40, 90);
    doc.text(`Date: ${formattedDate} | Time: ${formattedTime}`, 40, 105);

    doc.setLineWidth(0.5);
    doc.line(40, 115, 555, 115);

    doc.autoTable({
      startY: 130,
      head: [['Metric', 'Count']],
      body: [
        ['Total Users', report.totalUsers],
        ['Total Research', report.totalResearch],
        ['Total Comments', report.totalComments],
        ['Total Threads', report.totalThreads],
        ['Total Posts', report.totalPosts],
        ['Total Feedback', report.totalFeedback],
      ],
      theme: 'grid',
      styles: { cellPadding: 5, fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 40, right: 40 },
    });

    doc.save('system_report.pdf');
  };

  const handleDownloadCommentsFeedbackReport = () => {
    const { userName, userRole } = getCurrentUser();
    const formattedDate = selectedDate.toLocaleDateString();

    const doc = new jsPDF('p', 'pt', 'a4');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.addImage(logo, 'PNG', 40, 30, 50, 50);
    doc.text("Comments & Feedback Report", 100, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated by: ${userName} (${userRole === "ROLE_ADMIN" ? "Admin" : "User"})`, 40, 90);
    doc.text(`Date: ${formattedDate}`, 40, 105);

    doc.setLineWidth(0.5);
    doc.line(40, 115, 555, 115);

    doc.text("Comments per Day", 40, 130);
    doc.autoTable({
      startY: 150,
      head: [['Date', 'Count']],
      body: commentsData.map(item => [item.date, item.count]),
      theme: 'grid',
      styles: { cellPadding: 5, fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 40, right: 40 },
    });

    doc.addPage();
    doc.text("Feedback per Day", 40, 40);
    doc.autoTable({
      startY: 60,
      head: [['Date', 'Count']],
      body: feedbackData.map(item => [item.date, item.count]),
      theme: 'grid',
      styles: { cellPadding: 5, fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 40, right: 40 },
    });

    doc.save(`comments_feedback_report_${formattedDate}.pdf`);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  const userData = report ? {
    labels: ['Users', 'Research', 'Comments', 'Threads', 'Posts', 'Feedback'],
    datasets: [
      {
        label: 'Count',
        data: [
          report.totalUsers,
          report.totalResearch,
          report.totalComments,
          report.totalThreads,
          report.totalPosts,
          report.totalFeedback,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  } : null;

  const commentsChartData = {
    labels: commentsData.map(item => item.date),
    datasets: [
      {
        label: 'Comments per Day',
        data: commentsData.map(item => item.count),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }
    ]
  };

  const feedbackChartData = {
    labels: feedbackData.map(item => item.date),
    datasets: [
      {
        label: 'Feedback per Day',
        data: feedbackData.map(item => item.count),
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1
      }
    ]
  };

  return (
    <Container ref={componentRef} maxWidth="xl" style={{ marginTop: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        System Report
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px', height: '500px' }}>
            {userData ? (
              <Bar data={userData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'System Data Bar Chart' } } }} />
            ) : (
              <Typography variant="h6" align="center">No data available</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px', height: '500px' }}>
            {userData ? (
              <Pie data={userData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'System Data Pie Chart' } } }} />
            ) : (
              <Typography variant="h6" align="center">No data available</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px', height: '500px' }}>
            <Line data={commentsChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Comments per Day' } } }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px', height: '500px' }}>
            <Line data={feedbackChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Feedback per Day' } } }} />
          </Paper>
        </Grid>
       
      </Grid>
      <Grid container justifyContent="space-between" style={{ marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleDownloadSystemReport} startIcon={<FiDownload />}>
          Download System Report
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDownloadCommentsFeedbackReport} startIcon={<FiDownload />}>
          Download Comments & Feedback Report
        </Button>
      </Grid>
    </Container>
  );
};

export default ReportPage;
