import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

// PUBLIC_INTERFACE
/**
 * Navbar - Top navigation bar for the Resident Directory application.
 * Displays the app title and navigation links.
 */
function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-brand">
        <Link to="/" className="navbar-title" aria-label="Resident Directory Home">
          <span className="navbar-icon" aria-hidden="true">🏘️</span>
          <span>Resident Directory</span>
        </Link>
      </div>
      <div className="navbar-links">
        <Link
          to="/"
          className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          aria-current={location.pathname === '/' ? 'page' : undefined}
        >
          Directory
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
