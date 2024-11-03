// src/components/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Agrillnovate. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
