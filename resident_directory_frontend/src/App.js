import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import { ResidentProvider } from './context/ResidentContext';
import Navbar from './components/Navbar';
import DirectoryPage from './pages/DirectoryPage';
import ResidentProfilePage from './pages/ResidentProfilePage';

// PUBLIC_INTERFACE
/**
 * App - Root component of the Resident Directory application.
 * Sets up React Router, global state provider (ResidentProvider),
 * and defines the application routing structure.
 *
 * Routes:
 *   /             -> DirectoryPage  (main resident list with filters/search)
 *   /resident/:id -> ResidentProfilePage  (individual resident profile)
 */
function App() {
  return (
    <ResidentProvider>
      <Router>
        <div className="app-shell">
          {/* Accessibility: skip to main content */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          {/* Top navigation bar */}
          <Navbar />

          {/* Page content */}
          <div id="main-content" className="app-content">
            <Routes>
              <Route path="/" element={<DirectoryPage />} />
              <Route path="/resident/:id" element={<ResidentProfilePage />} />
              {/* Fallback: redirect unknown routes to directory */}
              <Route path="*" element={<DirectoryPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ResidentProvider>
  );
}

export default App;
