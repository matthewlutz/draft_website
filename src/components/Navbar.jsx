import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="nav">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">
          NFL <span>Draft</span> 2026
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/prospects"
            className={`nav-link ${isActive('/prospects') || isActive('/player') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Big Board
          </Link>
          <Link
            to="/my-board"
            className={`nav-link ${isActive('/my-board') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            My Board
          </Link>
          <Link
            to="/mock-draft"
            className={`nav-link ${isActive('/mock-draft') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Mock Draft
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
