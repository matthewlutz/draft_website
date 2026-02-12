import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabaseQuery, supabaseRest } from '../../supabase';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuditLog } from '../../hooks/useAuditLog';
import { ArrowLeft } from 'lucide-react';
import './AdminUserDetail.css';

export default function AdminUserDetail() {
  const { id } = useParams();
  const { isSuperAdmin } = useAdmin();
  const { log } = useAuditLog();
  const [user, setUser] = useState(null);
  const [boards, setBoards] = useState([]);
  const [auditEntries, setAuditEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadUser() {
    try {
      const [userRes, boardsRes, auditRes] = await Promise.all([
        supabaseQuery('users', { eq: { id }, limit: 1 }),
        supabaseQuery('boards', { eq: { user_id: id }, select: 'id,name,is_public,created_at' }).catch(() => ({ data: [] })),
        supabaseQuery('audit_log', { eq: { target_id: id }, order: { column: 'created_at', ascending: false }, limit: 20 }).catch(() => ({ data: [] })),
      ]);
      if (userRes.data && userRes.data.length > 0) {
        setUser(userRes.data[0]);
      }
      setBoards(boardsRes.data || []);
      setAuditEntries(auditRes.data || []);
    } catch (err) {
      console.error('Load user error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(newRole) {
    if (!confirm(`Change role to ${newRole}?`)) return;
    setActionLoading(true);
    try {
      await supabaseRest('users', 'PATCH', {
        data: { role: newRole },
        eq: { id },
      });
      await log('change_role', 'user', id, { old_role: user.role, new_role: newRole });
      setUser(prev => ({ ...prev, role: newRole }));
    } catch (err) {
      alert('Failed to update role: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function updateStatus(newStatus) {
    if (!confirm(`Set status to ${newStatus}?`)) return;
    setActionLoading(true);
    try {
      await supabaseRest('users', 'PATCH', {
        data: { status: newStatus },
        eq: { id },
      });
      await log(`user_${newStatus}`, 'user', id);
      setUser(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <div className="admin-empty"><div className="spinner"></div></div>;
  }

  if (!user) {
    return <div className="admin-empty">User not found</div>;
  }

  return (
    <div className="admin-user-detail">
      <Link to="/admin/users" className="aud-back">
        <ArrowLeft size={14} /> Back to Users
      </Link>

      <div className="aud-profile-card">
        <div className="aud-profile-header">
          <div>
            <h1 className="aud-profile-name">{user.display_name || 'No name'}</h1>
            <div className="aud-profile-email">{user.email}</div>
          </div>
          <div className="aud-profile-badges">
            <span className={`admin-badge admin-badge-${user.role === 'SUPER_ADMIN' ? 'red' : user.role === 'ADMIN' ? 'blue' : 'gray'}`}>
              {user.role || 'USER'}
            </span>
            <span className={`admin-badge admin-badge-${user.status === 'active' ? 'green' : user.status === 'suspended' ? 'yellow' : 'red'}`}>
              {user.status || 'active'}
            </span>
          </div>
        </div>

        <div className="aud-profile-meta">
          <div><span className="aud-meta-label">Joined:</span> {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</div>
          <div><span className="aud-meta-label">Last Active:</span> {user.last_active ? new Date(user.last_active).toLocaleString() : '—'}</div>
          <div><span className="aud-meta-label">Boards:</span> {boards.length}</div>
        </div>
      </div>

      {/* Admin actions */}
      {isSuperAdmin && (
        <div className="admin-section">
          <div className="admin-section-title">Admin Actions</div>
          <div className="aud-actions">
            <div className="aud-action-group">
              <span className="aud-action-label">Role:</span>
              <button
                className={`admin-btn admin-btn-sm ${user.role === 'USER' ? 'admin-btn-primary' : ''}`}
                onClick={() => updateRole('USER')}
                disabled={actionLoading || user.role === 'USER'}
              >
                User
              </button>
              <button
                className={`admin-btn admin-btn-sm ${user.role === 'ADMIN' ? 'admin-btn-primary' : ''}`}
                onClick={() => updateRole('ADMIN')}
                disabled={actionLoading || user.role === 'ADMIN'}
              >
                Admin
              </button>
              <button
                className={`admin-btn admin-btn-sm ${user.role === 'SUPER_ADMIN' ? 'admin-btn-primary' : ''}`}
                onClick={() => updateRole('SUPER_ADMIN')}
                disabled={actionLoading || user.role === 'SUPER_ADMIN'}
              >
                Super Admin
              </button>
            </div>
            <div className="aud-action-group">
              <span className="aud-action-label">Status:</span>
              <button
                className="admin-btn admin-btn-sm"
                onClick={() => updateStatus('active')}
                disabled={actionLoading || user.status === 'active'}
              >
                Activate
              </button>
              <button
                className="admin-btn admin-btn-sm"
                onClick={() => updateStatus('suspended')}
                disabled={actionLoading || user.status === 'suspended'}
                style={{ color: '#eab308' }}
              >
                Suspend
              </button>
              <button
                className="admin-btn admin-btn-sm admin-btn-danger"
                onClick={() => updateStatus('banned')}
                disabled={actionLoading || user.status === 'banned'}
              >
                Ban
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boards */}
      {boards.length > 0 && (
        <div className="admin-section">
          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <span className="admin-table-title">User's Boards</span>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Public</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {boards.map(b => (
                  <tr key={b.id}>
                    <td>{b.name || 'Untitled'}</td>
                    <td>{b.is_public ? 'Yes' : 'No'}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {b.created_at ? new Date(b.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit trail */}
      {auditEntries.length > 0 && (
        <div className="admin-section">
          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <span className="admin-table-title">Audit Trail</span>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Details</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {auditEntries.map(e => (
                  <tr key={e.id}>
                    <td>{e.action}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {e.details ? JSON.stringify(e.details) : '—'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {new Date(e.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
