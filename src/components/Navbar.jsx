import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="nav">
      <div className="container nav-content">
        <button
          className="nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <Link to="/" className="nav-logo">
          2026 NFL <span>Draft Guide</span>
        </Link>

        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="nav-overlay"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <div className="nav-drawer-header">
            <span className="nav-drawer-title">Menu</span>
            <button
              className="nav-drawer-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <Link
            to="/prospects"
            className={`nav-link ${isActive('/prospects') || isActive('/player') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Mr Lutz's Big Board
          </Link>
          <Link
            to="/my-board"
            className={`nav-link ${isActive('/my-board') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Build Board
          </Link>
          <Link
            to="/mock-draft"
            className={`nav-link ${isActive('/mock-draft') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Mock Draft
          </Link>

          {!user ? (
            <div className="nav-auth">
              <Link
                to="/login"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-small nav-signup"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="nav-auth">
              <UserMenu />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
