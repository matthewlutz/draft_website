import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  List,
  FileText,
  Shield,
  Server,
  Clock,
  ScrollText,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import './AdminLayout.css';
import './admin-shared.css';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/big-board', icon: List, label: 'Big Board' },
  { to: '/admin/player-notes', icon: FileText, label: 'Player Notes' },
  { to: '/admin/moderation', icon: Shield, label: 'Moderation' },
  { to: '/admin/system', icon: Server, label: 'System' },
  { to: '/admin/jobs', icon: Clock, label: 'Jobs' },
  { to: '/admin/audit-log', icon: ScrollText, label: 'Audit Log' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { role } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-title">Admin</span>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span className="admin-user-email">{user?.email}</span>
            <span className={`admin-role-badge role-${role?.toLowerCase()}`}>
              {role}
            </span>
          </div>
          <button className="admin-nav-link" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
          <NavLink to="/" className="admin-nav-link" onClick={() => setSidebarOpen(false)}>
            <span>Back to Site</span>
          </NavLink>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <span className="admin-topbar-title">NFL Draft Guide Admin</span>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
