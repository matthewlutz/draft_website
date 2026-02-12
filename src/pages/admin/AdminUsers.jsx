import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabaseQuery } from '../../supabase';
import { Search } from 'lucide-react';
import './AdminUsers.css';

const PAGE_SIZE = 20;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadUsers() {
    setLoading(true);
    try {
      const options = {
        select: 'id,email,display_name,role,status,created_at,last_active',
        order: { column: 'created_at', ascending: false },
        range: [page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1],
      };

      if (roleFilter) options.eq = { ...options.eq, role: roleFilter };
      if (statusFilter) options.eq = { ...options.eq, status: statusFilter };

      const { data, count } = await supabaseQuery('users', options);
      setUsers(data || []);
      setTotal(count || data?.length || 0);
    } catch (err) {
      console.error('Load users error:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    // Client-side filter for simplicity
    loadUsers();
  }

  const filteredUsers = search
    ? users.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.display_name?.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="admin-users">
      <div className="admin-page-header">
        <h1>Users</h1>
        <p>{total} total users</p>
      </div>

      <div className="admin-filters">
        <div className="admin-search" style={{ marginBottom: 0, flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0 var(--spacing-sm)' }}>
            <Search size={14} style={{ flexShrink: 0 }} />
            <input
              type="text"
              className="admin-input"
              style={{ border: 'none', background: 'transparent', maxWidth: 'none' }}
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>
        <select className="admin-select" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(0); }}>
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        <select className="admin-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="admin-empty"><div className="spinner"></div></td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={6} className="admin-empty">No users found</td></tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{u.display_name || 'No name'}</div>
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
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {u.last_active ? new Date(u.last_active).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <Link to={`/admin/users/${u.id}`} className="admin-btn admin-btn-sm">View</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>Prev</button>
          <span className="admin-pagination-info">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next</button>
        </div>
      )}
    </div>
  );
}
