import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabaseQuery } from '../../supabase';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, newUsers7d: 0, totalBoards: 0, reviewedProspects: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      // Fetch all stats in parallel
      const [usersRes, boardsRes, notesRes] = await Promise.all([
        supabaseQuery('users', { select: 'id,email,display_name,created_at,role,status', order: { column: 'created_at', ascending: false } }),
        supabaseQuery('boards', { select: 'id' }).catch(() => ({ data: [] })),
        supabaseQuery('admin_player_notes', { select: 'id' }).catch(() => ({ data: [] })),
      ]);

      const users = usersRes.data || [];
      const boards = boardsRes.data || [];
      const notes = notesRes.data || [];

      // Count new users in last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const newUsers7d = users.filter(u => new Date(u.created_at) > weekAgo).length;

      setStats({
        totalUsers: users.length,
        newUsers7d,
        totalBoards: boards.length,
        reviewedProspects: notes.length,
      });

      setRecentUsers(users.slice(0, 10));
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-empty">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Users</div>
          <div className="admin-stat-value">{stats.totalUsers}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">New Users (7d)</div>
          <div className="admin-stat-value">{stats.newUsers7d}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Boards</div>
          <div className="admin-stat-value">{stats.totalBoards}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Reviewed Prospects</div>
          <div className="admin-stat-value">{stats.reviewedProspects}</div>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-title">Quick Actions</div>
        <div className="admin-quick-actions">
          <Link to="/admin/big-board" className="admin-btn">Edit Big Board</Link>
          <Link to="/admin/player-notes" className="admin-btn">Edit Player Notes</Link>
          <Link to="/admin/users" className="admin-btn">Manage Users</Link>
          <Link to="/admin/audit-log" className="admin-btn">View Audit Log</Link>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <span className="admin-table-title">Recent Signups</span>
            <Link to="/admin/users" className="admin-btn admin-btn-sm">View All</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="admin-empty">No users yet</td>
                </tr>
              ) : (
                recentUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div>{u.display_name || 'No name'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge-${u.role === 'SUPER_ADMIN' ? 'red' : u.role === 'ADMIN' ? 'blue' : 'gray'}`}>
                        {u.role || 'USER'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status-dot ${u.status === 'active' ? 'active' : u.status === 'suspended' ? 'warning' : 'error'}`}></span>
                      {u.status || 'active'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
