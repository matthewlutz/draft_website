import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserMenu.css';

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.displayName || user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout();
    } catch {
      // logout already clears state
    }
    navigate('/');
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-avatar" onClick={() => setOpen(!open)}>
        {initial}
      </button>
      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown-info">
            <span className="user-dropdown-name">{user?.displayName || 'User'}</span>
            <span className="user-dropdown-email">{user?.email}</span>
          </div>
          <div className="user-dropdown-divider" />
          <button className="user-dropdown-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
