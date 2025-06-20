// -----------------------------------------------------------------------------
// HeaderLogs.jsx
// Simple header for Login and Logout pages.
// Displays only a centered logo, with customization options.
// -----------------------------------------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import '../styles/HeaderLogs.css';

/*
  HeaderLogs: Simple header for Login and Logout pages.
  Displays only a centered logo, with optional customization for alt text and size.
*/

export default function HeaderLogs({ logoSrc = "/logo-com-escrita.png", alt = "Logo", style = {} }) {
  return (
    <header className="header-logs" style={{ textAlign: 'center', background: '#004d66', padding: 20, ...style }}>
      {/* Centered logo, customizable via props */}
      <img
        src={logoSrc}
        alt={alt}
        id="logo"
        style={{
          width: 350,
          height: 100,
          transform: 'scale(1.1)',
          transition: 'transform 0.3s ease-in-out',
          ...style.img
        }}
      />
    </header>
  );
}

HeaderLogs.propTypes = {
  logoSrc: PropTypes.string,
  alt: PropTypes.string,
  style: PropTypes.object,
};