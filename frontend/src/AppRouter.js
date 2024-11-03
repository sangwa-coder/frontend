import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/navbar';
import Dashboard from './Dashboard/Dashboard';
import AdminDashboard from './admin/AdminDashboard';
import ManageUsers from './admin/ManageUsers';
import AdminReport from './admin/Report';
import AdminExpertReportPage from './admin/AdminExpertPage';
import ManageResearch from './admin/ResearchTables/ManageResearch';
import ManagePublicKnowledge from './admin/publicknowledge/ManagePublicKnowledge';
import FeedbackandCommentsReport from './admin/FeedbackandCommentReport';
import ManageInfographics from './admin/infographics/ManageInfographics';
import ManageForums from './admin/ManageForums';
import Managenotifications from './admin/AdminNotifications';
import AllCommentsandFeedbacks from './admin/AllCommentsAndFeedbacks';
import ManageFeedbacks from './admin/ManageFeedbacks';
import ExpertDashboard from './expert/ExpertDashboard';
import FarmerDashboard from './Dashboard/FarmerDashboard';
import CommunityDashboard from './Dashboard/CommunityDashboard';
import ResearchManagement from './researchManagement/ResearchManagement';
import Forums from './forum/forums';
import ThreadComponent from './forum/ThreadComponent';
import NotificationsPopup from './components/NotificationsPopup';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Homepage from './Homepage/home';
import ResearchDetail from './components/ResearchDetail';
import Feedback from './researchManagement/Feedback';
import ManageMyResearch from './expert/ManagemyResearch';
import ExpertAddResearch from './expert/AddResearch';
import ExpertUpdateResearch from './expert/UpdateResearch';
import AdminAddResearch from './admin/ResearchTables/AdminAddResearch';
import AgriculturalResearch from './PublicPages/AgricultureResearchs';
import AdminUpdateResearch from './admin/ResearchTables/AdminUpdateResearch';
import { setAuthToken } from './services/api';
import PublicKnowledge from './PublicPages/PublicKnowledge';
import Infographics from './PublicPages/Infographics';
import UserProfile from './profile/UserProfile';
import PublicKnowledgeDetail from './PublicPages/PubliKnowledgeDetail';
import Footer from './components/Footer';
import './App.css'; 

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    if (token && role && name) {
      setAuthToken(token);
      setIsAuthenticated(true);
      setUserRole(role);
      setUserName(name);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setAuthToken(null);
    setIsAuthenticated(false);
    setUserRole('');
    setUserName('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {isAuthenticated && (userRole === 'ROLE_ADMIN' || userRole === 'ROLE_EXPERT') ? (
        <Sidebar
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          userName={userName}
        />
      ) : (
        <Navbar userName={userName} onLogout={handleLogout} />
      )}
      <div className={`main-content ${userRole === 'ROLE_ADMIN' ? 'main-content-admin' : userRole === 'ROLE_EXPERT' ? 'main-content-expert' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login setAuthenticated={setIsAuthenticated} setUserRole={setUserRole} setUserName={setUserName} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/PublicKnowledge" element={<PublicKnowledge />} />
          <Route path="/Infographics" element={<Infographics />} />
          <Route path="/public-knowledge/:id" element={<PublicKnowledgeDetail />} />

          <Route path="/research/:id" element={<ResearchDetail />} />
          <Route path="/agricultureresearch" element={<AgriculturalResearch />} />
          <Route path="/forums" element={<Forums isAuthenticated={isAuthenticated} />} />
          <Route path="/threads/:threadId" element={<ThreadComponent isAuthenticated={isAuthenticated} />} />
          <Route path="/research" element={<ResearchManagement />} />
          {isAuthenticated ? (
            <>
              {userRole === 'ROLE_ADMIN' && (
                <>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/manage-users" element={<ManageUsers />} />
                  <Route path="/admin/manage-research" element={<ManageResearch />} />
                  <Route path="/admin/manage-forums" element={<ManageForums />} />
                  <Route path="/admin/manage-feedbacks" element={<ManageFeedbacks />} />
                  <Route path="/admin/manage-notifications" element={<Managenotifications />} />
                  <Route path="/admin/add-research" element={<AdminAddResearch />} />
                  <Route path="/admin/AllCommentsAndFeedbacks" element={<AllCommentsandFeedbacks />} />
                  <Route path="/admin/update-research/:id" element={<AdminUpdateResearch />} />
                  <Route path="/admin/manage-pk" element={<ManagePublicKnowledge />} />
                  <Route path="/admin/manage-infographics" element={<ManageInfographics />} />
                  <Route path="/admin/report" element={<AdminReport />} />
                  <Route path="/admin/AdminExpertPage" element={<AdminExpertReportPage />} />
                  <Route path="/admin/FeedbackandCommentReport" element={<FeedbackandCommentsReport />} />


                </>
              )}
              {userRole === 'ROLE_EXPERT' && (
                <>
                  <Route path="/expert/add-research" element={<ExpertAddResearch />} />
                  <Route path="/expert/update-research/:id" element={<ExpertUpdateResearch />} />
                  <Route path="/expert-dashboard" element={<ExpertDashboard />} />
                  <Route path="/expert/manage-my-research" element={<ManageMyResearch />} />
                </>
              )}
              {userRole === 'ROLE_FARMER' && 
              <Route path="/farmer-dashboard" element={<FarmerDashboard />}
              
               />}
              {userRole === 'ROLE_COMMUNITYMEMBER' && <Route path="/community-dashboard" element={<CommunityDashboard />} />}
              <Route path="/notifications" element={<NotificationsPopup />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/profile" element={<UserProfile />} />

              <Route path="*" element={<Navigate to="/home" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
        {(userRole !== 'ROLE_ADMIN' && userRole !== 'ROLE_EXPERT') && <Footer />}
      </div>
    </Router>
  );
};

export default AppRouter;
