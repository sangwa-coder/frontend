import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import "./Navbar.css";
import { CodeIcon } from "./icons"; // Adjust this if you have a different logo/icon

function NavBar({ userName, onLogout }) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink exact to="/" className="nav-logo">
          <span>Agrillnovate</span>
          <span className="icon">
            <CodeIcon />
          </span>
        </NavLink>

        <div className="nav-icon" onClick={handleClick}>
          {click ? (
            <FaTimes className="icon" />
          ) : (
            <FaBars className="icon" />
          )}
        </div>

        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <NavLink
              exact
              to="/home"
              activeClassName="active"
              className="nav-links"
              onClick={handleClick}
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              exact
              to="/Publicknowledge"
              activeClassName="active"
              className="nav-links"
              onClick={handleClick}
            >
              Public Knowledge
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              exact
              to="/agricultureresearch"
              activeClassName="active"
              className="nav-links"
              onClick={handleClick}
            >
              Agriculture Research
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              exact
              to="/forums"
              activeClassName="active"
              className="nav-links"
              onClick={handleClick}
            >
              Forums
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              exact
              to="/Infographics"
              activeClassName="active"
              className="nav-links"
              onClick={handleClick}
            >
              Infographics
            </NavLink>
          </li>
        </ul>
        <div className="user-actions">
          {userName ? (
            <>
              <NavLink
                exact
                to="/Profile"
                activeClassName="active"
                className="nav-links user-info"
                onClick={handleClick}
              >
                <FaUserCircle /> {userName}
              </NavLink>
              <button onClick={onLogout} className="logout-button"><FaSignOutAlt /> Logout</button>
            </>
          ) : (
            <>
              <NavLink
                exact
                to="/login"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Login
              </NavLink>
              <NavLink
                exact
                to="/signup"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
