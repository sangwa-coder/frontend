import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaResearchgate, FaForumbee, FaChartPie, FaSignInAlt, FaUserPlus, FaBars, FaFile } from 'react-icons/fa';
import './Sidebar.css';
import { connect } from '../services/WebSocketService';
import { FaAddressCard, FaPersonRifle } from 'react-icons/fa6';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Sidebar = ({ userRole, isAuthenticated, onLogout, userName }) => {
  const [localUserRole, setLocalUserRole] = useState(userRole);
  const [localIsAuthenticated, setLocalIsAuthenticated] = useState(isAuthenticated);
  const [localUserName, setLocalUserName] = useState(userName);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setLocalUserRole(userRole);
    setLocalIsAuthenticated(isAuthenticated);
    setLocalUserName(userName);

    if (isAuthenticated) {
      connect(onMessageReceived, 'notifications');
    }
  }, [userRole, isAuthenticated, userName]);

  const onMessageReceived = (notification) => {
    // handle message received
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <button className="toggle-button" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>Agrillnovate</h2>
        </div>
        <ul className="sidebar-list">
          {!localIsAuthenticated && (
            <>
              <li><Link to="/home" className="flex items-center"><FaHome className="mr-2" /><span>Home</span></Link></li>
              <li><Link to="/public-knowledge" className="flex items-center"><FaResearchgate className="mr-2" /><span>Public Knowledge</span></Link></li>
              <li><Link to="/agricultureresearch" className="flex items-center"><FaChartPie className="mr-2" /><span>Agriculture Research</span></Link></li>
              <li><Link to="/forums" className="flex items-center"><FaForumbee className="mr-2" /><span>Forums</span></Link></li>
              <li><Link to="/infographics" className="flex items-center"><FaChartPie className="mr-2" /><span>Infographics</span></Link></li>
            </>
          )}
          {localIsAuthenticated ? (
            <>
              {localUserRole === 'ROLE_ADMIN' && (
                <>
                  <li><Link to="/admin-dashboard" className="flex items-center"><FaHome className="mr-2" /><span>Admin Dashboard</span></Link></li>
                  <li><Link to="/admin/manage-users" className="flex items-center"><FaUser className="mr-2" /><span>Manage Users</span></Link></li>
                  <li><Link to="/admin/manage-research" className="flex items-center"><FaResearchgate className="mr-2" /><span>Manage Research</span></Link></li>
                  <li><Link to="/admin/manage-forums" className="flex items-center"><FaForumbee className="mr-2" /><span>Manage Forums</span></Link></li>
                  <li><Link to="/admin/AllCommentsAndFeedbacks" className="flex items-center"><FaChartPie className="mr-2" /><span>Feedbacks and comments</span></Link></li>
                  <li><Link to="/admin/manage-pk" className="flex items-center"><FaAddressCard className="mr-2" /><span>Manage Public Knowledge</span></Link></li>
<li><Link to="/admin/manage-infographics" className="flex items-center"><FaChartPie className="mr-2" /><span>Manage Infographics</span></Link></li>
<li><Link to="/admin/report" className="flex items-center"><FaFile className="mr-2" /><span>Report</span></Link></li>
<li><Link to="/admin/AdminExpertPage" className="flex items-center"><AssessmentIcon className="mr-2" /><span>Expert Report</span></Link></li>
<li><Link to="/admin/FeedbackandCommentReport" className="flex items-center"><AssessmentIcon className="mr-2" /><span>F&C Report</span></Link></li>


                </>
              )}
              {localUserRole === 'ROLE_EXPERT' && (
                <>
                  <li><Link to="/expert-dashboard" className="flex items-center"><FaResearchgate className="mr-2" /><span>Dashboard</span></Link></li>
                  <li><Link to="/expert/add-research" className="flex items-center"><FaResearchgate className="mr-2" /><span>Publish Your Research</span></Link></li>
                  <li><Link to="/forums" className="flex items-center"><FaResearchgate className="mr-2" /><span>Forums</span></Link></li>

                </>
              )}
              {(localUserRole === 'ROLE_FARMER' || localUserRole === 'ROLE_COMMUNITYMEMBER') && (
                <>
                  <li><Link to="/home" className="flex items-center"><FaHome className="mr-2" /><span>Home</span></Link></li>
                  <li><Link to="/public-knowledge" className="flex items-center"><FaResearchgate className="mr-2" /><span>Public Knowledge</span></Link></li>
                  <li><Link to="/agricultureresearch" className="flex items-center"><FaChartPie className="mr-2" /><span>Agriculture Research</span></Link></li>
                  <li><Link to="/forums" className="flex items-center"><FaForumbee className="mr-2" /><span>Forums</span></Link></li>
                  <li><Link to="/infographics" className="flex items-center"><FaChartPie className="mr-2" /><span>Infographics</span></Link></li>
                  {localUserRole === 'ROLE_FARMER' && (
                    <>
                      <li><Link to="/farmer-dashboard" className="flex items-center"><FaHome className="mr-2" /><span>Farmer Dashboard</span></Link></li>
                      <li><Link to="/profile" className="flex items-center"><FaUser className="mr-2" /><span>Profile</span></Link></li>
                    </>
                  )}
                  {localUserRole === 'ROLE_COMMUNITYMEMBER' && (
                    <>
                      <li><Link to="/community-dashboard" className="flex items-center"><FaHome className="mr-2" /><span>Community Dashboard</span></Link></li>
                      <li><Link to="/profile" className="flex items-center"><FaUser className="mr-2" /><span>Profile</span></Link></li>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <li style={{ marginTop: 'auto' }}><Link to="/login" className="flex items-center"><FaSignInAlt className="mr-2" /><span>Login</span></Link></li>
              <li><Link to="/signup" className="flex items-center"><FaUserPlus className="mr-2" /><span>Signup</span></Link></li>
            </>
          )}
        </ul>
        {localIsAuthenticated && (
          <div className="user-info">
            <span>{localUserName}</span>
            <button onClick={onLogout} className="mt-2 p-2 bg-red-600 text-white rounded-md w-full text-center">Logout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
